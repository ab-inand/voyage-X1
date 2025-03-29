import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationEmail, sendPasswordResetEmail } from './email';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';
const JWT_REMEMBER_EXPIRES_IN = '30d';

export interface UserData {
  id: string;
  email: string;
  name?: string;
  image?: string;
  isVerified: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: UserData;
  token?: string;
  error?: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: UserData, rememberMe: boolean = false): string {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: rememberMe ? JWT_REMEMBER_EXPIRES_IN : JWT_EXPIRES_IN }
  );
}

export function generateRandomToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function verifyToken(token: string): Promise<UserData | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        isVerified: true
      }
    });

    return user;
  } catch (error) {
    return null;
  }
}

export async function registerUser(
  email: string,
  password: string,
  name?: string
): Promise<AuthResponse> {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return {
        success: false,
        error: 'User already exists'
      };
    }

    const hashedPassword = await hashPassword(password);
    const verificationToken = generateRandomToken();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        emailVerificationToken: verificationToken,
        emailVerificationExpiry: verificationTokenExpiry
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        isVerified: true
      }
    });

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    const token = generateToken(user);

    return {
      success: true,
      user,
      token
    };
  } catch (error) {
    console.error('Registration error:', error);
    // Check for specific Prisma errors
    if (error.code === 'P2002') {
      return {
        success: false,
        error: 'Email already exists'
      };
    }
    return {
      success: false,
      error: 'Registration failed. Please try again.'
    };
  }
}

export async function loginUser(
  email: string,
  password: string,
  rememberMe: boolean = false
): Promise<AuthResponse> {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.password) {
      return {
        success: false,
        error: 'Invalid credentials'
      };
    }

    const isValidPassword = await comparePasswords(password, user.password);

    if (!isValidPassword) {
      return {
        success: false,
        error: 'Invalid credentials'
      };
    }

    const token = generateToken(
      {
        id: user.id,
        email: user.email,
        name: user.name || undefined,
        image: user.image || undefined,
        isVerified: user.isVerified
      },
      rememberMe
    );

    if (rememberMe) {
      const rememberMeToken = generateRandomToken();
      await prisma.user.update({
        where: { id: user.id },
        data: { rememberMeToken }
      });
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || undefined,
        image: user.image || undefined,
        isVerified: user.isVerified
      },
      token
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Login failed'
    };
  }
}

export async function verifyEmail(token: string): Promise<AuthResponse> {
  try {
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpiry: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return {
        success: false,
        error: 'Invalid or expired verification token'
      };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        emailVerificationToken: null,
        emailVerificationExpiry: null
      }
    });

    return {
      success: true
    };
  } catch (error) {
    console.error('Email verification error:', error);
    return {
      success: false,
      error: 'Email verification failed'
    };
  }
}

export async function requestPasswordReset(email: string): Promise<AuthResponse> {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    const resetToken = generateRandomToken();
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });

    await sendPasswordResetEmail(email, resetToken);

    return {
      success: true
    };
  } catch (error) {
    console.error('Password reset request error:', error);
    return {
      success: false,
      error: 'Failed to request password reset'
    };
  }
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<AuthResponse> {
  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return {
        success: false,
        error: 'Invalid or expired reset token'
      };
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    return {
      success: true
    };
  } catch (error) {
    console.error('Password reset error:', error);
    return {
      success: false,
      error: 'Failed to reset password'
    };
  }
}

export async function oauthLogin(
  provider: string,
  providerId: string,
  email: string,
  name?: string,
  image?: string
): Promise<AuthResponse> {
  try {
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          {
            AND: [
              { provider },
              { providerId }
            ]
          }
        ]
      }
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          name,
          image,
          provider,
          providerId,
          isVerified: true // OAuth users are considered verified
        }
      });
    } else {
      // Update existing user
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          provider,
          providerId,
          name: name || user.name,
          image: image || user.image,
          isVerified: true
        }
      });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      image: user.image || undefined,
      isVerified: user.isVerified
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || undefined,
        image: user.image || undefined,
        isVerified: user.isVerified
      },
      token
    };
  } catch (error) {
    console.error('OAuth login error:', error);
    return {
      success: false,
      error: 'OAuth login failed'
    };
  }
} 
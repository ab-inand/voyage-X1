import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import { hash, compare } from 'bcryptjs';
import { authenticator } from 'otplib';

// In a real application, these would be stored in a database
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // Hashed in production
const ADMIN_2FA_SECRET = process.env.ADMIN_2FA_SECRET || 'JBSWY3DPEHPK3PXP';

// Trial admin credentials
const TRIAL_ADMIN_USERNAME = 'trial_admin';
const TRIAL_ADMIN_PASSWORD = 'trial123'; // Hashed in production
const TRIAL_ADMIN_2FA_SECRET = 'JBSWY3DPEHPK3PXP';

// Trial admin expiration (7 days from now)
const TRIAL_EXPIRATION = new Date();
TRIAL_EXPIRATION.setDate(TRIAL_EXPIRATION.getDate() + 7);

export async function POST(request: Request) {
  try {
    const { username, password, twoFactorCode } = await request.json();

    // Check if it's a trial admin login
    const isTrialAdmin = username === TRIAL_ADMIN_USERNAME;
    const adminUsername = isTrialAdmin ? TRIAL_ADMIN_USERNAME : ADMIN_USERNAME;
    const adminPassword = isTrialAdmin ? TRIAL_ADMIN_PASSWORD : ADMIN_PASSWORD;
    const admin2FASecret = isTrialAdmin ? TRIAL_ADMIN_2FA_SECRET : ADMIN_2FA_SECRET;

    // Verify username and password
    if (username !== adminUsername) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValidPassword = await compare(password, await hash(adminPassword, 10));
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify 2FA code
    const isValid2FA = authenticator.verify({
      token: twoFactorCode,
      secret: admin2FASecret
    });

    if (!isValid2FA) {
      return NextResponse.json(
        { error: 'Invalid 2FA code' },
        { status: 401 }
      );
    }

    // Generate JWT token with role and expiration
    const token = sign(
      { 
        username, 
        role: isTrialAdmin ? 'trial_admin' : 'admin',
        expiration: isTrialAdmin ? TRIAL_EXPIRATION.toISOString() : undefined
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: isTrialAdmin ? '7d' : '1h' }
    );

    // Set secure cookie
    const response = NextResponse.json(
      { 
        success: true,
        role: isTrialAdmin ? 'trial_admin' : 'admin',
        expiration: isTrialAdmin ? TRIAL_EXPIRATION.toISOString() : undefined
      },
      { status: 200 }
    );

    response.cookies.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: isTrialAdmin ? 7 * 24 * 60 * 60 : 3600 // 7 days for trial, 1 hour for regular
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
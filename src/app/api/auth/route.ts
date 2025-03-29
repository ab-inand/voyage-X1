import { NextResponse } from 'next/server';
import { registerUser, loginUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, action } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    let result;
    if (action === 'register') {
      console.log('Attempting to register user:', { email, name });
      result = await registerUser(email, password, name);
      console.log('Registration result:', { success: result.success, error: result.error });
    } else {
      result = await loginUser(email, password);
    }

    if (!result.success) {
      console.error('Operation failed:', result.error);
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
} 
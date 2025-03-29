import { NextResponse } from 'next/server';
import { initiatePasswordReset } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const result = await initiatePasswordReset(email);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Password reset initiation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initiate password reset' },
      { status: 500 }
    );
  }
} 
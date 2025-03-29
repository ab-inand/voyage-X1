import { NextResponse } from 'next/server';
import { resetPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Token and new password are required' },
        { status: 400 }
      );
    }

    const result = await resetPassword(token, newPassword);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Password reset completion error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to complete password reset' },
      { status: 500 }
    );
  }
} 
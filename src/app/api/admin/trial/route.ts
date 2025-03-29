import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';

// In a real application, these would be stored in a database
const TRIAL_CODES = {
  'VOYAGEX-2024-001': { used: false, expires: '2025-12-31' },
  'VOYAGEX-2024-002': { used: false, expires: '2025-12-31' },
  'VOYAGEX-2024-003': { used: false, expires: '2025-12-31' },
  'VOYAGEX-2024-004': { used: false, expires: '2025-12-31' },
  'VOYAGEX-2024-005': { used: false, expires: '2025-12-31' }
};

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    // Validate trial code
    const trialCode = TRIAL_CODES[code];
    if (!trialCode) {
      return NextResponse.json(
        { error: 'Invalid trial code' },
        { status: 400 }
      );
    }

    if (trialCode.used) {
      return NextResponse.json(
        { error: 'This trial code has already been used' },
        { status: 400 }
      );
    }

    const expirationDate = new Date(trialCode.expires);
    if (expirationDate < new Date()) {
      return NextResponse.json(
        { error: 'This trial code has expired' },
        { status: 400 }
      );
    }

    // Mark code as used
    TRIAL_CODES[code].used = true;

    // Generate trial token
    const token = sign(
      { 
        code,
        role: 'trial_admin',
        expiration: trialCode.expires
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      token,
      expiration: trialCode.expires
    });
  } catch (error) {
    console.error('Trial code verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
/**
 * @file route.ts
 * @copyright 2024 Abhinand. All rights reserved.
 * @license Proprietary
 */

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || authHeader !== `Bearer ${process.env.MONITORING_API_KEY}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return NextResponse.json(
    { status: 'authenticated' },
    { status: 200 }
  );
} 
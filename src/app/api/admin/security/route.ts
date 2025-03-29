import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { monitoringService, SecurityResponse } from '@/lib/monitoring';

export async function GET(request: Request) {
  try {
    // Verify JWT token
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get security events from monitoring service
    const events = await monitoringService.getSecurityEvents();
    
    // Get active users count
    const activeUsers = await monitoringService.getActiveUsers();
    
    // Get last activity timestamp
    const lastActivity = await monitoringService.getLastActivity();

    const response: SecurityResponse = {
      events,
      activeUsers,
      lastActivity
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Security data error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
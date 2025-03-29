/**
 * @file page.tsx
 * @copyright 2024 Abhinand. All rights reserved.
 * @license Proprietary
 */

'use client';

import { useEffect, useState } from 'react';
import MonitoringDashboard from '@/components/admin/MonitoringDashboard';
import { useRouter } from 'next/navigation';

export default function AdminMonitoringPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for admin authentication
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth', {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_MONITORING_KEY}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Unauthorized');
        }
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication failed:', error);
        router.push('/');
      }
    };

    checkAuth();
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <MonitoringDashboard />;
} 
'use client';

import React from 'react';
import { BarChart3 } from 'lucide-react';
import AnalyticsView from '@/components/dashboard/AnalyticsView';
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader';

const AdminAnalyticsPage = () => {
  return (
    <div className="space-y-8">
      <DashboardPageHeader 
        title="Market Insights"
        subtitle="Platform-wide performance and engagement metrics"
        icon={<BarChart3 />}
      />

      <AnalyticsView isAdmin={true} />
    </div>
  );
};

export default AdminAnalyticsPage;

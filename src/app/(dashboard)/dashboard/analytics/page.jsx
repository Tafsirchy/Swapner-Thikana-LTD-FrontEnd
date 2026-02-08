'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';
import AnalyticsView from '@/components/dashboard/AnalyticsView';
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader';

const AgentAnalyticsPage = () => {
  return (
    <div className="space-y-8">
      <DashboardPageHeader 
        title="Performance Tracking"
        subtitle="Analyze your listing reach and lead conversion performance"
        icon={<TrendingUp />}
      />

      <AnalyticsView isAdmin={false} />
    </div>
  );
};

export default AgentAnalyticsPage;

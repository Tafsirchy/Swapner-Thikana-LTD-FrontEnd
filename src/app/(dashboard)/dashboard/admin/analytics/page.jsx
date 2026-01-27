'use client';

import React from 'react';
import AnalyticsView from '@/components/dashboard/AnalyticsView';

const AdminAnalyticsPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-100">Market Insights</h1>
        <p className="text-zinc-500">Platform-wide performance and engagement metrics</p>
      </div>

      <AnalyticsView isAdmin={true} />
    </div>
  );
};

export default AdminAnalyticsPage;

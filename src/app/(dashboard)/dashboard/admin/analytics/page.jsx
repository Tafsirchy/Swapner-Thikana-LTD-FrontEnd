'use client';

import React from 'react';
import { BarChart3 } from 'lucide-react';
import AnalyticsView from '@/components/dashboard/AnalyticsView';

const AdminAnalyticsPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-zinc-100 flex items-center gap-3">
          <BarChart3 size={32} className="text-brand-gold" />
          Market Insights
        </h1>
        <p className="text-zinc-500 mt-2 text-lg font-sans">Platform-wide performance and engagement metrics</p>
      </div>

      <AnalyticsView isAdmin={true} />
    </div>
  );
};

export default AdminAnalyticsPage;

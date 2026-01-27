'use client';

import React from 'react';
import AnalyticsView from '@/components/dashboard/AnalyticsView';

const AgentAnalyticsPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-100">Performance Tracking</h1>
        <p className="text-zinc-500">Analyze your listing reach and lead conversion performance</p>
      </div>

      <AnalyticsView isAdmin={false} />
    </div>
  );
};

export default AgentAnalyticsPage;

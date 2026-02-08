'use client';

import EmailPreviewTool from '@/components/admin/EmailPreviewTool';
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader';
import { Mail } from 'lucide-react';

export default function EmailPreviewPage() {
  return (
    <div className="space-y-8">
      <DashboardPageHeader 
        title="Email Template System"
        subtitle="Preview and test automated system emails"
        icon={<Mail />}
      />
      <EmailPreviewTool />
    </div>
  );
}

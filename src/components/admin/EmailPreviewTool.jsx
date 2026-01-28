'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Mail, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

const EmailPreviewTool = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('welcome');
  const [previewHtml, setPreviewHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [testParams, setTestParams] = useState({
    name: 'John Doe',
    url: 'https://example.com/verify-account'
  });

  const fetchTemplates = async () => {
    try {
      const res = await api.admin.getEmailTemplates();
      setTemplates(res.data.templates || []);
    } catch (err) {
      console.error('Error fetching templates:', err);
    }
  };

  const fetchPreview = useCallback(async () => {
    try {
      setLoading(true);
      // Construct URL manually since we want HTML response, not JSON
      const queryParams = new URLSearchParams(testParams).toString();
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/email-preview/${selectedTemplate}?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const html = await response.text();
      setPreviewHtml(html);
    } catch {
      toast.error('Failed to load preview');
    } finally {
      setLoading(false);
    }
  }, [selectedTemplate, testParams]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    fetchPreview();
  }, [fetchPreview]);

  return (
    <div className="bg-zinc-900 min-h-screen p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Controls Panel */}
        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 h-fit space-y-8">
          <div>
            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <Mail className="text-brand-gold" size={24} />
              Email Templates
            </h2>
            <p className="text-zinc-500 text-sm mt-1">Select a template to preview its design and responsiveness.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Select Template</label>
              <div className="grid grid-cols-1 gap-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedTemplate === template.id
                        ? 'bg-brand-gold/10 border-brand-gold text-brand-gold font-bold'
                        : 'bg-white/5 border-white/5 text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    <div className="text-sm">{template.name}</div>
                    <div className="text-[10px] opacity-60 font-normal">{template.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/10">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Test Data</label>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Recipient Name</label>
                  <input 
                    type="text" 
                    value={testParams.name}
                    onChange={(e) => setTestParams({...testParams, name: e.target.value})}
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none focus:border-brand-gold/50"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Action URL</label>
                  <input 
                    type="text" 
                    value={testParams.url}
                    onChange={(e) => setTestParams({...testParams, url: e.target.value})}
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none focus:border-brand-gold/50"
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={fetchPreview}
              className="w-full py-3 bg-white/5 text-zinc-300 font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              Refresh Preview
            </button>
          </div>
        </div>

        {/* Preview Frame */}
        <div className="lg:col-span-2 bg-white rounded-3xl overflow-hidden border border-white/10 shadow-xl relative min-h-[600px]">
          <div className="absolute top-0 left-0 right-0 h-12 bg-zinc-100 border-b border-zinc-200 flex items-center px-4 gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="flex-1 text-center text-xs font-medium text-zinc-400 bg-white mx-4 py-1.5 rounded-md shadow-sm border border-zinc-200 truncate">
               Subject: {selectedTemplate === 'verification' ? 'Verify Your Address' : selectedTemplate === 'welcome' ? 'Welcome to Excellence' : 'Reset Your Password'}
            </div>
          </div>
          
          <iframe 
            srcDoc={previewHtml}
            title="Email Preview"
            className="w-full h-full pt-12"
            style={{ minHeight: '600px' }}
          />
        </div>

      </div>
    </div>
  );
};

export default EmailPreviewTool;

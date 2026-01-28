'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, FileText } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-royal-deep pt-32 pb-24">
      <div className="max-container px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mb-6"
          >
            <Shield size={16} />
            Data Protection
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-6">
            Privacy <span className="text-brand-gold italic">Policy</span>
          </h1>
          <p className="max-w-2xl mx-auto text-zinc-400 text-lg leading-relaxed">
            Your privacy is our utmost priority. We are committed to protecting your personal information with the highest standards of security.
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto glass p-8 md:p-12 rounded-[2.5rem] border-white/10 shadow-2xl space-y-12">
          
          <section>
            <h2 className="text-2xl font-bold text-zinc-100 mb-4 flex items-center gap-3">
              <FileText className="text-brand-gold" size={24} />
              1. Information Collection
            </h2>
            <p className="text-zinc-400 leading-relaxed space-y-4">
              We collect information that you provide directly to us, such as when you create an account, subscribe to our newsletter, request customer support, or contact us for inquiries. This may include your name, email address, phone number, and any other information you choose to provide.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-100 mb-4 flex items-center gap-3">
              <Lock className="text-brand-gold" size={24} />
              2. Use of Information
            </h2>
            <div className="text-zinc-400 leading-relaxed space-y-4">
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Provide, maintain, and improve our services.</li>
                <li>Process transactions and send related information.</li>
                <li>Send you technical notices, updates, security alerts, and support messages.</li>
                <li>Respond to your comments, questions, and requests.</li>
                <li>Communicate with you about products, services, offers, and events.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-100 mb-4 flex items-center gap-3">
              <Shield className="text-brand-gold" size={24} />
              3. Data Security
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              We implement appropriate technical and organizational measures to protect the security of your personal information. However, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-100 mb-4">4. Third-Party Sharing</h2>
            <p className="text-zinc-400 leading-relaxed">
              We do not share your personal information with third parties except as described in this policy. We may share information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-100 mb-4">5. Your Mobile Rights</h2>
            <p className="text-zinc-400 leading-relaxed">
              You have the right to request access to and receive information about the personal information we maintain about you, update and correct inaccuracies in your personal information, and have the information blocked or deleted, as appropriate.
            </p>
          </section>

          <div className="pt-8 border-t border-brand-gold/10 text-sm text-zinc-500">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;

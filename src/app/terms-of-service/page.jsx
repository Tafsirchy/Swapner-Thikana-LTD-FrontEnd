'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Gavel, CheckCircle, AlertCircle } from 'lucide-react';

const TermsOfServicePage = () => {
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
            <Gavel size={16} />
            Legal Agreement
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-6">
            Terms of <span className="text-brand-gold italic">Service</span>
          </h1>
          <p className="max-w-2xl mx-auto text-zinc-400 text-lg leading-relaxed">
            Please read these terms carefully before using our services. By accessing or using our platform, you agree to be bound by these terms.
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto glass p-8 md:p-12 rounded-[2.5rem] border-white/10 shadow-2xl space-y-12">
          
          <section>
            <h2 className="text-2xl font-bold text-zinc-100 mb-4 flex items-center gap-3">
              <CheckCircle className="text-brand-gold" size={24} />
              1. Acceptance of Terms
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              By accessing and using the shwapner Thikana Ltd website and services, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-100 mb-4">2. Description of Service</h2>
            <p className="text-zinc-400 leading-relaxed">
              shwapner Thikana Ltd provides users with access to a rich collection of resources, including various communications tools, search services, and personalized content through its network of properties. You understand and agree that the Service may include advertisements and that these advertisements are necessary for shwapner Thikana Ltd to provide the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-100 mb-4">3. User Conduct</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              You agree to use the Service only for purposes that are legal, proper and in accordance with these Terms and any applicable policies or guidelines. You agree that you will not:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-400">
              <li>Use the Service in connection with any survey, contest, pyramid scheme, chain letter, junk email, spamming, or any duplicative or unsolicited messages.</li>
              <li>Defame, abuse, harass, stalk, threaten or otherwise violate the legal rights of others.</li>
              <li>Publish, post, upload, distribute or disseminate any inappropriate, profane, defamatory, infringing, obscene, indecent or unlawful topic, name, material or information.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-100 mb-4 flex items-center gap-3">
              <AlertCircle className="text-brand-gold" size={24} />
              4. Disclaimer of Warranties
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              You expressly understand and agree that your use of the Service is at your sole risk. The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. shwapner Thikana Ltd expressly disclaims all warranties of any kind, whether express or implied.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-100 mb-4">5. Limitation of Liability</h2>
            <p className="text-zinc-400 leading-relaxed">
              In no event shall shwapner Thikana Ltd be liable for any direct, indirect, incidental, special, consequential or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data or other intangible losses.
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

export default TermsOfServicePage;

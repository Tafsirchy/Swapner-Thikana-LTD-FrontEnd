'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Map, ArrowRight, Home, Building2, Briefcase, Users, FileText } from 'lucide-react';

const SitemapPage = () => {
  const sections = [
    {
      title: 'Main Navigation',
      icon: <Home size={24} />,
      links: [
        { label: 'Home', href: '/' },
        { label: 'About Us', href: '/about' },
        { label: 'Our History', href: '/about/history' },
        { label: 'Management', href: '/about/management' },
        { label: 'Our Magazines', href: '/about/magazines' },
      ]
    },
    {
      title: 'Properties & Projects',
      icon: <Building2 size={24} />,
      links: [
        { label: 'All Properties', href: '/properties' },
        { label: 'New Projects', href: '/projects' },
        { label: 'Luxury Villas', href: '/properties?type=villa' }, // Redirecting to filter
        { label: 'Apartments', href: '/properties?type=apartment' }, // Redirecting to filter
      ]
    },
    {
      title: 'Services',
      icon: <Briefcase size={24} />,
      links: [
        { label: 'Sell with Us', href: '/sell' },
        { label: 'Real Estate Consultancy', href: '/contact?subject=consultancy' },
        { label: 'Asset Management', href: '/contact?subject=asset_management' },
      ]
    },
    {
      title: 'Connect',
      icon: <Users size={24} />,
      links: [
        { label: 'Our Agents', href: '/agents' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Blog / Insights', href: '/blog' },
      ]
    },
    {
      title: 'Legal',
      icon: <FileText size={24} />,
      links: [
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms of Service', href: '/terms-of-service' },
      ]
    }
  ];

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
            <Map size={16} />
            Site Overview
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-6">
            Site<span className="text-brand-gold italic">map</span>
          </h1>
          <p className="max-w-2xl mx-auto text-zinc-400 text-lg leading-relaxed">
            Navigate through our entire digital estate with ease.
          </p>
        </div>

        {/* Sitemap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/5 rounded-3xl p-8 hover:border-brand-gold/30 transition-all group"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold group-hover:scale-110 transition-transform">
                  {section.icon}
                </div>
                <h3 className="text-xl font-bold text-zinc-100">{section.title}</h3>
              </div>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href}
                      className="flex items-center gap-2 text-zinc-400 hover:text-brand-gold transition-colors text-sm group/link"
                    >
                      <ArrowRight size={14} className="text-brand-gold/50 group-hover/link:translate-x-1 transition-transform" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SitemapPage;

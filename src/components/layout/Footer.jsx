'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin, Send } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-royal-deep border-t border-brand-gold/20 pt-16 pb-8 overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-brand-royal/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-container px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex flex-col items-start shrink-0">
              <span className="text-3xl font-bold tracking-tighter text-brand-gold leading-none italic">
                স্বপনের ঠিকানা
              </span>
              <img src="/logo.png" alt="Swapner Thikana" className="h-16 w-auto" />
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              Excellence in luxury real estate. We guide you to your dream address with integrity, 
              sophistication, and world-class service.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 rounded-full border border-brand-gold/20 text-brand-gold hover:bg-brand-gold hover:text-royal-deep transition-all duration-300">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 rounded-full border border-brand-gold/20 text-brand-gold hover:bg-brand-gold hover:text-royal-deep transition-all duration-300">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 rounded-full border border-brand-gold/20 text-brand-gold hover:bg-brand-gold hover:text-royal-deep transition-all duration-300">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 rounded-full border border-brand-gold/20 text-brand-gold hover:bg-brand-gold hover:text-royal-deep transition-all duration-300">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <h4 className="text-brand-gold font-semibold tracking-wide uppercase text-sm">Quick Links</h4>
            <ul className="flex flex-col gap-3">
              {['Properties', 'New Projects', 'Luxury Villas', 'Commercial Space', 'Sell with Us', 'Agents'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-zinc-400 hover:text-brand-gold text-sm transition-colors flex items-center group">
                    <span className="w-0 h-0.5 bg-brand-gold mr-0 transition-all duration-300 group-hover:w-2 group-hover:mr-2"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            <h4 className="text-brand-gold font-semibold tracking-wide uppercase text-sm">Contact Us</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3 group">
                <div className="p-2 rounded-lg bg-zinc-900 group-hover:bg-brand-emerald/10 transition-colors">
                  <MapPin size={18} className="text-brand-gold group-hover:text-brand-emerald transition-colors" />
                </div>
                <div className="text-sm">
                  <span className="block text-zinc-100 font-medium">Head Office</span>
                  <span className="text-zinc-400">Gulshan-1, Dhaka 1212</span>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="p-2 rounded-lg bg-zinc-900 group-hover:bg-brand-emerald/10 transition-colors">
                  <Phone size={18} className="text-brand-gold group-hover:text-brand-emerald transition-colors" />
                </div>
                <div className="text-sm">
                  <span className="block text-zinc-100 font-medium">Phone Number</span>
                  <a href="tel:+8801234567890" className="text-zinc-400 hover:text-brand-gold transition-colors">+880 1234 567 890</a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="p-2 rounded-lg bg-zinc-900 group-hover:bg-brand-emerald/10 transition-colors">
                  <Mail size={18} className="text-brand-gold group-hover:text-brand-emerald transition-colors" />
                </div>
                <div className="text-sm">
                  <span className="block text-zinc-100 font-medium">Email Address</span>
                  <a href="mailto:info@swapner-thikana.com" className="text-zinc-400 hover:text-brand-gold transition-colors">info@swapner-thikana.com</a>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-6">
            <h4 className="text-brand-gold font-semibold tracking-wide uppercase text-sm">Luxury Insights</h4>
            <p className="text-zinc-400 text-sm">Subscribe for exclusive listings and market reports.</p>
            <form className="relative mt-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email address"
                className="w-full bg-zinc-900 border border-brand-gold/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold/40 transition-colors text-zinc-100 placeholder:text-zinc-600"
              />
              <button 
                className="absolute right-1 top-1 bottom-1 px-4 bg-brand-gold text-royal-deep rounded-lg hover:bg-brand-gold-light transition-colors active:scale-95 duration-100"
                aria-label="Subscribe"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-brand-gold/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-zinc-500">
          <p>© {currentYear} Swapner Thikana Ltd. All Rights Reserved.</p>
          <div className="flex items-center gap-8">
            <Link href="#" className="hover:text-brand-gold transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-brand-gold transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-brand-gold transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

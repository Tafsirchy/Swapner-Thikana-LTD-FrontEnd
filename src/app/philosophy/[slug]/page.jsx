'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gem, 
  ShieldCheck, 
  Award, 
  Users, 
  ArrowLeft, 
  ChevronRight,
  Sparkles,
  Building2,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const PHILOSOPHY_DATA = {
  exclusivity: {
    title: "Exclusivity",
    subtitle: "Defined by Scarcity, Tailored by Choice",
    icon: <Gem size={48} />,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
    accent: "text-brand-gold",
    bgAccent: "bg-brand-gold/10",
    description: "In a world of mass production, we specialize in the unique. Exclusivity at Shwapner Thikana is not just about price points; it is about the rarity of the opportunity and the distinction of the address.",
    points: [
      {
        title: "Off-Market Access",
        text: "Gain priority access to Dhaka's most coveted properties before they hit the public market."
      },
      {
        title: "Limited Portfolio",
        text: "We deliberately maintain a curated selection of properties to ensure every listing meets our elite standards."
      },
      {
        title: "VIP Networking",
        text: "Connect with a community of like-minded high-net-worth individuals and global investors."
      }
    ]
  },
  integrity: {
    title: "Integrity",
    subtitle: "The Unshakable Foundation of Trust",
    icon: <ShieldCheck size={48} />,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
    accent: "text-emerald-500",
    bgAccent: "bg-emerald-500/10",
    description: "Transparency is our strongest asset. Every transaction at Shwapner Thikana is backed by rigorous legal verification and an uncompromising ethical code that protects your legacy.",
    points: [
      {
        title: "Legally Vetted Titles",
        text: "Every property undergoes a 42-point legal audit to ensure absolute clarity and security of ownership."
      },
      {
        title: "Transparent Valuation",
        text: "Real-time market analytics provide you with honest, data-driven pricing without hidden premiums."
      },
      {
        title: "Ethical Brokerage",
        text: "Our consultants operate under a strict fiduciary duty to put your interests ahead of any transaction."
      }
    ]
  },
  precision: {
    title: "Precision",
    subtitle: "The Geometry of Architectural Perfection",
    icon: <Award size={48} />,
    image: "https://images.unsplash.com/photo-1503387762-592dea58ef23?q=80&w=2000&auto=format&fit=crop",
    accent: "text-brand-gold",
    bgAccent: "bg-brand-gold/10",
    description: "We believe excellence is found in the details. From the initial blueprint to the final interior finish, our commitment to precision ensures that your home is a masterpiece of engineering.",
    points: [
      {
        title: "Design Accuracy",
        text: "Utilizing BIM and advanced architectural modeling to ensure zero variance between plan and production."
      },
      {
        title: "Material Science",
        text: "We source only the finest globally-vetted materials, from Italian marble to German structural steel."
      },
      {
        title: "Quality Assurance",
        text: "Multi-stage inspections by independent consultants ensure every square inch meets international standards."
      }
    ]
  },
  concierge: {
    title: "Concierge",
    subtitle: "Bespoke Service Beyond Real Estate",
    icon: <Users size={48} />,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop",
    accent: "text-brand-gold",
    bgAccent: "bg-brand-gold/10",
    description: "Our relationship doesn't end at the handover. Our VIP Concierge service is designed to handle every aspect of your luxury lifestyle, from asset management to personalized settling-in services.",
    points: [
      {
        title: "Lifestyle Management",
        text: "Interior design, furnishing, and home automation consulting tailored to your personal aesthetic."
      },
      {
        title: "Property Management",
        text: "Full-service maintenance and tenant management for investors seeking hands-off capital growth."
      },
      {
        title: "Global Relocation",
        text: "Dedicated support for international clients, handling everything from legal paperwork to logistics."
      }
    ]
  }
};

const PhilosophyDetailPage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const data = PHILOSOPHY_DATA[slug];

  if (!data) {
    return (
      <div className="min-h-screen bg-royal-deep flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-cinzel text-brand-gold mb-4">Content Not Found</h1>
        <button 
          onClick={() => router.push('/about')}
          className="text-zinc-400 hover:text-white flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Return to About Us
        </button>
      </div>
    );
  }

  const otherValues = Object.keys(PHILOSOPHY_DATA).filter(k => k !== slug);

  return (
    <div className="min-h-screen bg-royal-deep text-zinc-100 selection:bg-brand-gold/30">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-royal-deep/80 backdrop-blur-xl border-b border-white/5 py-6">
        <div className="max-container px-4 flex items-center justify-between">
          <Link href="/about" className="flex items-center gap-2 text-zinc-400 hover:text-brand-gold transition-colors font-bold uppercase tracking-widest text-xs">
            <ArrowLeft size={16} /> Back to Philosophy
          </Link>
          <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
            <span>Our Philosophy</span>
            <ChevronRight size={10} />
            <span className="text-brand-gold">{data.title}</span>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section className="max-container px-4 mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 space-y-8"
            >
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${data.bgAccent} border border-white/5 ${data.accent} text-xs font-bold uppercase tracking-[0.2em] shadow-lg shadow-black/20`}>
                <Sparkles size={14} /> Platinum Pillar
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-cinzel font-bold tracking-tight leading-none">
                {data.title}<span className="text-brand-gold">.</span>
              </h1>
              <p className="text-xl md:text-2xl text-zinc-300 font-medium italic border-l-4 border-brand-gold pl-8 py-2">
                &quot;{data.subtitle}&quot;
              </p>
              <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl font-sans">
                {data.description}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="lg:col-span-5 relative aspect-[4/5] overflow-hidden"
            >
              <div className="absolute inset-0 border-2 border-brand-gold/20 -translate-x-6 translate-y-6 z-0"></div>
              <div className="relative z-10 w-full h-full overflow-hidden shadow-2xl shadow-black/50">
                <Image 
                  src={data.image}
                  alt={data.title}
                  fill
                  className="object-cover scale-110 motion-safe:animate-slow-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-royal-deep via-transparent to-transparent opacity-60"></div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Details Grid */}
        <section className="bg-white/[0.02] border-y border-white/5 py-32 relative overflow-hidden">
          <div className="max-container px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {data.points.map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="p-8 bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-3xl group hover:border-brand-gold/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-6 group-hover:scale-110 transition-transform">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-100 mb-4 font-cinzel tracking-wide">{point.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed italic">{point.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Quote */}
        <section className="max-container px-4 py-32 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto space-y-8"
            >
                <div className="w-px h-24 bg-gradient-to-b from-transparent via-brand-gold to-transparent mx-auto"></div>
                <h2 className="text-3xl md:text-5xl font-cinzel italic text-white leading-tight">
                    &quot;We don't just sell property; we curate lifestyles. Every project under our portfolio is a testament to architectural brilliance and luxury.&quot;
                </h2>
                <div className="flex items-center justify-center gap-4 pt-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden relative border-2 border-brand-gold">
                        <Image src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1200" alt="CEO" fill className="object-cover" />
                    </div>
                    <div className="text-left">
                        <span className="block text-zinc-100 font-bold uppercase tracking-widest text-xs">Tafsir Chowdhury</span>
                        <span className="text-brand-gold font-bold text-[10px] uppercase">Founder & CEO</span>
                    </div>
                </div>
            </motion.div>
        </section>

        {/* Exploration Footer */}
        <section className="max-container px-4 py-24 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div>
              <h4 className="text-2xl font-cinzel text-zinc-400 mb-2 uppercase tracking-widest">Explore More</h4>
              <p className="text-zinc-600">The four pillars of Shwapner Thikana Platinum Philosophy.</p>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              {otherValues.map(v => (
                <Link 
                  key={v}
                  href={`/philosophy/${v}`}
                  className="px-8 py-4 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-brand-gold hover:text-royal-deep hover:border-brand-gold transition-all"
                >
                  {v}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        @keyframes slow-zoom {
          from { transform: scale(1.1); }
          to { transform: scale(1.25); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 15s infinite alternate ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default PhilosophyDetailPage;

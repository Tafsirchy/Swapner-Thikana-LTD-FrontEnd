'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, PieChart, DollarSign } from 'lucide-react';

const MortgageCalculator = ({ defaultPrice = 0 }) => {
  const [propertyPrice, setPropertyPrice] = useState(defaultPrice || 5000000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTerm, setLoanTerm] = useState(20);
  
  const [results, setResults] = useState({
    loanAmount: 0,
    downPayment: 0,
    monthlyPayment: 0,
    totalInterest: 0,
    totalPayment: 0
  });

  // Calculate mortgage when inputs change
  useEffect(() => {
    calculateMortgage();
  }, [propertyPrice, downPaymentPercent, interestRate, loanTerm]);

  const calculateMortgage = () => {
    const price = Number(propertyPrice) || 0;
    const downPayment = (price * downPaymentPercent) / 100;
    const loanAmount = price - downPayment;
    
    // Monthly interest rate
    const monthlyRate = (Number(interestRate) / 100) / 12;
    // Number of payments
    const numberOfPayments = Number(loanTerm) * 12;
    
    // Calculate monthly payment using formula: M = P[r(1+r)^n]/[(1+r)^n-1]
    let monthlyPayment = 0;
    if (monthlyRate === 0) {
      monthlyPayment = loanAmount / numberOfPayments;
    } else {
      monthlyPayment = loanAmount * 
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }
    
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;

    setResults({
      loanAmount,
      downPayment,
      monthlyPayment: monthlyPayment || 0,
      totalInterest: totalInterest || 0,
      totalPayment: totalPayment || 0
    });
  };

  const formatCurrency = (amount) => {
    return `৳${Math.round(amount).toLocaleString('en-BD')}`;
  };

  const principalPercentage = ((results.loanAmount / results.totalPayment) * 100) || 0;
  const interestPercentage = ((results.totalInterest / results.totalPayment) * 100) || 0;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        
        {/* Results Section - Mobile First (Appears first on SM, second on LG) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="order-1 lg:order-2 w-full lg:w-[400px] xl:w-[450px] space-y-4 md:space-y-6"
        >
          {/* Monthly Payment - Highlight */}
          <div className="glass border-brand-gold/30 rounded-[2rem] p-6 md:p-8 bg-gradient-to-br from-brand-gold/10 via-transparent to-transparent">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-brand-gold/10">
                <DollarSign className="text-brand-gold" size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">
                Monthly Payment
              </span>
            </div>
            <div className="text-4xl md:text-5xl font-bold text-brand-gold mb-2 tracking-tight">
              {formatCurrency(results.monthlyPayment)}
            </div>
            <p className="text-xs md:text-sm text-zinc-500">Estimated over {loanTerm} luxury years</p>
          </div>

          {/* Breakdown Card */}
          <div className="glass border-white/5 rounded-[2rem] p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <PieChart className="text-brand-gold" size={18} />
              <h3 className="font-bold text-zinc-100 text-sm md:text-base">Financial Breakdown</h3>
            </div>

            {/* Visual Bar - Compact for SM */}
            <div className="mb-6">
              <div className="h-3 md:h-4 bg-white/5 rounded-full overflow-hidden flex">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${principalPercentage}%` }}
                  className="bg-brand-gold h-full"
                />
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${interestPercentage}%` }}
                  className="bg-zinc-700 h-full"
                />
              </div>
              <div className="flex items-center justify-between mt-4 text-[10px] md:text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-gold"></div>
                  <span className="text-zinc-500 font-medium">Principal ({principalPercentage.toFixed(0)}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                  <span className="text-zinc-500 font-medium">Interest ({interestPercentage.toFixed(0)}%)</span>
                </div>
              </div>
            </div>

            {/* Stats List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 group hover:border-brand-gold/20 transition-colors pointer-events-none">
                <span className="text-xs md:text-sm text-zinc-500">Loan Amount</span>
                <span className="font-bold text-zinc-200 text-sm md:text-base">{formatCurrency(results.loanAmount)}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 pointer-events-none">
                <span className="text-xs md:text-sm text-zinc-500">Down Payment</span>
                <span className="font-bold text-zinc-200 text-sm md:text-base">{formatCurrency(results.downPayment)}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-950/40 border border-white/5 pointer-events-none">
                <span className="text-xs md:text-sm text-zinc-500">Total Interest</span>
                <span className="font-bold text-zinc-100 text-sm md:text-base">{formatCurrency(results.totalInterest)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Input Section - Appears second on SM */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="order-2 lg:order-1 flex-1 glass border-white/10 rounded-[2.5rem] p-6 md:p-10"
        >
          <div className="flex items-center gap-3 mb-8 md:mb-10">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center">
              <Calculator className="text-brand-gold" size={22} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-zinc-100">Adjust Parameters</h2>
              <p className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest font-bold mt-1">Refine your investment</p>
            </div>
          </div>

          <div className="space-y-8 md:space-y-10">
            {/* Property Price */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-zinc-500 tracking-[0.2em] mb-4">
                Property Price
              </label>
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-gold font-bold text-xl md:text-2xl">৳</span>
                <input
                  type="number"
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(e.target.value)}
                  className="w-full bg-zinc-950/50 border border-white/10 rounded-2xl pl-12 pr-6 py-4 md:py-5 text-zinc-100 outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/20 transition-all text-xl md:text-2xl font-bold"
                />
              </div>
            </div>

            {/* Range Selectors - Unified Styling */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* Down Payment */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">
                    Down Payment
                  </label>
                  <span className="px-3 py-1 bg-brand-gold/10 text-brand-gold rounded-full text-xs font-bold">
                    {downPaymentPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full accent-brand-gold h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-600 font-bold">
                  <span>MIN 0%</span>
                  <span className="text-zinc-400">{formatCurrency(results.downPayment)}</span>
                  <span>MAX 50%</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">
                    Interest Rate
                  </label>
                  <span className="px-3 py-1 bg-brand-gold/10 text-brand-gold rounded-full text-xs font-bold">
                    {interestRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="15"
                  step="0.5"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-brand-gold h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-600 font-bold">
                  <span>MIN 5%</span>
                  <span>MAX 15%</span>
                </div>
              </div>
            </div>

            {/* Loan Term Selection - Touch Targets */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-zinc-500 tracking-wider mb-5">
                Loan Duration (Years)
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {[5, 10, 15, 20, 25, 30].map((years) => (
                  <button
                    key={years}
                    onClick={() => setLoanTerm(years)}
                    className={`h-14 md:h-12 flex items-center justify-center rounded-xl font-bold text-xs md:text-sm transition-all border ${
                      loanTerm === years
                        ? 'bg-brand-gold border-brand-gold text-royal-deep shadow-lg shadow-brand-gold/20 scale-[1.02]'
                        : 'bg-white/5 border-white/10 text-zinc-500 hover:border-brand-gold/40'
                    }`}
                  >
                    {years}Y
                  </button>
                ))}
              </div>
            </div>

            {/* Info Note - Moved inside input section for mobile flow */}
            <div className="p-5 md:p-6 rounded-2xl bg-brand-gold/5 border border-brand-gold/10">
              <div className="flex items-start gap-4">
                <TrendingUp className="text-brand-gold mt-1 shrink-0" size={18} />
                <div className="text-[11px] md:text-xs text-zinc-500 leading-relaxed font-medium">
                  <p className="text-zinc-400 mb-1">Estimated based on standard banking protocols in Bangladesh.</p>
                  <p>Rates typically fluctuate between 8.5% — 11.5%. Fees and insurance not included.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MortgageCalculator;

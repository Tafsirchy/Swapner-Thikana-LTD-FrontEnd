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
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass border-white/10 rounded-3xl p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center">
              <Calculator className="text-brand-gold" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-zinc-100">Mortgage Calculator</h2>
          </div>

          <div className="space-y-6">
            {/* Property Price */}
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider mb-3">
                Property Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-medium">৳</span>
                <input
                  type="number"
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-zinc-100 outline-none focus:border-brand-gold/50 transition-colors text-lg font-semibold"
                />
              </div>
            </div>

            {/* Down Payment */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider">
                  Down Payment
                </label>
                <span className="text-brand-gold font-bold">{downPaymentPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full accent-brand-gold"
              />
              <div className="flex justify-between text-xs text-zinc-500 mt-2">
                <span>0%</span>
                <span className="text-zinc-400 font-medium">{formatCurrency(results.downPayment)}</span>
                <span>50%</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider">
                  Interest Rate
                </label>
                <span className="text-brand-gold font-bold">{interestRate}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="15"
                step="0.5"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-brand-gold"
              />
              <div className="flex justify-between text-xs text-zinc-500 mt-2">
                <span>5%</span>
                <span>15%</span>
              </div>
            </div>

            {/* Loan Term */}
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider mb-3">
                Loan Term
              </label>
              <div className="grid grid-cols-6 gap-2">
                {[5, 10, 15, 20, 25, 30].map((years) => (
                  <button
                    key={years}
                    onClick={() => setLoanTerm(years)}
                    className={`px-3 py-2.5 rounded-xl font-bold text-sm transition-all ${
                      loanTerm === years
                        ? 'bg-brand-gold text-royal-deep shadow-lg shadow-brand-gold/20'
                        : 'bg-white/5 border border-white/10 text-zinc-400 hover:border-brand-gold/30'
                    }`}
                  >
                    {years}y
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Monthly Payment - Highlight */}
          <div className="glass border-brand-gold/30 rounded-3xl p-8 bg-gradient-to-br from-brand-gold/5 to-transparent">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="text-brand-gold" size={24} />
              <span className="text-xs font-bold uppercase text-zinc-400 tracking-wider">
                Monthly Payment
              </span>
            </div>
            <div className="text-5xl font-bold text-brand-gold mb-2">
              {formatCurrency(results.monthlyPayment)}
            </div>
            <p className="text-sm text-zinc-400">Per month for {loanTerm} years</p>
          </div>

          {/* Breakdown */}
          <div className="glass border-white/10 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <PieChart className="text-brand-gold" size={20} />
              <h3 className="font-bold text-zinc-100">Payment Breakdown</h3>
            </div>

            {/* Visual Bar */}
            <div className="mb-6">
              <div className="h-4 bg-white/5 rounded-full overflow-hidden flex">
                <div 
                  className="bg-brand-gold h-full transition-all duration-500"
                  style={{ width: `${principalPercentage}%` }}
                />
                <div 
                  className="bg-red-500 h-full transition-all duration-500"
                  style={{ width: `${interestPercentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-brand-gold"></div>
                  <span className="text-zinc-400">Principal ({principalPercentage.toFixed(1)}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-zinc-400">Interest ({interestPercentage.toFixed(1)}%)</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <span className="text-sm text-zinc-400">Loan Amount</span>
                <span className="font-bold text-zinc-100">{formatCurrency(results.loanAmount)}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <span className="text-sm text-zinc-400">Down Payment</span>
                <span className="font-bold text-zinc-100">{formatCurrency(results.downPayment)}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <span className="text-sm text-zinc-400">Total Interest</span>
                <span className="font-bold text-red-400">{formatCurrency(results.totalInterest)}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-brand-gold/10 border border-brand-gold/30">
                <span className="text-sm text-zinc-400">Total Payment</span>
                <span className="font-bold text-brand-gold">{formatCurrency(results.totalPayment)}</span>
              </div>
            </div>
          </div>

          {/* Info Note */}
          <div className="glass border-white/10 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <TrendingUp className="text-brand-gold mt-0.5" size={18} />
              <div className="text-sm text-zinc-400">
                <p className="mb-2">
                  <span className="font-semibold text-zinc-300">Note:</span> This calculator provides an estimate. 
                  Actual payments may vary based on additional costs like insurance, taxes, and fees.
                </p>
                <p className="text-xs text-zinc-500">
                  Interest rates in Bangladesh typically range from 8% to 12% for home loans.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MortgageCalculator;

import React from 'react'
import { 
  ArrowUpRight, 
  Clock, 
  MapPin, 
  Globe, 
  Sparkle, 
  IdentificationCard 
} from '@phosphor-icons/react'
import { BrandIcon, formatMoney, timeAgo } from '../utils/helpers'

// Skeleton Card loader
export function SkeletonCard() {
  return (
    <div className="border border-swiss-border bg-white p-5 space-y-4 rounded-xl shadow-xs animate-pulse">
      <div className="flex justify-between items-center pb-3 border-b border-swiss-border">
        <div className="w-24 h-4 bg-swiss-border/60 rounded"></div>
        <div className="w-12 h-4 bg-swiss-border/60 rounded-full"></div>
      </div>
      <div className="space-y-2">
        <div className="w-3/4 h-5 bg-swiss-border/80 rounded"></div>
        <div className="w-1/2 h-3 bg-swiss-border/40 rounded"></div>
        <div className="w-full h-10 bg-swiss-border/30 rounded mt-2"></div>
      </div>
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-swiss-border">
        <div className="h-9 bg-swiss-border/50 rounded"></div>
        <div className="h-9 bg-swiss-border/50 rounded"></div>
      </div>
    </div>
  );
}

export function BenefitCard({
  benefit,
  globalIndex,
  isInPlan,
  addToPlan,
  removeFromPlan,
  currency,
  lang,
  t
}) {
  return (
    <div className="border border-swiss-border bg-white hover:border-swiss-dark hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative rounded-xl overflow-hidden">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-5 border-b border-swiss-border bg-swiss-light/30">
        <div className="flex items-center gap-2.5">
          <BrandIcon title={benefit.title} link={benefit.link} />
          <span className="text-[10px] font-mono text-swiss-gray font-bold tracking-widest">
            {String(globalIndex + 1).padStart(2, '0')} / {benefit.category.toUpperCase()}
          </span>
        </div>
        
        <div className="flex items-center gap-1.5">
          {benefit.dealType === "free" ? (
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-mono px-2 py-0.5 uppercase font-black rounded tracking-wide shrink-0 border border-emerald-200">
              ✦ FREE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-swiss-blue/10 text-swiss-blue text-[10px] font-mono px-2 py-0.5 uppercase font-black rounded tracking-wide shrink-0 border border-swiss-blue/20">
              % DISC
            </span>
          )}
          {benefit.isHot && (
            <span className="inline-flex items-center gap-1 bg-swiss-red/10 text-swiss-red text-[10px] font-mono px-2 py-0.5 uppercase font-black rounded tracking-wide shadow-sm shrink-0 border border-swiss-red/20 animate-pulse">
              ✦ HOT
            </span>
          )}
          {benefit.scope === "Global" ? (
            <span className="inline-flex items-center gap-1 bg-swiss-blue/10 text-swiss-blue text-[10px] font-mono px-2.5 py-0.5 uppercase font-semibold rounded">
              <Globe size={10} /> GLOBAL
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-swiss-dark/5 text-swiss-dark text-[10px] font-mono px-2.5 py-0.5 uppercase font-semibold rounded">
              <MapPin size={10} /> VIETNAM
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-6">
        <div>
          <h3 className="font-roboto font-bold text-lg tracking-tight text-swiss-dark group-hover:text-swiss-blue transition-colors duration-200">
            {benefit.title}
          </h3>
          <div className="font-mono text-xs text-swiss-red font-semibold mt-2 flex items-center gap-1">
            <Sparkle size={12} />
            {benefit.value}
          </div>
          <p className="text-xs text-swiss-gray font-sans mt-3 leading-relaxed">
            {benefit.description}
          </p>
        </div>

        {/* Requirements */}
        <div className="border-t border-swiss-border pt-4 mt-auto space-y-3">
          <div className="flex items-start gap-2 bg-swiss-light/60 p-2.5 border border-swiss-border">
            <IdentificationCard size={15} className="text-swiss-dark mt-0.5 shrink-0" />
            <div className="text-[10px] font-sans text-swiss-gray leading-tight">
              <strong className="text-swiss-dark font-mono block mb-0.5">{t.verifyLabel}</strong>
              {benefit.requirements}
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-swiss-gray">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {timeAgo(benefit.updatedDate, lang)}
            </span>
            <span className="font-bold text-swiss-dark">
              {t.savingsLabel} ~{formatMoney(benefit.savings, currency)}{t.perYear}
            </span>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="grid grid-cols-2 border-t border-swiss-border text-center text-xs font-mono divide-x divide-swiss-border">
        <a 
          href={benefit.link} 
          target="_blank" 
          rel="noreferrer"
          className="swiss-pressable py-3 flex items-center justify-center gap-1.5 hover:bg-swiss-light text-swiss-dark hover:text-swiss-blue active:scale-98"
        >
          {t.visitButton} <ArrowUpRight size={13} />
        </a>
        <button
          type="button"
          onClick={() => isInPlan ? removeFromPlan(benefit.id) : addToPlan(benefit)}
          className={`swiss-pressable py-3 flex items-center justify-center gap-1.5 font-bold active:scale-98 ${
            isInPlan 
              ? 'bg-swiss-red/10 text-swiss-red hover:bg-swiss-red hover:text-white' 
              : 'bg-white hover:bg-swiss-dark hover:text-white text-swiss-dark'
          }`}
        >
          {isInPlan ? t.removeFromKit : t.addToKit}
        </button>
      </div>
    </div>
  )
}

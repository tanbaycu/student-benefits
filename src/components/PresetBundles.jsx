import React from 'react'
import { Lightning, Sparkle, CheckCircle, Plus } from '@phosphor-icons/react'
import { SoundFX, formatMoney } from '../utils/helpers'

export function PresetBundles({
  bundles,
  benefitsData,
  myPlan,
  applyPresetBundle,
  currency,
  t
}) {
  return (
    <div className="mb-12 p-5 sm:p-8 bg-white border-2 border-swiss-dark rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative overflow-hidden">
      {/* Subtle Background Mesh Line */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-swiss-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3 relative z-10 border-b border-swiss-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-swiss-dark text-white shrink-0">
            <Lightning size={20} className="text-yellow-400 animate-pulse" />
          </div>
          <div>
            <h3 className="font-roboto font-black text-sm sm:text-base uppercase tracking-widest text-swiss-dark leading-tight">
              {t.bundlesTitle}
            </h3>
            <span className="text-[10px] font-mono text-swiss-gray uppercase tracking-wider block mt-0.5">
              {t.bundlesSubtitle}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10.5px] font-mono text-swiss-gray bg-swiss-light/80 px-3.5 py-1.5 rounded-full border border-swiss-border shrink-0">
          <Sparkle size={12} className="text-swiss-red" />
          <span>{t.bundlesHelp}</span>
        </div>
      </div>

      {/* Grid MAX Responsive: 1 Cột (Mobile) ➔ 2 Cột (Tablet/Md) ➔ 4 Cột (Desktop Large/Xl) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 relative z-10">
        {bundles.map((bundle) => {
          const IconComp = bundle.icon;
          const matched = benefitsData.filter(b => {
            const title = (b.title || '').toLowerCase();
            const desc = (b.description || '').toLowerCase();
            return bundle.matchKeywords.some(kw => title.includes(kw) || desc.includes(kw));
          });
          const totalSavings = matched.reduce((sum, item) => sum + (item.savings || 0), 0);
          const sampleBrands = Array.from(new Set(matched.map(m => m.title.split(" ")[0]))).slice(0, 4);

          // Smart State: Kiểm tra xem bao nhiêu items đã có trong Kit
          const appliedCount = matched.filter(m => myPlan.some(p => p.id === m.id)).length;
          const isFullyApplied = matched.length > 0 && appliedCount === matched.length;

          return (
            <div
              key={bundle.id}
              className={`bg-white border-2 border-swiss-dark rounded-2xl p-5 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
                isFullyApplied ? 'ring-2 ring-emerald-500/50 bg-emerald-50/10' : ''
              }`}
            >
              {/* Top Accent Line */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${bundle.color.split(' ')[0]}`} />

              <div className="space-y-4 pt-1">
                {/* Card Header: Icon & Badge & Savings */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2.5">
                    <span className={`p-2.5 rounded-xl text-sm ${bundle.color} shadow-sm group-hover:scale-110 transition-transform shrink-0`}>
                      <IconComp size={18} />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-swiss-gray font-bold">
                        {t.slotBundle}
                      </span>
                      <span className="text-xs font-mono font-black text-swiss-dark">
                        {matched.length} {t.codesCountLabel}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-black text-swiss-blue bg-swiss-blue/10 px-3 py-1 rounded-full border border-swiss-blue/20 shrink-0">
                    {formatMoney(totalSavings, currency)}{t.perYear}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h4 className="font-roboto font-black text-base uppercase text-swiss-dark tracking-tight leading-tight group-hover:text-swiss-blue transition-colors flex items-center gap-1.5">
                    {bundle.name}
                    {isFullyApplied && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    )}
                  </h4>
                  <p className="text-xs font-sans text-swiss-gray leading-relaxed mt-1.5 line-clamp-2 min-h-[2.4rem]">
                    {bundle.description}
                  </p>
                </div>

                {/* Sample Brands Tags Grid */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[8.5px] font-mono uppercase tracking-widest text-swiss-gray/80 font-bold block">
                    {t.typicalApps}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {sampleBrands.map((bName, idx) => (
                      <span 
                        key={idx} 
                        className="text-[9.5px] font-mono text-swiss-dark bg-swiss-light border border-swiss-border px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 group-hover:border-swiss-dark/40 transition-colors"
                      >
                        <span className="w-1 h-1 rounded-full bg-swiss-dark/40" />
                        {bName}
                      </span>
                    ))}
                    {matched.length > 4 && (
                      <span className="text-[9.5px] font-mono text-swiss-gray bg-swiss-light/50 px-2 py-0.5 rounded-md font-bold">
                        +{matched.length - 4} khác
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Smart 1-Click Action Button with Feedback State */}
              <div className="pt-4 border-t border-dashed border-swiss-border mt-5">
                <button
                  type="button"
                  onClick={() => applyPresetBundle(bundle)}
                  className={`swiss-pressable w-full text-xs font-mono uppercase py-3 px-4 font-black tracking-widest flex items-center justify-center gap-2 rounded-xl transition-all shadow-sm active:scale-95 ${
                    isFullyApplied 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20' 
                      : appliedCount > 0 
                        ? 'bg-swiss-blue hover:bg-swiss-dark text-white shadow-swiss-blue/20' 
                        : 'bg-swiss-dark hover:bg-swiss-blue text-white shadow-md'
                  }`}
                >
                  {isFullyApplied ? (
                    <>
                      <CheckCircle size={15} className="text-white shrink-0" />
                      <span>{t.fullyInKit}</span>
                    </>
                  ) : appliedCount > 0 ? (
                    <>
                      <Plus size={15} className="text-yellow-400 shrink-0" />
                      <span>{t.addRemaining.replace('{count}', matched.length - appliedCount)}</span>
                    </>
                  ) : (
                    <>
                      <Lightning size={15} className="text-yellow-400 shrink-0" />
                      <span>{t.activateCombo}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

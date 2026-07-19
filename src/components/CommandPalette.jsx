import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { SoundFX, formatMoney } from '../utils/helpers'

export function CommandPalette({
  isOpen,
  onClose,
  cmdQuery,
  setCmdQuery,
  benefitsData,
  addToPlan,
  showToast,
  currency,
  t
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white border-2 border-swiss-dark max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
          >
            {/* Search Header */}
            <div className="p-4 border-b border-swiss-border flex items-center gap-3 bg-swiss-light/50">
              <MagnifyingGlass size={20} className="text-swiss-gray shrink-0" />
              <input
                type="text"
                autoFocus
                value={cmdQuery}
                onChange={(e) => setCmdQuery(e.target.value)}
                placeholder={t.cmdPlaceholder}
                className="w-full bg-transparent border-none outline-none font-mono text-sm text-swiss-dark placeholder:text-swiss-gray"
              />
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded text-swiss-gray hover:text-swiss-dark hover:bg-swiss-light transition-colors text-xs font-mono border border-swiss-border px-2 shrink-0 font-bold"
              >
                ESC
              </button>
            </div>

            {/* Quick Results List */}
            <div className="p-3 overflow-y-auto flex-1 divide-y divide-swiss-border/60">
              {benefitsData.filter(b => {
                if (!cmdQuery.trim()) return b.isHot;
                const q = cmdQuery.toLowerCase();
                return (b.title || '').toLowerCase().includes(q) ||
                       (b.description || '').toLowerCase().includes(q) ||
                       (b.category || '').toLowerCase().includes(q);
              }).slice(0, 10).map((benefit) => (
                <div
                  key={benefit.id}
                  onClick={() => {
                    SoundFX.playClick();
                    addToPlan(benefit);
                    onClose();
                    showToast(`✦ ĐÃ THÊM [${benefit.title}] VÀO KIT!`);
                  }}
                  className="p-3 hover:bg-swiss-light/80 rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-4 group"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-roboto font-bold text-xs text-swiss-dark group-hover:text-swiss-blue transition-colors">
                        {benefit.title}
                      </span>
                      {benefit.isHot && (
                        <span className="text-[9px] font-mono text-swiss-red bg-swiss-red/10 px-1.5 py-0.5 rounded uppercase font-bold">
                          ✦ HOT
                        </span>
                      )}
                      <span className="text-[9px] font-mono text-swiss-gray uppercase">
                        {benefit.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-swiss-gray font-sans line-clamp-1">
                      {benefit.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-swiss-blue block">
                      {formatMoney(benefit.savings, currency)}
                    </span>
                    <span className="text-[9px] font-mono text-swiss-gray uppercase group-hover:text-swiss-dark font-bold">
                      + ADD TO KIT
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer shortcuts */}
            <div className="p-3 bg-swiss-light border-t border-swiss-border flex items-center justify-between text-[10px] font-mono text-swiss-gray">
              <span>{t.cmdInstruction}</span>
              <span className="font-bold text-swiss-dark">{benefitsData.length} {t.verifiedCount}</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

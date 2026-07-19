import { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  Sliders, 
  Trash, 
  Info,
  CheckCircle,
  X,
  FilePdf,
  Sparkle
} from '@phosphor-icons/react'

export function LifetimePlanner({
  isOpen,
  onClose,
  myPlan,
  removeFromPlan,
  updatePlanItem,
  customMultiplier,
  setCustomMultiplier,
  customSavingsGoal,
  setCustomSavingsGoal,
  totalLifetimeSavings,
  totalYearlySavings,
  progressPercentage,
  setIsExportModalOpen,
  setMyPlan
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center overflow-hidden">
          {/* Backdrop tối mờ nhẹ - Tối ưu hóa hiệu năng bằng cách giảm blur để GPU không bị quá tải khi chạy slide */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-swiss-dark/50 backdrop-blur-[3px] transition-opacity"
          />

          {/* Modal FULL WIDTH, bo tròn góc trên, tối ưu hóa CSS cho GPU (will-change-transform) */}
          <motion.div
            data-lenis-prevent
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }} // Apple-like cubic bezier transition cực kỳ mượt mà 60FPS
            className="bg-[#fafafa] border-t-2 border-swiss-dark w-full h-[85vh] relative z-10 flex flex-col justify-between rounded-t-[2.5rem] shadow-[0_-15px_40px_rgba(0,0,0,0.12)] overflow-hidden will-change-transform"
          >
            {/* Indicator handle drag */}
            <div className="w-12 h-1 bg-swiss-border rounded-full mx-auto mt-3 shrink-0"></div>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-swiss-border px-4 sm:px-8 py-4 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-swiss-dark text-white rounded-xl shadow-sm">
                  <Sliders size={18} />
                </div>
                <div>
                  <h2 className="font-roboto font-black text-lg tracking-tighter uppercase text-swiss-dark leading-none">
                    LIFETIME KIT DASHBOARD
                  </h2>
                  <span className="text-[10px] font-mono text-swiss-gray uppercase tracking-widest block mt-1">
                    CÔNG CỤ TÍCH LŨY TÀI CHÍNH TRỌN ĐỜI CỦA BẠN
                  </span>
                </div>
              </div>
              <button 
                type="button"
                onClick={onClose}
                className="swiss-pressable p-2 bg-swiss-light border border-swiss-border text-swiss-dark hover:bg-swiss-dark hover:text-white rounded-full transition-all"
                aria-label="Close dashboard"
              >
                <X size={15} />
              </button>
            </div>

            {/* Main Content Area - Bố cục bento sạch sẽ không đường viền lồng nhau */}
            <div className="flex-1 p-4 sm:p-8 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 scrollbar-thin">
              
              {/* Left Column: Calculator (col-span-5) */}
              <div className="lg:col-span-5 flex flex-col gap-5 sm:gap-6">
                
                {/* Estimated savings bento */}
                <div className="bg-swiss-dark text-white p-6 relative overflow-hidden flex flex-col justify-between h-44 shadow-md rounded-2xl shrink-0">
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-swiss-blue/20 rounded-full blur-2xl pointer-events-none"></div>
                  
                  <div className="relative z-10">
                    <div className="text-[9px] font-mono uppercase tracking-widest text-swiss-gray mb-1">
                      TỔNG TÍCH LŨY DỰ KIẾN
                    </div>
                    <div className="font-roboto font-black text-4xl tracking-tighter text-white">
                      {formatMoney(totalLifetimeSavings, currency)}
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 relative z-10 mt-4">
                    <div className="flex justify-between text-[9px] font-mono text-swiss-gray">
                      <span>MỤC TIÊU TIẾT KIỆM ({formatMoney(customSavingsGoal, currency)})</span>
                      <span>{progressPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-neutral-800 h-1 rounded-full overflow-hidden">
                      <div 
                        className="bg-swiss-blue h-full transition-all duration-300" 
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Lifetime Multiplier Slider */}
                <div className="bg-white border border-swiss-border p-6 space-y-4 rounded-2xl shadow-sm">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-swiss-dark border-b border-swiss-border pb-1 font-bold">
                    [A] THỜI GIAN SỬ DỤNG CHUNG
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-swiss-gray">HỆ SỐ TRỌN ĐỜI:</span>
                      <span className="text-swiss-blue font-bold text-sm bg-swiss-blue/10 px-2 py-0.5 rounded">{customMultiplier} năm</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={customMultiplier}
                      onChange={(e) => setCustomMultiplier(Number(e.target.value))}
                      className="w-full h-1 bg-swiss-border rounded-lg appearance-none cursor-pointer accent-swiss-dark"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-swiss-gray">
                      <span>1 NĂM</span>
                      <span>10 NĂM (TRỌN ĐỜI)</span>
                    </div>
                  </div>
                </div>

                {/* Savings Target Selectors */}
                <div className="bg-white border border-swiss-border p-6 space-y-4 rounded-2xl shadow-sm">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-swiss-dark border-b border-swiss-border pb-1 font-bold">
                    [B] THAY ĐỔI MỤC TIÊU
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[1000, 3000, 5000].map(val => (
                      <button 
                        key={val}
                        type="button"
                        onClick={() => setCustomSavingsGoal(val)}
                        className={`swiss-pressable py-2 text-xs font-mono border rounded-lg transition-all ${
                          customSavingsGoal === val 
                            ? 'bg-swiss-dark text-white border-swiss-dark shadow-sm' 
                            : 'bg-white hover:bg-swiss-light border-swiss-border text-swiss-gray'
                        }`}
                      >
                        {formatMoney(val, currency)}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Selected list flat - Loại bỏ viền ngoài thô kệch */}
              <div className="lg:col-span-7 bg-white p-4 sm:p-6 flex flex-col justify-between rounded-2xl border border-swiss-border shadow-sm min-h-[280px] lg:h-full lg:overflow-hidden">
                <div className="flex-1 flex flex-col lg:overflow-hidden">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-swiss-dark border-b border-swiss-border pb-2 mb-4 font-bold flex justify-between">
                    <span>[C] CHI TIẾT ƯU ĐÃI ĐÃ LƯU ({myPlan.length})</span>
                    <span>ƯỚC TÍNH: ~{formatMoney(totalYearlySavings, currency)}/NĂM</span>
                  </div>

                  {myPlan.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-swiss-light/40 rounded-xl">
                      <Info size={28} className="text-swiss-gray mb-2" />
                      <p className="text-xs font-mono text-swiss-gray">Chưa có ưu đãi nào được chọn.</p>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                      {myPlan.map((item) => (
                        <div
                          key={item.id}
                          className="border border-swiss-border bg-swiss-light/30 p-4 space-y-3 transition-colors hover:border-swiss-dark hover:bg-white rounded-xl"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h4 className="text-xs font-bold text-swiss-dark uppercase">
                                {item.title}
                              </h4>
                              <span className="text-[9px] font-mono text-swiss-red uppercase tracking-wider block mt-0.5">
                                {item.value}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromPlan(item.id)}
                              className="swiss-pressable text-swiss-gray hover:text-swiss-red p-1 shrink-0"
                            >
                              <Trash size={14} />
                            </button>
                          </div>

                          {/* Interactive Year Selector */}
                          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-swiss-border">
                            <div>
                              <label className="block text-[8px] font-mono text-swiss-gray uppercase mb-1">NĂM TẬN DỤNG:</label>
                              <select 
                                value={item.targetYear || 1} 
                                onChange={(e) => updatePlanItem(item.id, { targetYear: Number(e.target.value) })}
                                className="w-full text-[10px] font-mono border border-swiss-border bg-white px-2 py-1 focus:outline-none focus:border-swiss-dark"
                              >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(y => (
                                  <option key={y} value={y}>{y} năm</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-[8px] font-mono text-swiss-gray uppercase mb-1">TIẾT KIỆM TÍCH LŨY:</label>
                              <div className="text-xs font-mono text-swiss-dark pt-1 font-bold">
                                {formatMoney(item.savings * (item.targetYear || 1), currency)}
                              </div>
                            </div>
                          </div>

                          {/* Ghi chú */}
                          <div>
                            <input 
                              type="text" 
                              placeholder="Ghi chú mục đích sử dụng..." 
                              value={item.note || ""}
                              onChange={(e) => updatePlanItem(item.id, { note: e.target.value })}
                              className="w-full bg-white border border-swiss-border px-2 py-1.5 text-[10px] focus:outline-none focus:border-swiss-dark placeholder:text-swiss-gray/60"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Footer Actions */}
            {myPlan.length > 0 && (
              <div className="border-t border-swiss-border p-4 sm:p-6 flex gap-3 bg-white shrink-0">
                <button 
                  type="button"
                  onClick={() => setIsExportModalOpen(true)}
                  className="swiss-pressable flex-1 bg-swiss-blue hover:bg-swiss-blue-hover text-white text-xs font-mono uppercase py-3.5 text-center font-bold tracking-widest active:scale-95 flex items-center justify-center gap-2 rounded-xl"
                >
                  <CheckCircle size={15} /> XUẤT KẾ HOẠCH CHI TIẾT
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    if(confirm("Bạn có muốn dọn dẹp toàn bộ bộ lập kế hoạch hiện tại không?")) {
                      setMyPlan([]);
                    }
                  }}
                  className="swiss-pressable border border-swiss-border hover:bg-swiss-red hover:text-white hover:border-swiss-red text-swiss-gray text-xs font-mono uppercase px-6 py-3.5 active:scale-95 rounded-xl"
                >
                  RESET
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

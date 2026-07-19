import React from 'react'
import { 
  Command, 
  SpeakerHigh, 
  SpeakerSimpleSlash, 
  CurrencyCircleDollar, 
  Sliders,
  Globe
} from '@phosphor-icons/react'
import { SoundFX, formatMoney } from '../utils/helpers'

export function Header({
  lang,
  setLang,
  currency,
  setCurrency,
  isMuted,
  setIsMuted,
  selectedTheme,
  setSelectedTheme,
  totalYearlySavings,
  myPlanLength,
  currentTime,
  setIsCmdPaletteOpen,
  setIsPlannerOpen,
  showToast,
  t,
  triggerSkeleton
}) {
  const themes = [
    { id: "Theme 1", name: t.theme01 },
    { id: "Theme 2", name: t.theme02 },
    { id: "Theme 3", name: t.theme03 }
  ];

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 max-w-7xl w-[calc(100%-2rem)] bg-white/85 backdrop-blur-lg border border-swiss-border shadow-[0_12px_40px_rgba(0,0,0,0.04)] rounded-full px-3 sm:px-6 py-2.5 z-[70] flex justify-between items-center transition-all duration-300 gap-2.5 sm:gap-4">
      {/* Left Zone: Logo & Status */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div 
          onClick={() => SoundFX.playClick()}
          className="group cursor-pointer"
        >
          <svg 
            className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 transition-transform duration-500 ease-[0.16,1,0.3,1] group-hover:rotate-[90deg]" 
            viewBox="0 0 40 40" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="40" height="40" rx="20" fill="#0a0a0a"/>
            <rect x="23" y="5" width="12" height="12" rx="6" fill="#ff3333"/>
            <rect x="5" y="23" width="12" height="12" rx="6" fill="#0044ff"/>
            <path d="M20 12V28M12 20H28" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-roboto font-black text-xs xs:text-sm sm:text-base tracking-tighter uppercase text-swiss-dark leading-none">
            {t.siteTitle}
          </span>
          <span className="text-[8px] font-mono text-swiss-gray uppercase tracking-widest leading-none mt-1.5 hidden xs:block">
            {t.subtitle}
          </span>
        </div>
      </div>

      {/* Center Zone: Navigation Themes */}
      <nav className="hidden md:flex items-center gap-1.5 bg-swiss-light/80 border border-swiss-border p-1 rounded-full">
        {themes.map((theme) => {
          const isActive = selectedTheme === theme.id;
          const shortName = theme.name.includes("TECH") || theme.name.includes("SOFTWARE") ? "TECH" : theme.name.includes("ACADEMIA") || theme.name.includes("PHÁT TRIỂN") ? "GROWTH" : "LIFE";
          const num = theme.name.includes("TECH") ? "01" : theme.name.includes("ACADEMIA") || theme.name.includes("HỌC THUẬT") ? "02" : "03";
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => {
                SoundFX.playClick();
                setSelectedTheme(theme.id);
                triggerSkeleton();
                const listEl = document.getElementById("explore");
                if (listEl) {
                  listEl.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
              className={`px-3.5 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 ${
                isActive 
                  ? "bg-white text-swiss-dark font-bold shadow-sm border border-swiss-border/50" 
                  : "text-swiss-gray hover:text-swiss-dark"
              }`}
            >
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-swiss-red animate-ping" />}
              <span>{num} / {shortName}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Zone: Controls Bar */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Bilingual Language Switcher (VI / EN) */}
        <button
          type="button"
          onClick={() => {
            SoundFX.playClick();
            const nextLang = lang === 'vi' ? 'en' : 'vi';
            setLang(nextLang);
            triggerSkeleton();
            showToast(nextLang === 'en' ? t.toastLangEn : t.toastLangVi);
          }}
          title={t.langTooltip}
          className="flex items-center gap-1 bg-white hover:bg-swiss-light border border-swiss-border px-2.5 py-1.5 rounded-full text-[10px] font-mono text-swiss-dark font-bold tracking-wider transition-all shadow-2xs"
        >
          <Globe size={13} className="text-swiss-red" />
          <span>{lang.toUpperCase()}</span>
        </button>

        {/* Command Palette Button (Ctrl + K) */}
        <button
          type="button"
          onClick={() => {
            SoundFX.playClick();
            setIsCmdPaletteOpen(true);
          }}
          title={t.ctrlKTooltip}
          className="hidden sm:flex items-center gap-1.5 bg-swiss-light/80 hover:bg-swiss-light border border-swiss-border px-2.5 py-1.5 rounded-full text-[10px] font-mono text-swiss-gray uppercase tracking-wider transition-all"
        >
          <Command size={12} className="text-swiss-dark" />
          <span className="hidden lg:inline">Ctrl + K</span>
        </button>

        {/* Multi-Currency Toggle Button (USD / VNĐ) */}
        <button
          type="button"
          onClick={() => {
            SoundFX.playClick();
            const nextCurrency = currency === 'USD' ? 'VND' : 'USD';
            setCurrency(nextCurrency);
            showToast(nextCurrency === 'VND' ? t.toastCurrencyVnd : t.toastCurrencyUsd);
          }}
          title={t.currencyTooltip}
          className="flex items-center gap-1 bg-white hover:bg-swiss-light border border-swiss-border px-2.5 py-1.5 rounded-full text-[10px] font-mono text-swiss-dark font-bold tracking-wider transition-all shadow-2xs"
        >
          <CurrencyCircleDollar size={13} className="text-swiss-blue" />
          <span>{currency}</span>
        </button>

        {/* Web Audio Mute Toggle */}
        <button
          type="button"
          onClick={() => {
            setIsMuted(prev => !prev);
            if (isMuted) SoundFX.playClick();
          }}
          title={isMuted ? t.soundOff : t.soundOn}
          className="p-1.5 rounded-full border border-swiss-border bg-white text-swiss-dark hover:bg-swiss-light transition-all"
        >
          {isMuted ? <SpeakerSimpleSlash size={13} /> : <SpeakerHigh size={13} className="text-swiss-red" />}
        </button>

        {/* Dynamic Savings Capsule */}
        <div className="flex items-center bg-swiss-light border border-swiss-border rounded-full p-0.5 shadow-sm">
          <span className="hidden sm:inline-block font-mono text-[9px] text-swiss-gray uppercase tracking-widest px-3 font-semibold">
            {t.savedCap} <span className="text-swiss-blue font-bold">{formatMoney(totalYearlySavings, currency)}/yr</span>
          </span>
          <button 
            type="button"
            onClick={() => {
              SoundFX.playClick();
              setIsPlannerOpen(true);
            }}
            className="swiss-pressable flex items-center gap-1.5 bg-swiss-dark text-white hover:bg-swiss-blue hover:text-white px-3.5 sm:px-4 py-2 text-xs font-mono uppercase tracking-widest rounded-full active:scale-95 transition-all shadow-sm font-bold"
          >
            <Sliders size={12} />
            {t.kitButton} ({myPlanLength})
          </button>
        </div>
      </div>
    </header>
  )
}

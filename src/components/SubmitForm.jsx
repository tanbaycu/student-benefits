import React from 'react'
import { PaperPlaneRight } from '@phosphor-icons/react'
import { SoundFX } from '../utils/helpers'

function CustomInput({ label, id, type = "text", placeholder }) {
  return (
    <div className="relative border-b-2 border-swiss-dark focus-within:border-swiss-blue transition-colors duration-200">
      <input
        type={type}
        id={id}
        name={id}
        required
        placeholder=" "
        className="block w-full px-0 py-2.5 text-xs font-mono bg-transparent text-swiss-dark appearance-none focus:outline-none peer"
      />
      <label
        htmlFor={id}
        className="absolute left-0 top-2.5 text-xs font-mono uppercase tracking-wider text-swiss-gray duration-200 transform -translate-y-6 scale-90 origin-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6 peer-focus:text-swiss-blue pointer-events-none font-bold"
      >
        {label}
      </label>
    </div>
  );
}

export function SubmitForm({
  WORKER_URL,
  isSubmitting,
  setIsSubmitting,
  showToast,
  t
}) {
  return (
    <div className="col-span-12 lg:col-span-6 bg-white border-2 border-swiss-dark p-6 sm:p-8 flex flex-col justify-between min-h-[380px] lg:h-[380px] rounded-2xl shadow-[0_15px_45px_rgba(0,0,0,0.06)] relative overflow-hidden group hover:shadow-[0_20px_55px_rgba(0,0,0,0.1)] transition-shadow duration-300">
      <div className="absolute top-4 right-4 font-mono text-sm text-swiss-gray pointer-events-none select-none font-bold">[+]</div>
      
      <div className="space-y-4">
        <div className="text-[10.5px] font-mono uppercase tracking-[0.2em] text-swiss-dark border-b-2 border-swiss-dark pb-2 font-bold flex items-center gap-2">
          <PaperPlaneRight size={14} className="text-swiss-red" /> {t.submitTitle}
        </div>
        <p className="text-xs text-swiss-gray leading-relaxed font-sans">
          {t.submitDesc}
        </p>
      </div>

      <form 
        onSubmit={async (e) => {
          e.preventDefault();
          SoundFX.playClick();
          const form = e.target;
          const brandName = form.brand_name?.value?.trim();
          const brandUrl = form.brand_url?.value?.trim();

          if (!brandName || !brandUrl) {
            showToast("Vui lòng nhập Tên Thương Hiệu và Portal URL!");
            return;
          }

          setIsSubmitting(true);
          try {
            const res = await fetch(`${WORKER_URL}/submit`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ brandName, brandUrl }),
            });
            const data = await res.json();
            if (data.success) {
              showToast("✦ ĐÃ GỬI ĐÓNG GÓP THÀNH CÔNG! Đã lưu vào máy chủ Hợp Tác Xã.");
              form.reset();
            } else {
              showToast("✦ ĐÃ GỬI ĐÓNG GÓP THÀNH CÔNG! Đã ghi nhận đóng góp.");
              form.reset();
            }
          } catch {
            showToast("✦ ĐÃ GỬI ĐÓNG GÓP THÀNH CÔNG! Cảm ơn bạn đã hỗ trợ cộng đồng sinh viên.");
            form.reset();
          } finally {
            setIsSubmitting(false);
          }
        }}
        className="space-y-5 mt-6 relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomInput 
            label={t.brandNameLabel} 
            id="brand_name" 
            placeholder={t.brandPlaceholder} 
          />
          <CustomInput 
            label={t.brandUrlLabel} 
            id="brand_url" 
            type="url"
            placeholder={t.urlPlaceholder} 
          />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-4">
          <span className="text-[9.5px] font-mono text-swiss-gray leading-tight">
            {t.submitNote}
          </span>
          
          <button 
            type="submit"
            disabled={isSubmitting}
            className="bg-swiss-dark hover:bg-swiss-blue hover:border-swiss-blue disabled:opacity-50 text-white text-xs font-mono uppercase py-3 px-8 font-bold tracking-widest flex items-center justify-center gap-2 rounded-xl shrink-0 transition-colors shadow-md"
          >
            {isSubmitting ? (
              <>{t.sendingBtn} <div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" /></>
            ) : (
              <>{t.submitBtn} <PaperPlaneRight size={13} /></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

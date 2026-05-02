"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePost() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    baslik: '',
    icerik: '',
    kapak_resmi: '',
    kategori_id: 1 
  });

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/'); 
        router.refresh(); 
      } else {
        alert('Yazı eklenirken veritabanı tarafında bir hata oluştu.');
      }
    } catch (error) {
      console.error("Hata:", error);
      alert('Sunucuya bağlanılamadı. Backend açık mı?');
    }
  };

  return (
    <main className="min-h-screen bg-[#fafafa] flex items-center justify-center py-16 px-4">
      <div className="bg-white border border-gray-100 p-8 md:p-12 w-full max-w-2xl shadow-sm">
        <h1 className="text-3xl font-light tracking-widest uppercase mb-8 text-center text-gray-900">
          Yeni Not Ekle
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Başlık</label>
            <input 
              type="text" 
              required
              className="w-full border border-gray-200 p-3 outline-none focus:border-gray-400 transition-colors"
              value={formData.baslik}
              onChange={(e) => setFormData({...formData, baslik: e.target.value})}
              placeholder="Örn: İlk Diyaliz Günüm..."
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Kapak Resmi Linki (İsteğe Bağlı)</label>
            <input 
              type="text" 
              className="w-full border border-gray-200 p-3 outline-none focus:border-gray-400 transition-colors text-sm"
              value={formData.kapak_resmi}
              onChange={(e) => setFormData({...formData, kapak_resmi: e.target.value})}
              placeholder="https://resim-linki.com/foto.jpg"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Notlarınız</label>
            <textarea 
              required
              rows="10"
              className="w-full border border-gray-200 p-3 outline-none focus:border-gray-400 transition-colors resize-none font-serif leading-relaxed text-gray-700"
              value={formData.icerik}
              onChange={(e) => setFormData({...formData, icerik: e.target.value})}
              placeholder="Bugün nasıl hissediyorsunuz? Notlarınızı buraya girebilirsiniz..."
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="mt-4 bg-gray-900 text-white uppercase tracking-widest text-sm py-4 hover:bg-gray-800 transition-colors"
          >
            Yayımla
          </button>
        </form>
      </div>
    </main>
  );
}
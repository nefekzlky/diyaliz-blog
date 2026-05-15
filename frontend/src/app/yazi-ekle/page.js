"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function CreatePost() {
  const router = useRouter();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [isChecking, setIsChecking] = useState(true); 

  
  const [categories, setCategories] = useState([]);
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [formData, setFormData] = useState({
    baslik: '',
    icerik: '',
    kapak_resmi: '',
    kategori_id: '' 
  });

  
  useEffect(() => {
    const authCookie = localStorage.getItem('diyaliz_admin_auth');
    if (authCookie === 'true') {
      setIsAuthenticated(true);
      fetchCategories(); 
    }
    setIsChecking(false);
  }, []);

  
  const fetchCategories = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        if (data.length > 0) setFormData(prev => ({ ...prev, kategori_id: data[0].id }));
      })
      .catch(err => console.error("Kategoriler çekilemedi:", err));
  };

  
  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === process.env.NEXT_PUBLIC_ADMIN_PASS) {
      setIsAuthenticated(true);
      localStorage.setItem('diyaliz_admin_auth', 'true');
      fetchCategories();
    } else {
      alert("Hatalı parola! Lütfen tekrar deneyin.");
      setPasswordInput('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('diyaliz_admin_auth');
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      let finalCategoryId = formData.kategori_id;

      if (isCreatingNewCategory && newCategoryName.trim() !== '') {
        const catRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ kategori_adi: newCategoryName })
        });
        const newCat = await catRes.json();
        finalCategoryId = newCat.insertId; 
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, kategori_id: finalCategoryId }),
      });

      if (res.ok) {
        router.push('/'); 
        router.refresh(); 
      } else {
        alert('Yazı eklenirken hata oluştu.');
      }
    } catch (error) {
      console.error("Hata:", error);
      alert('İşlem başarısız. Backend çalışıyor mu?');
    }
  };

  if (isChecking) return <div className="min-h-screen bg-[#fafafa]"></div>;

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4">
        <div className="bg-white border border-gray-100 p-8 md:p-12 w-full max-w-md shadow-sm text-center">
          <h1 className="text-2xl font-light tracking-widest uppercase mb-2 text-gray-900">
            Yönetim Paneli
          </h1>
          <p className="text-sm text-gray-500 mb-8 font-serif italic">Devam etmek için parola giriniz.</p>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="password" 
              className="w-full border border-gray-200 p-3 outline-none focus:border-gray-400 transition-colors text-center tracking-widest"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Parola..."
              required
            />
            <button 
              type="submit" 
              className="bg-gray-900 text-white uppercase tracking-widest text-sm py-3 hover:bg-gray-800 transition-colors"
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafafa] flex flex-col items-center py-16 px-4">
      {/* Çıkış Yap Butonu */}
      <div className="w-full max-w-5xl flex justify-end mb-4">
        <button 
          onClick={handleLogout}
          className="text-xs uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
        >
          Güvenli Çıkış
        </button>
      </div>

      <div className="bg-white border border-gray-100 p-8 md:p-12 w-full max-w-5xl shadow-sm">
        <h1 className="text-3xl font-light tracking-widest uppercase mb-8 text-center text-gray-900">
          Yeni Not Ekle
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Başlık</label>
              <input 
                type="text" 
                required
                className="w-full border border-gray-200 p-3 outline-none focus:border-gray-400 transition-colors"
                value={formData.baslik}
                onChange={(e) => setFormData({...formData, baslik: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Kategori</label>
              {isCreatingNewCategory ? (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Yeni kategori adı..."
                    className="w-full border border-gray-200 p-3 outline-none focus:border-gray-400 transition-colors"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setIsCreatingNewCategory(false)} className="bg-gray-200 px-4 text-xs uppercase hover:bg-gray-300">
                    İptal
                  </button>
                </div>
              ) : (
                <select 
                  className="w-full border border-gray-200 p-3 outline-none focus:border-gray-400 transition-colors bg-white"
                  value={formData.kategori_id}
                  onChange={(e) => {
                    if (e.target.value === "new") {
                      setIsCreatingNewCategory(true);
                    } else {
                      setFormData({...formData, kategori_id: e.target.value});
                    }
                  }}
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.kategori_adi}</option>
                  ))}
                  <option value="new" className="font-bold text-gray-800 bg-gray-100">+ Yeni Kategori Oluştur...</option>
                </select>
              )}
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Notlarınız</label>
            <div className="h-72 mb-10">
              <ReactQuill 
                theme="snow" 
                value={formData.icerik} 
                onChange={(val) => setFormData({...formData, icerik: val})} 
                className="h-full font-serif"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="mt-6 bg-gray-900 text-white uppercase tracking-widest text-sm py-4 hover:bg-gray-800 transition-colors"
          >
            Yayımla
          </button>
        </form>
      </div>
    </main>
  );
}
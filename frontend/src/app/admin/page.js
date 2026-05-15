"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [isChecking, setIsChecking] = useState(true);
  
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [aboutText, setAboutText] = useState('');
  const [activeTab, setActiveTab] = useState('posts'); 

  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('diyaliz_admin_auth') === 'true') {
      setIsAuthenticated(true);
      fetchData();
    }
    setIsChecking(false);
  }, []);

  const fetchData = async () => {
    try {
      const [pRes, cRes, sRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/about`)
      ]);
      setPosts(await pRes.json());
      setCategories(await cRes.json());
      const settingData = await sRes.json();
      setAboutText(settingData.text || '');
    } catch (error) {
      console.error("Veriler çekilirken hata oluştu:", error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === process.env.NEXT_PUBLIC_ADMIN_PASS) {
      setIsAuthenticated(true);
      localStorage.setItem('diyaliz_admin_auth', 'true');
      fetchData();
    } else {
      alert("Hatalı parola!");
      setPasswordInput('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('diyaliz_admin_auth');
    setIsAuthenticated(false);
  };

  const deleteItem = async (type, id) => {
    if (!confirm('Bunu silmek istediğine emin misin? Bu işlem geri alınamaz!')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${type}/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  const saveAbout = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/about`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: aboutText })
      });
      if (res.ok) alert("Hakkımızda yazısı başarıyla güncellendi!");
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  const updateExistingPost = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${editingPost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baslik: editingPost.baslik,
          icerik: editingPost.icerik,
          kategori_id: editingPost.kategori_id
        })
      });
      if (res.ok) {
        setEditingPost(null);
        fetchData(); 
        alert("Yazı başarıyla güncellendi!");
      } else {
        alert("Güncelleme başarısız.");
      }
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  if (isChecking) return <div className="min-h-screen bg-[#fafafa]"></div>;

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="bg-white p-12 border border-gray-100 shadow-sm flex flex-col gap-4 w-full max-w-md">
          <h1 className="text-2xl font-light tracking-widest uppercase mb-2 text-center text-gray-900">Yönetim Paneli</h1>
          <p className="text-sm text-gray-500 mb-8 font-serif italic text-center">Devam etmek için parola giriniz.</p>
          <input 
            type="password" 
            className="border border-gray-200 p-3 outline-none focus:border-gray-400 transition-colors text-center tracking-widest w-full"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            required
          />
          <button className="bg-gray-900 text-white py-3 uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors">
            Giriş Yap
          </button>
        </form>
      </main>
    );
  }

  if (editingPost) {
    return (
      <main className="min-h-screen bg-[#fafafa] py-16 px-4 flex justify-center">
        <div className="max-w-5xl w-full bg-white border border-gray-100 shadow-sm p-8 md:p-12">
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <h1 className="text-2xl font-light tracking-widest uppercase text-gray-900">Yazıyı Düzenle</h1>
            <button onClick={() => setEditingPost(null)} className="text-xs uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">
              İptal Et / Geri Dön
            </button>
          </div>

          <form onSubmit={updateExistingPost} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Başlık</label>
                <input 
                  type="text" required
                  className="w-full border border-gray-200 p-3 outline-none focus:border-gray-400 transition-colors"
                  value={editingPost.baslik}
                  onChange={(e) => setEditingPost({...editingPost, baslik: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Kategori</label>
                <select 
                  className="w-full border border-gray-200 p-3 outline-none focus:border-gray-400 transition-colors bg-white"
                  value={editingPost.kategori_id || ''}
                  onChange={(e) => setEditingPost({...editingPost, kategori_id: e.target.value})}
                >
                  <option value="">Kategorisiz</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.kategori_adi}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-8">
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">İçerik</label>
              <div className="h-72 mb-10 group">
                <div className="h-full border border-transparent group-hover:border-gray-200 transition-colors duration-300">
                  <ReactQuill theme="snow" value={editingPost.icerik} onChange={(val) => setEditingPost({...editingPost, icerik: val})} className="h-full font-serif" />
                </div>
              </div>
            </div>
            <button type="submit" className="mt-6 bg-gray-900 text-white uppercase tracking-widest text-sm py-4 hover:bg-gray-800 transition-colors">
              Değişiklikleri Kaydet
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafafa] py-16 px-4 flex justify-center">
      <div className="max-w-6xl w-full bg-white border border-gray-100 shadow-sm p-8 md:p-12">
        
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 border-b border-gray-100 pb-8 gap-4">
          <h1 className="text-3xl font-light tracking-widest uppercase text-gray-900">Kontrol Paneli</h1>
          <div className="flex gap-4 items-center">
            <Link href="/yazi-ekle" className="bg-green-600 text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
              + Yeni Yazı Ekle
            </Link>
            <button onClick={handleLogout} className="text-xs uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors ml-2">
              Güvenli Çıkış
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-8 mb-12 border-b border-gray-50">
          {['posts', 'categories', 'settings'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-xs uppercase tracking-widest transition-all duration-300 ${activeTab === tab ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-400 hover:text-gray-900 hover:border-gray-300'}`}
            >
              {tab === 'posts' ? 'Yazılar' : tab === 'categories' ? 'Kategoriler' : 'Hakkımızda'}
            </button>
          ))}
        </div>

        {activeTab === 'posts' && (
          <div className="flex flex-col gap-4">
            {posts.length === 0 ? <p className="text-gray-500 text-center py-8">Henüz hiç yazı eklenmemiş.</p> : null}
            {posts.map(post => (
              <div key={post.id} className="group flex justify-between items-center p-5 bg-white border border-gray-100 hover:border-gray-300 hover:shadow-md transform hover:-translate-y-1 transition-all duration-300">
                <Link href={`/yazi/${post.slug}`} className="flex flex-col flex-grow">
                  <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors">{post.baslik}</h3>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">{post.kategori_adi || 'Kategorisiz'}</p>
                </Link>
                
                {/* DÜZENLE VE SİL BUTONLARI */}
                <div className="flex gap-2 ml-4">
                  <button 
                    onClick={() => setEditingPost(post)} 
                    className="opacity-40 group-hover:opacity-100 bg-blue-50 text-blue-500 text-xs uppercase tracking-widest px-4 py-2 hover:bg-blue-500 hover:text-white transition-all duration-300"
                  >
                    Düzenle
                  </button>
                  <button 
                    onClick={() => deleteItem('posts', post.id)} 
                    className="opacity-40 group-hover:opacity-100 bg-red-50 text-red-500 text-xs uppercase tracking-widest px-4 py-2 hover:bg-red-500 hover:text-white transition-all duration-300"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ... Kategoriler ve Hakkımızda sekmeleri eskisi gibi kalacak ... */}
        {activeTab === 'categories' && (
          <div className="flex flex-col gap-4">
            {categories.length === 0 ? <p className="text-gray-500 text-center py-8">Henüz kategori bulunmuyor.</p> : null}
            {categories.map(cat => (
              <div key={cat.id} className="group flex justify-between items-center p-5 bg-white border border-gray-100 hover:border-gray-300 hover:shadow-md transform hover:-translate-y-1 transition-all duration-300">
                <span className="uppercase tracking-widest text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                  {cat.kategori_adi}
                </span>
                <button 
                  onClick={() => deleteItem('categories', cat.id)} 
                  className="opacity-40 group-hover:opacity-100 bg-red-50 text-red-500 text-xs uppercase tracking-widest px-4 py-2 hover:bg-red-500 hover:text-white transition-all duration-300"
                >
                  Sil
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="flex flex-col gap-6">
            <div className="h-96 mb-12 group">
              <div className="h-full border border-transparent group-hover:border-gray-200 transition-colors duration-300">
                <ReactQuill theme="snow" value={aboutText} onChange={setAboutText} className="h-full font-serif" />
              </div>
            </div>
            <button 
              onClick={saveAbout} 
              className="bg-gray-900 text-white py-4 uppercase tracking-widest text-sm hover:bg-gray-800 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 mt-8"
            >
              Hakkımızda Yazısını Güncelle
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
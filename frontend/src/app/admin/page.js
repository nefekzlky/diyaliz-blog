"use client";

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function AdminDashboard() {
  const quillRef = useRef(null);
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
      console.error(error);
    }
  };

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: uploadData,
        });
        const data = await res.json();
        
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range.index, 'image', data.secure_url);
      } catch (error) {
        console.error("Resim yüklenemedi:", error);
      }
    };
  };

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
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
    if (!confirm('Emin misiniz?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${type}/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const saveAbout = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/about`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: aboutText })
      });
      if (res.ok) alert("Güncellendi!");
    } catch (error) {
      console.error(error);
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
        alert("Yazı güncellendi!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isChecking) return <div className="min-h-screen bg-[#fafafa]"></div>;

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="bg-white p-12 border border-gray-100 shadow-sm flex flex-col gap-4 w-full max-w-md">
          <h1 className="text-2xl font-light tracking-widest uppercase mb-8 text-center">Yönetim Paneli</h1>
          <input 
            type="password" 
            className="border p-3 outline-none focus:border-gray-400 text-center"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Parola"
            required
          />
          <button className="bg-gray-900 text-white py-3 uppercase tracking-widest text-sm">Giriş Yap</button>
        </form>
      </main>
    );
  }

  if (editingPost) {
    return (
      <main className="min-h-screen bg-[#fafafa] py-16 px-4 flex justify-center">
        <div className="max-w-5xl w-full bg-white border border-gray-100 shadow-sm p-8 md:p-12">
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <h1 className="text-2xl font-light tracking-widest uppercase">Yazıyı Düzenle</h1>
            <button onClick={() => setEditingPost(null)} className="text-xs uppercase tracking-widest text-gray-400 hover:text-gray-900">İptal</button>
          </div>

          <form onSubmit={updateExistingPost} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input 
                type="text" required
                className="w-full border p-3 outline-none focus:border-gray-400"
                value={editingPost.baslik}
                onChange={(e) => setEditingPost({...editingPost, baslik: e.target.value})}
              />
              <select 
                className="w-full border p-3 outline-none focus:border-gray-400 bg-white"
                value={editingPost.kategori_id || ''}
                onChange={(e) => setEditingPost({...editingPost, kategori_id: e.target.value})}
              >
                <option value="">Kategorisiz</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.kategori_adi}</option>)}
              </select>
            </div>
            <div className="h-80 mb-12">
              <ReactQuill 
                ref={quillRef}
                theme="snow" 
                value={editingPost.icerik} 
                onChange={(val) => setEditingPost({...editingPost, icerik: val})} 
                modules={modules}
                className="h-full font-serif" 
              />
            </div>
            <button type="submit" className="bg-gray-900 text-white uppercase tracking-widest text-sm py-4 mt-4">Kaydet</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafafa] py-16 px-4 flex justify-center">
      <div className="max-w-6xl w-full bg-white border border-gray-100 shadow-sm p-8 md:p-12">
        <div className="flex justify-between items-center mb-12 border-b pb-8">
          <h1 className="text-3xl font-light tracking-widest uppercase">Kontrol Paneli</h1>
          <div className="flex gap-4 items-center">
            <Link href="/yazi-ekle" className="bg-green-600 text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-green-700 transition-all">
              + Yeni Yazı
            </Link>
            <button onClick={handleLogout} className="text-xs uppercase tracking-widest text-gray-400 hover:text-red-500">Çıkış</button>
          </div>
        </div>

        <div className="flex gap-8 mb-12 border-b border-gray-50">
          {['posts', 'categories', 'settings'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-xs uppercase tracking-widest transition-all ${activeTab === tab ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-400 hover:text-gray-900'}`}
            >
              {tab === 'posts' ? 'Yazılar' : tab === 'categories' ? 'Kategoriler' : 'Hakkımızda'}
            </button>
          ))}
        </div>

        {activeTab === 'posts' && (
          <div className="flex flex-col gap-4">
            {posts.map(post => (
              <div key={post.id} className="group flex justify-between items-center p-5 border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all">
                <div className="flex flex-col flex-grow">
                  <h3 className="font-medium text-gray-900">{post.baslik}</h3>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">{post.kategori_adi || 'Kategorisiz'}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingPost(post)} className="opacity-40 group-hover:opacity-100 bg-blue-50 text-blue-500 text-xs px-4 py-2 hover:bg-blue-500 hover:text-white transition-all">Düzenle</button>
                  <button onClick={() => deleteItem('posts', post.id)} className="opacity-40 group-hover:opacity-100 bg-red-50 text-red-500 text-xs px-4 py-2 hover:bg-red-500 hover:text-white transition-all">Sil</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="flex flex-col gap-4">
            {categories.map(cat => (
              <div key={cat.id} className="group flex justify-between items-center p-5 border border-gray-100 hover:border-gray-300 transition-all">
                <span className="uppercase tracking-widest text-sm text-gray-700">{cat.kategori_adi}</span>
                <button onClick={() => deleteItem('categories', cat.id)} className="opacity-40 group-hover:opacity-100 bg-red-50 text-red-500 text-xs px-4 py-2 hover:bg-red-500 hover:text-white transition-all">Sil</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="flex flex-col gap-6">
            <div className="h-96 mb-12">
              <ReactQuill theme="snow" value={aboutText} onChange={setAboutText} className="h-full" />
            </div>
            <button onClick={saveAbout} className="bg-gray-900 text-white py-4 uppercase tracking-widest text-sm hover:bg-gray-800 transition-all mt-8">Güncelle</button>
          </div>
        )}
      </div>
    </main>
  );
}
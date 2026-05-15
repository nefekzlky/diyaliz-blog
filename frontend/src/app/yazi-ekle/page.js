"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function CreatePost() {
  const router = useRouter();
  const quillRef = useRef(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [isChecking, setIsChecking] = useState(true);
  
  const [categories, setCategories] = useState([]);
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const [formData, setFormData] = useState({
    baslik: '',
    icerik: '',
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
      .catch(err => console.error(err));
  };

  // Cloudinary Resim Yükleme Entegrasyonu
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

  // Editör Araç Çubuğu ve Modüller
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
      fetchCategories();
    } else {
      alert("Hatalı parola!");
      setPasswordInput('');
    }
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
      }
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  // Kalkan Bekleme Ekranı
  if (isChecking) return <div className="min-h-screen bg-[#fafafa]"></div>;

  // Kalkan Giriş Ekranı
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4">
        <div className="bg-white border border-gray-100 p-8 w-full max-w-md shadow-sm text-center">
          <h1 className="text-xl tracking-widest uppercase mb-8">Admin Girişi</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="password" 
              className="w-full border p-3 outline-none focus:border-gray-400 text-center"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Parola"
              required
            />
            <button type="submit" className="bg-gray-900 text-white uppercase tracking-widest text-sm py-3">Giriş</button>
          </form>
        </div>
      </main>
    );
  }

  // Asıl İçerik Ekleme Formu
  return (
    <main className="min-h-screen bg-[#fafafa] flex flex-col items-center py-16 px-4">
      <div className="bg-white border border-gray-100 p-8 md:p-12 w-full max-w-5xl shadow-sm">
        <h1 className="text-3xl font-light tracking-widest uppercase mb-8 text-center text-gray-900">Yeni Not Ekle</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input 
              type="text" placeholder="Başlık" required
              className="w-full border border-gray-200 p-3 outline-none focus:border-gray-400"
              value={formData.baslik}
              onChange={(e) => setFormData({...formData, baslik: e.target.value})}
            />
            
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
                className="w-full border border-gray-200 p-3 outline-none focus:border-gray-400 bg-white"
                value={formData.kategori_id}
                onChange={(e) => {
                  if (e.target.value === "new") {
                    setIsCreatingNewCategory(true);
                  } else {
                    setFormData({...formData, kategori_id: e.target.value});
                  }
                }}
              >
                {categories.map(c => <option key={c.id} value={c.id}>{c.kategori_adi}</option>)}
                <option value="new">+ Yeni Kategori Oluştur...</option>
              </select>
            )}
          </div>
          
          <div className="h-80 mb-12">
            <ReactQuill 
              ref={quillRef}
              theme="snow" 
              value={formData.icerik} 
              onChange={(val) => setFormData({...formData, icerik: val})} 
              modules={modules}
              className="h-full font-serif"
            />
          </div>
          
          <button type="submit" className="bg-gray-900 text-white uppercase tracking-widest text-sm py-4 mt-4 hover:bg-gray-800 transition-colors">
            Yayımla
          </button>
        </form>
      </div>
    </main>
  );
}
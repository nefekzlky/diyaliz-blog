import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getPost(slug) {
  try {
    const res = await fetch(`http://localhost:5000/api/posts/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Hata:", error);
    return null;
  }
}

export default async function PostDetail({ params }) {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#fafafa] text-gray-800 py-16 px-4">
      <article className="max-w-3xl mx-auto bg-white border border-gray-100 p-8 md:p-16 shadow-sm">
        
        <div className="mb-12 text-center border-b border-gray-100 pb-8">
          <span className="text-xs uppercase tracking-widest text-gray-400 block mb-4">
            {post.kategori_adi || 'Genel'}
          </span>
          
          <h1 className="text-3xl md:text-5xl font-medium text-gray-900 mb-6 leading-tight">
            {post.baslik}
          </h1>
          
          <div className="text-sm text-gray-400 flex justify-center items-center gap-4 uppercase tracking-wider font-light">
            <span>{post.yazar_adi}</span>
            <span>&bull;</span>
            <span>{new Date(post.olusturulma_tarihi).toLocaleDateString('tr-TR')}</span>
          </div>
        </div>

        <div className="prose prose-lg text-gray-600 max-w-none leading-relaxed font-serif">
          <p>{post.icerik}</p>
        </div>

        <div className="mt-16 pt-8 text-center">
          <Link href="/" className="text-sm uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors">
            &larr; Ana Sayfaya Dön
          </Link>
        </div>

      </article>
    </main>
  );
}
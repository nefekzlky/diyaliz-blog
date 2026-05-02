import Link from 'next/link';

async function getPosts() {
  try {
    
    const res = await fetch('http://localhost:5000/api/posts', { cache: 'no-store' });
    
    if (!res.ok) {
      throw new Error('Veri çekilemedi');
    }
    
    return res.json();
  } catch (error) {
    console.error("Hata:", error);
    return []; 
  }
}

export default async function Home() {

  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-[#fafafa] text-gray-800 flex flex-col items-center py-16">
      
      <div className="text-center mb-16">
        <h1 className="text-4xl font-light tracking-widest uppercase mb-4">
          Son Yazılar
        </h1>
        <p className="text-gray-500 font-serif italic">
          Diyaliz güncem ve paylaşımlarım...
        </p>
      </div>

      <div className="max-w-5xl w-full px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">Henüz yazı eklenmemiş.</p>
        ) : (
          
          posts.map((post) => (
            <Link href={`/yazi/${post.slug}`} key={post.id} className="group">
              <article className="bg-white border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 h-full flex flex-col cursor-pointer">
                
                <span className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">
                  {post.kategori_adi || 'Genel'}
                </span>
                
                <h2 className="text-xl font-medium text-gray-900 mb-3 group-hover:text-gray-500 transition-colors">
                  {post.baslik}
                </h2>
                
                <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow">
                  {post.icerik}
                </p>
                
                <div className="text-xs text-gray-400 mt-auto pt-4 border-t border-gray-50">
                  {new Date(post.olusturulma_tarihi).toLocaleDateString('tr-TR')}
                </div>
                
              </article>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
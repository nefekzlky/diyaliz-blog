import Link from 'next/link';

async function getAboutData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/about`, { cache: 'no-store' });
    if (!res.ok) return { text: "Yazı henüz eklenmedi." };
    return res.json();
  } catch (error) {
    return { text: "Sunucu hatası." };
  }
}

export default async function AboutPage() {
  const data = await getAboutData();

  return (
    <main className="min-h-screen bg-[#fafafa] flex items-center justify-center py-16 px-4">
      <div className="max-w-4xl w-full bg-white border border-gray-100 p-8 md:p-16 shadow-sm text-center">
        <h1 className="text-3xl md:text-4xl font-light tracking-widest uppercase mb-8 text-gray-900">
          Hakkımızda
        </h1>
        <div 
          className="prose prose-lg text-gray-600 max-w-none leading-relaxed font-serif text-justify mx-auto"
          dangerouslySetInnerHTML={{ __html: data.text }} 
        />
        <div className="mt-12 pt-8 border-t border-gray-100">
          <Link href="/" className="text-sm uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors">
            &larr; Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </main>
  );
}
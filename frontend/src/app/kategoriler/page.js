import Link from 'next/link';

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Kategoriler çekilemedi');
    return res.json();
  } catch (error) {
    console.error("Hata:", error);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-[#fafafa] text-gray-800 flex flex-col items-center py-16 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-light tracking-widest uppercase mb-4">
          Kategoriler
        </h1>
        <p className="text-gray-500 font-serif italic">
          Tüm notların konulara göre sınıflandırılmış hali...
        </p>
      </div>

      <div className="max-w-4xl w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">Henüz kategori bulunmuyor.</p>
        ) : (
          categories.map((kategori) => (
            <Link 
              key={kategori.id} 
              href={`/?kategori=${kategori.kategori_adi}`} 
              className="group"
            >
              <div className="bg-white border border-gray-100 p-8 text-center hover:border-gray-900 hover:shadow-md transition-all duration-300 h-full flex flex-col justify-center items-center">
                <h2 className="text-lg font-medium text-gray-900 uppercase tracking-wider group-hover:text-gray-600 transition-colors">
                  {kategori.kategori_adi}
                </h2>
              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
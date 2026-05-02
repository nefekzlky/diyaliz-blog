import Link from 'next/link';

export default function Header() {
  return (
   
    <header className="w-full border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        
        <Link href="/" className="text-xl font-light tracking-widest uppercase text-gray-900">
          Diyaliz Blog
        </Link>

        <nav className="hidden md:flex gap-8 text-sm uppercase tracking-widest text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors duration-300">
            Ana Sayfa
          </Link>
          <Link href="/kategoriler" className="hover:text-gray-900 transition-colors duration-300">
            Kategoriler
          </Link>
          <Link href="/hakkimizda" className="hover:text-gray-900 transition-colors duration-300">
            Hakkımızda
          </Link>
        </nav>

      </div>
    </header>
  );
}
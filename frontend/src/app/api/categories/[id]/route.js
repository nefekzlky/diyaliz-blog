import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  // URL'den gelen kategori ID'sini alıyoruz
  const { id } = await params;

  try {
    // Veritabanından o ID'ye sahip kategoriyi siliyoruz
    await db.query('DELETE FROM categories WHERE id = ?', [id]);
    
    return NextResponse.json({ success: true, message: 'Kategori başarıyla silindi' });
  } catch (error) {
    console.error("Kategori Silme Hatası:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}   
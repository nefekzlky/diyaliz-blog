import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// MEVCUT KATEGORİLERİ LİSTELE (GET)
export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM categories');
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Kategori GET Hatası:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// YENİ KATEGORİ EKLE (POST)
export async function POST(request) {
  try {
    const body = await request.json();
    const { kategori_adi } = body;

    // SEO uyumlu slug oluşturuyoruz (Örn: "Genel Bilgiler" -> "genel-bilgiler")
    const slug = kategori_adi
      .toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // Veritabanına ekleme işlemi
    const [result] = await db.query(
      'INSERT INTO categories (kategori_adi, slug) VALUES (?, ?)',
      [kategori_adi, slug]
    );

    // Frontend'in beklediği insertId bilgisini döndürüyoruz
    return NextResponse.json({ 
      success: true, 
      insertId: result.insertId, 
      message: 'Kategori başarıyla oluşturuldu' 
    });
  } catch (error) {
    console.error("Kategori POST Hatası:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
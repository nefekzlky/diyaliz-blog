import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const query = `
      SELECT p.*, c.kategori_adi 
      FROM posts p 
      LEFT JOIN categories c ON p.kategori_id = c.id 
      ORDER BY p.id DESC
    `;
    const [rows] = await db.query(query);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Yazılar GET Hatası:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { baslik, icerik, kategori_id } = body;

    const slug = baslik
      .toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    await db.query(
      'INSERT INTO posts (baslik, icerik, kategori_id, slug, yayin_durumu, yazar_id) VALUES (?, ?, ?, ?, ?, ?)',
      [baslik, icerik, kategori_id || null, slug, 'yayinda', 1] 
    );

    return NextResponse.json({ success: true, message: 'Yazı başarıyla eklendi!' });
  } catch (error) {
    console.error("Yazı Ekleme (POST) Hatası:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
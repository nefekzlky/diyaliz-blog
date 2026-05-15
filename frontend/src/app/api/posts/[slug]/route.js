import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { slug } = await params; 

  try {
    const [rows] = await db.query('SELECT * FROM posts WHERE slug = ?', [slug]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Yazı bulunamadı' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Yazı Detay Hatası:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { slug: id } = await params; 

  try {
    const body = await request.json();
    const { baslik, icerik, kategori_id } = body;

    await db.query(
      'UPDATE posts SET baslik = ?, icerik = ?, kategori_id = ? WHERE id = ?',
      [baslik, icerik, kategori_id || null, id]
    );

    return NextResponse.json({ success: true, message: 'Yazı güncellendi' });
  } catch (error) {
    console.error("Yazı Güncelleme Hatası:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { slug: id } = await params;

  try {
    await db.query('DELETE FROM posts WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Yazı silindi' });
  } catch (error) {
    console.error("Yazı Silme Hatası:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
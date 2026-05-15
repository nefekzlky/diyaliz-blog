import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows] = await db.query("SELECT setting_value FROM settings WHERE setting_key = 'about_us'");
    return NextResponse.json({ text: rows[0]?.setting_value || '' });
  } catch (error) {
    return NextResponse.json({ text: '' }); 
  }
}

export async function PUT(request) {
  try {
    const { text } = await request.json();
    
    await db.query("UPDATE settings SET setting_value = ? WHERE setting_key = 'about_us'", [text]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
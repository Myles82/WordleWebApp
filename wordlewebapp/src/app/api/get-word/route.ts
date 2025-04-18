import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';


export async function GET() {
  const res = await fetch('https://random-word-api.vercel.app/api?words=1&length=5');
  const data = await res.json();
  const word = data[0].toUpperCase();

  // Store securely in HttpOnly cookie (unreadable from JS)
  const cookieStore = await cookies();
  cookieStore.set('targetWord', word, {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 60 * 5, // 5 minutes
  });

  return NextResponse.json({ word }); // don’t send the word!
}
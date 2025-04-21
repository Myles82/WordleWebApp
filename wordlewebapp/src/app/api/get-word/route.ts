import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';


export async function GET() {
  
  let validWord = '';
  // Get random five letter word
  do {
    // Fetch from random word api
    const res = await fetch('https://random-word-api.vercel.app/api?words=1&length=5');
    const data = await res.json();
    const word = data[0];
    // Check random word is in dictionary api
    const checkWord = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (checkWord.ok) {
      validWord = word.toUpperCase();
    }
    // If not in dictionary try again
  } while (!validWord);
  // Store in cookie 
  const cookieStore = await cookies();
  cookieStore.set('targetWord', validWord, {
    httpOnly: true,
    secure: true,
    path: '/',
  });

  return NextResponse.json({ word: validWord });
}
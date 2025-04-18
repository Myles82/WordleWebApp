import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';




export async function POST(req: Request) {
  const { guess } = await req.json();

  const cookieStore = await cookies();
  const target = cookieStore.get('targetWord')?.value;

  if (!target) {
    return new Response('No word set', { status: 400 });
  }
  const word = guess.join('').toLowerCase();
  const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
  if (!dictRes.ok) {
    return new Response(JSON.stringify({ error: 'Invalid word' }), { status: 400 });
  }

  const result: string[] = Array(guess.length).fill('gray');
  const used = Array(target.length).fill(false);
  
  
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === target[i]) {
        result[i] = 'green';
    }
    else if(target.includes(guess[i])){
        result[i] = 'yellow'; 
    }
  }

  

  return NextResponse.json({ result });
}

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';




export async function POST(req: Request) {
  // Get guess from frontend
  const { guess } = await req.json();
  
  // Get target word from cookie
  const cookieStore = await cookies();
  const target = cookieStore.get('targetWord')?.value;
  

  // Check if target word was retreived
  if (!target) {
    return new Response('No word set', { status: 400 });
  }

  // Make guess lowercase and check if in dictionary
  const word = guess.join('').toLowerCase();
  const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
  if (!dictRes.ok) {
    console.log(dictRes.ok)
    return new Response(JSON.stringify({ error: 'Invalid word' }), { status: 400 });
  }

  // Instantiate an array full of gray
  const result: string[] = Array(guess.length).fill('gray');
  const used = Array(target.length).fill(false);
  
  let numletters: { [key: string]: number } = {};
  for (let i = 0; i < target.length; i++) {
    if (target[i] in numletters){
      numletters[target[i]] += 1
    }
    else{
      numletters[target[i]] = 1
    }
  }
  // Check for hits and near hits and adjust color accordingly
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === target[i]) {
        result[i] = 'green';
        numletters[guess[i]] -= 1
    }
  }
  for (let i = 0; i < guess.length; i++) {
    if(result[i]=='green'){ continue}
    if(target.includes(guess[i])&&numletters[guess[i]]>0){
      result[i] = 'yellow'; 
      numletters[guess[i]] -= 1
  }
  }

  

  return NextResponse.json({ result });
}

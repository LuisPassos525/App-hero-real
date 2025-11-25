import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // Se houver um parâmetro 'next', redirecionamos para lá depois. 
  // Caso contrário, vai para a homepage.
  const next = searchParams.get('next') ?? '/homepage';

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Se der erro ou não tiver código, volta pro login com aviso
  return NextResponse.redirect(`${origin}/login?error=auth_code_error`);
}
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audio = formData.get('audio') as File;

    if (!audio) {
      return NextResponse.json({ error: 'Aucun fichier audio' }, { status: 400 });
    }

    // 1. Upload audio dans Supabase Storage
    const fileName = `ticket_${Date.now()}.wav`;
    const { error: uploadError } = await supabase.storage
      .from('audio')
      .upload(fileName, audio, { contentType: 'audio/wav' });

    if (uploadError) throw uploadError;

    // 2. URL publique
    const { data: urlData } = supabase.storage
      .from('audio')
      .getPublicUrl(fileName);

    // 3. Création du ticket en base
    const { error: dbError } = await supabase
      .from('tickets')
      .insert({ audio_url: urlData.publicUrl });

    if (dbError) throw dbError;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id, audio_url } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    }

    // 1. Supprimer le fichier audio dans Storage
    if (audio_url) {
      const fileName = audio_url.split('/').pop();
      if (fileName) {
        await supabase.storage.from('audio').remove([fileName]);
      }
    }

    // 2. Supprimer le ticket en base
    const { error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
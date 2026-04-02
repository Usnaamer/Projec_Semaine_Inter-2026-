import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60; // 60 secondes max pour Vercel

// Fonction fetch avec retry automatique (pour le cold start HuggingFace)
async function fetchWithRetry(url: string, options: RequestInit, retries = 3, delayMs = 5000): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Tentative ${i + 1}/${retries} → ${url}`);
      const res = await fetch(url, options);

      // Si le modèle est en train de charger (503), on attend et on retry
      if (res.status === 503) {
        const body = await res.text();
        console.log(`Modèle en chargement (503), attente ${delayMs}ms...`, body);
        await new Promise(r => setTimeout(r, delayMs));
        continue;
      }

      return res;
    } catch (err) {
      console.error(`Erreur tentative ${i + 1}:`, err);
      if (i < retries - 1) {
        await new Promise(r => setTimeout(r, delayMs));
      } else {
        throw err;
      }
    }
  }
  throw new Error('Toutes les tentatives ont échoué');
}

export async function POST(req: NextRequest) {
  try {
    const token = process.env.HUGGINGFACE_TOKEN;
    console.log('Token présent:', !!token, '| Longueur:', token?.length ?? 0);

    if (!token || token.trim() === '') {
      return NextResponse.json({ error: 'Token HuggingFace manquant' }, { status: 500 });
    }

    const formData = await req.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json({ error: 'Aucune image reçue' }, { status: 400 });
    }

    console.log('Image reçue:', imageFile.size, 'bytes');

    // ─── ÉTAPE 1 : Analyser l'image avec un modèle vision ───
    const imageBuffer = await imageFile.arrayBuffer();
    const base64Input = Buffer.from(imageBuffer).toString('base64');

    const blipResponse = await fetchWithRetry(
      'https://router.huggingface.co/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'CohereLabs/aya-vision-32b:cohere',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Input}`,
                  },
                },
                {
                  type: 'text',
                  text: 'Décris en français toutes les instructions et le texte visibles sur cette image. Sois concis et liste chaque étape.',
                },
              ],
            },
          ],
          max_tokens: 300,
        }),
      }
    );

    if (!blipResponse.ok) {
      const err = await blipResponse.text();
      console.error('BLIP error:', err);
      return NextResponse.json({ error: 'Erreur BLIP: ' + err }, { status: 500 });
    }

    const blipResult = await blipResponse.json();
    console.log('Vision raw result:', JSON.stringify(blipResult).slice(0, 200));
    const description: string = blipResult?.choices?.[0]?.message?.content ?? 'an instructional poster';

    console.log('Vision description:', description);

    // ─── ÉTAPE 2 : Générer une image avec SDXL (gratuit sur hf-inference) ───
    const prompt = `A flat vector illustration in LEGO pictogram style, bright bold colors, white background, showing step-by-step instructions for: "${description}". Each step as a simple colorful icon, child-friendly, educational pictograms, clean rounded shapes, no text, no letters.`;

    const fluxResponse = await fetchWithRetry(
      'https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.trim()}`,
          'Content-Type': 'application/json',
          'x-wait-for-model': 'true',
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!fluxResponse.ok) {
      const err = await fluxResponse.text();
      console.error('SDXL error:', err);
      return NextResponse.json({ error: 'Erreur génération image: ' + err }, { status: 500 });
    }

    // SDXL retourne directement les bytes de l'image
    const imageArrayBuffer = await fluxResponse.arrayBuffer();
    const base64Image = Buffer.from(imageArrayBuffer).toString('base64');
    const finalImage = `data:image/jpeg;base64,${base64Image}`;

    return NextResponse.json({
      success: true,
      description,
      image: finalImage,
    });

  } catch (error) {
    console.error('Erreur scan:', error);
    return NextResponse.json({ error: 'Erreur serveur: ' + String(error) }, { status: 500 });
  }
}

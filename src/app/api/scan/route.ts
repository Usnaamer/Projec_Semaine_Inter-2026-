import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60; 

async function fetchWithRetry(url: string, options: RequestInit, retries = 3, delayMs = 5000): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Tentative ${i + 1}/${retries} → ${url}`);
      
      // AJOUT : Création d'un timeout forcé de 50 secondes pour ce fetch précis
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 50000); 

      const res = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (res.status === 503 || res.status === 429) {
        console.log(`Modèle saturé ou en chargement (${res.status}), attente...`);
        await new Promise(r => setTimeout(r, delayMs));
        continue;
      }

      return res;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.error("Le fetch a dépassé le délai de 50s");
      }
      console.error(`Erreur tentative ${i + 1}:`, err.message);
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
    if (!token) return NextResponse.json({ error: 'Token manquant' }, { status: 500 });

    const formData = await req.formData();
    const imageFile = formData.get('image') as File;
    if (!imageFile) return NextResponse.json({ error: 'Aucune image' }, { status: 400 });

    const imageBuffer = await imageFile.arrayBuffer();
    const base64Input = Buffer.from(imageBuffer).toString('base64');

    // ÉTAPE 1 : Analyse Vision
    // Note: Utilisation de l'endpoint chat/completions compatible OpenAI
    const blipResponse = await fetchWithRetry(
      'https://api-inference.huggingface.co/v1/chat/completions', // URL plus standard
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'CohereLabs/aya-vision-32b',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Décris en français les instructions de cette image. Sois concis.' },
                { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Input}` } },
              ],
            },
          ],
          max_tokens: 200,
        }),
      }
    );

    if (!blipResponse.ok) {
      const errText = await blipResponse.text();
      throw new Error(`Vision API Error: ${errText}`);
    }

    const blipResult = await blipResponse.json();
    const description = blipResult?.choices?.[0]?.message?.content ?? 'Instructions de lecture';

    // ÉTAPE 2 : Génération d'image (SDXL)
    // On utilise x-wait-for-model pour éviter le 503 immédiat
    const fluxResponse = await fetchWithRetry(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.trim()}`,
          'Content-Type': 'application/json',
          'x-wait-for-model': 'true',
          'x-use-cache': 'false' 
        },
        body: JSON.stringify({ 
            inputs: `Lego style pictogram, simple flat vector, instructions for: ${description}, white background, educational.` 
        }),
      }
    );

    if (!fluxResponse.ok) {
        const errText = await fluxResponse.text();
        throw new Error(`Image API Error: ${errText}`);
    }

    const imageArrayBuffer = await fluxResponse.arrayBuffer();
    const base64Image = Buffer.from(imageArrayBuffer).toString('base64');

    return NextResponse.json({
      success: true,
      description,
      image: `data:image/jpeg;base64,${base64Image}`,
    });

  } catch (error: any) {
    console.error('Erreur scan final:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
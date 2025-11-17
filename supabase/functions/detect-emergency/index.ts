import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const groqApiKey = Deno.env.get('GROQ_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid text input' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are an emergency detection system for a mental health support platform. Your ONLY job is to determine if the user's message contains indicators of immediate self-harm, suicide ideation, or crisis.

Respond with ONLY a JSON object in this exact format:
{
  "isEmergency": true/false,
  "confidence": 0.0-1.0
}

Consider these as emergencies:
- Direct statements about self-harm or suicide
- Planning or intent to harm oneself
- Immediate crisis or danger
- Active suicidal ideation

DO NOT flag as emergencies:
- General sadness or depression without immediate danger
- Past tense references to previous struggles
- Hypothetical or philosophical discussions
- Expressing difficulty without immediate harm intent

Be sensitive but accurate. Only flag true emergencies.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        temperature: 0.1,
        max_tokens: 100,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return new Response(
      JSON.stringify({
        success: true,
        isEmergency: result.isEmergency || false,
        confidence: result.confidence || 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in detect-emergency function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        isEmergency: false
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

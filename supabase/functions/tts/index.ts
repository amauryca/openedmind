import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, voice, language } = await req.json();

    if (!text || typeof text !== "string" || !text.trim()) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Prefer ElevenLabs if available, otherwise fall back to OpenAI TTS
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

    if (!ELEVENLABS_API_KEY && !OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "No TTS provider configured. Add ELEVENLABS_API_KEY or OPENAI_API_KEY." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Try ElevenLabs first (recommended for quality)
    if (ELEVENLABS_API_KEY) {
      // Default high-quality voice; users can override by passing a specific voice ID
      const defaultVoiceId = "9BWtsMINqrJLrRacOk9x"; // Aria
      const selectedVoice = (voice && typeof voice === "string" && voice.trim()) ? voice : defaultVoiceId;

      const elevenResp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`, {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
          "Accept": "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      });

      if (!elevenResp.ok) {
        const errText = await elevenResp.text();
        console.error("ElevenLabs TTS error:", elevenResp.status, errText);
      } else {
        const arrayBuffer = await elevenResp.arrayBuffer();
        const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        return new Response(JSON.stringify({ audioContent: base64Audio, provider: "elevenlabs" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Fallback: OpenAI TTS
    if (OPENAI_API_KEY) {
      const payload = {
        model: "tts-1",
        input: text,
        voice: voice || "alloy",
        response_format: "mp3",
      } as const;

      const response = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("OpenAI TTS error:", response.status, error);
        return new Response(
          JSON.stringify({ error: "Failed to generate speech" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const arrayBuffer = await response.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      return new Response(
        JSON.stringify({ audioContent: base64Audio, provider: "openai" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Should not reach here
    return new Response(JSON.stringify({ error: "No TTS provider available" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

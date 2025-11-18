import { supabase } from "@/integrations/supabase/client";

/**
 * Generate speech via Supabase Edge Function and play it.
 * Falls back to resolving silently if generation or playback fails (to avoid UI hangs).
 */
export async function speakViaEdge(text: string, language?: string, voice?: string): Promise<void> {
  try {
    const { data, error } = await supabase.functions.invoke("tts", {
      body: { text, language, voice },
    });

    if (error) throw new Error(error.message || "TTS function error");
    if (!data?.audioContent) throw new Error("No audio content returned");

    const src = `data:audio/mp3;base64,${data.audioContent}`;
    const audio = new Audio();
    audio.src = src;
    audio.preload = "auto";
    audio.crossOrigin = "anonymous";

    await new Promise<void>((resolve) => {
      const cleanup = () => {
        audio.onended = null;
        audio.onerror = null;
      };

      audio.onended = () => {
        cleanup();
        resolve();
      };
      audio.onerror = () => {
        cleanup();
        resolve();
      };

      // Some browsers require play() to be triggered in a user gesture; assume caller ensures that.
      // Still attempt to play and resolve even if it fails.
      audio.play().catch(() => resolve());
    });
  } catch {
    // Swallow errors to avoid blocking the UI flow
  }
}

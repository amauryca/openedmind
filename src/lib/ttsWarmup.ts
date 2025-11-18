import { speechAPI } from "@/lib/apis";

// Warm up browser TTS under a user gesture to bypass autoplay restrictions.
// Call this inside a click/tap handler (e.g., Start Session) before speaking real content.
export function warmupTTS(language?: string) {
  try {
    // Best-effort voice/lang selection
    const localeMap: Record<string, string> = {
      english: "en-US",
      spanish: "es-ES",
      french: "fr-FR",
      german: "de-DE",
      italian: "it-IT",
      portuguese: "pt-PT",
      russian: "ru-RU",
      japanese: "ja-JP",
      korean: "ko-KR",
      chinese: "zh-CN",
      arabic: "ar-SA",
      hindi: "hi-IN",
    };

    const selected = language ? language.toLowerCase() : "english";
    const bcp47 = localeMap[selected] || "en-US";

    // Cancel any pending speech and resume engine if paused
    try { speechAPI.synthesis.cancel(); } catch {}
    try { speechAPI.synthesis.resume?.(); } catch {}

    // Short, near-silent utterance to unlock audio policies
    const u = new SpeechSynthesisUtterance(".");
    u.lang = bcp47;
    u.volume = 0; // inaudible
    u.rate = 1;
    u.pitch = 1;

    // Speak immediately within the user gesture
    speechAPI.synthesis.speak(u);
  } catch {
    // No-op: warmup is best-effort
  }
}

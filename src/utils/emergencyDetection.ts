import { supabase } from '@/integrations/supabase/client';

// Fallback phrases for when API is unavailable
const EXPLICIT_SELF_HARM_PHRASES = [
  'kill myself',
  'killing myself',
  'end my life',
  'take my life',
  'commit suicide',
  'suicide',
  'want to die',
  "i want to die",
  "i'm going to kill myself",
  'hurt myself',
  'harm myself',
  'self harm',
  'self-harm',
  'end it all',
  'ending it all',
  'not worth living',
  'better off dead',
  'can\'t go on',
  'done with life',
  'give up on life',
  'no point living',
  'no reason to live',
  'life is hopeless',
  'want it to end',
  'planning to die',
  'thinking of dying',
  'ready to die',
  'wish i was dead',
  'wish i were dead',
  'nothing to live for',
  'life isn\'t worth it',
  'overdose',
  'cut myself',
  'cutting myself',
  'slash my wrists',
  'jump off',
  'hanging myself',
  'suffocate myself',
  'poison myself',
  'shoot myself',
  'drown myself',
  'worthless life',
  'hate my life',
  'life is meaningless',
  'can\'t take it anymore',
  'too much pain',
  'rather be dead',
  'escape this pain'
];

// AI-powered detection with fallback
export const detectEmergency = async (text: string): Promise<boolean> => {
  try {
    // Try AI-powered detection first
    const { data, error } = await supabase.functions.invoke('detect-emergency', {
      body: { text }
    });

    if (error) {
      console.error('Emergency detection API error:', error);
      // Fall back to keyword matching
      return fallbackDetection(text);
    }

    if (!data?.success) {
      console.error('Emergency detection failed:', data?.error);
      return fallbackDetection(text);
    }

    // Use AI result if confidence is high enough
    if (data.confidence >= 0.7) {
      return data.isEmergency;
    }

    // If confidence is low, double-check with fallback
    const fallbackResult = fallbackDetection(text);
    return data.isEmergency || fallbackResult;

  } catch (error) {
    console.error('Error in emergency detection:', error);
    // Fall back to keyword matching on any error
    return fallbackDetection(text);
  }
};

// Fallback keyword-based detection
const fallbackDetection = (text: string): boolean => {
  const lower = text.toLowerCase();
  return EXPLICIT_SELF_HARM_PHRASES.some((p) => lower.includes(p));
};

export const emergencyResponseMessage =
  "I'm very concerned about what you've shared. Your safety and well-being are the most important things right now. Please know that you're not alone and there are people who want to help you through this difficult time.";

import { supabase } from '@/integrations/supabase/client';

export interface SupportContext {
  age: string;
  sessionType: 'realtime' | 'text';
  mood?: string;
  emotion?: string;
  previousMessages?: string[];
  language?: string;
}

export const generateSupportResponse = async (
  userMessage: string,
  context: SupportContext
): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-support-response', {
      body: { 
        userMessage: userMessage.trim(),
        context,
        isWelcome: false
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(error.message);
    }

    if (!data?.success) {
      throw new Error(data?.error || 'Failed to generate response');
    }

    return data.response;
  } catch (error: any) {
    console.error('Error generating therapy response:', error);
    
    // Fallback responses
    const fallbacks = {
      'child': "I'm here to listen to you. Can you tell me more about how you're feeling?",
      'teen': "That sounds really tough. I'm here to help you work through this. What's been the hardest part?",
      'young-adult': "Thank you for sharing that with me. It takes courage to open up. What would feel most helpful to explore?",
      'adult': "I hear what you're saying, and your feelings are valid. How can we work on this together?",
      'senior': "I appreciate you sharing this with me. Your experience and feelings matter. What support would be most helpful?"
    };
    
    return fallbacks[context.age as keyof typeof fallbacks] || fallbacks.adult;
  }
};

export const generateWelcomeMessage = async (age: string, language?: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-support-response', {
      body: { 
        userMessage: '',
        context: { age, sessionType: 'text', language: language || 'english' },
        isWelcome: true
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(error.message);
    }

    if (!data?.success) {
      throw new Error(data?.error || 'Failed to generate welcome message');
    }

    return data.response;
  } catch (error: any) {
    console.error('Error generating welcome message:', error);
    
    // Fallback welcome messages
    const welcomes = {
      child: "Hi there! I'm your friendly helper. I'm here to listen and help you feel better. What would you like to talk about today?",
      teen: "Hey! I'm here to support you. I know things can be tough sometimes. What's been on your mind lately?",
      'young-adult': "Hello! I'm here to provide you with a safe space to talk. What would you like to discuss today?",
      adult: "Welcome. I'm here to listen and provide support as you navigate life's challenges. What brings you here today?",
      senior: "Good day! I'm honored to be here with you. I'm here to listen and support you. What would you like to share?"
    };
    
    return welcomes[age as keyof typeof welcomes] || welcomes.adult;
  }
};
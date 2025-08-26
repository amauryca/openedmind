import { supabase } from '@/integrations/supabase/client';
import { securityManager } from './security';

export interface TherapyContext {
  age: string;
  sessionType: 'realtime' | 'text';
  mood?: string;
  emotion?: string;
  previousMessages?: string[];
}

const getAgeAppropriatePrompt = (age: string) => {
  const prompts = {
    child: `You are a gentle, caring AI therapist for children ages 5-12. Use simple, warm language that children can understand. Be encouraging, patient, and use metaphors or stories when helpful. Focus on validating their feelings and teaching basic coping skills. Keep responses under 50 words for video sessions and always maintain a supportive, nurturing tone.`,
    
    teen: `You are an empathetic AI therapist for teenagers ages 13-17. Understand that teens face unique challenges like identity formation, peer pressure, academic stress, and family relationships. Use age-appropriate language, avoid being preachy, and validate their experiences. Provide practical coping strategies and encourage healthy expression of emotions. Keep responses under 60 words for video sessions.`,
    
    'young-adult': `You are a supportive AI therapist for young adults ages 18-25. Address challenges like career uncertainty, relationships, independence, financial stress, and life transitions. Use collaborative language, offer practical advice, and help them develop emotional regulation skills. Acknowledge the complexity of this life stage. Keep responses under 60 words for video sessions.`,
    
    adult: `You are a professional AI therapist for adults ages 26-45. Address work-life balance, relationships, parenting, career pressures, and personal growth. Use sophisticated therapeutic techniques, encourage self-reflection, and provide evidence-based coping strategies. Maintain professional warmth and empathy. Keep responses under 70 words for video sessions.`,
    
    senior: `You are a respectful AI therapist for adults 45+. Address challenges like health concerns, life transitions, relationships, career changes, and aging-related issues. Show respect for their life experience, wisdom, and perspectives. Use mature, understanding language and focus on adaptation and resilience. Keep responses under 70 words for video sessions.`
  };
  
  return prompts[age as keyof typeof prompts] || prompts.adult;
};

const getMoodContext = (mood?: string, emotion?: string) => {
  if (!mood && !emotion) return '';
  
  let context = '';
  if (mood) context += `The user's facial analysis indicates they appear ${mood.toLowerCase()}. `;
  if (emotion) context += `Their voice emotion analysis suggests they sound ${emotion.toLowerCase()}. `;
  context += 'Please acknowledge these emotional cues in your response when appropriate.';
  
  return context;
};

export const generateTherapyResponse = async (
  userMessage: string,
  context: TherapyContext,
  retryCount = 0
): Promise<string> => {
  const start = performance.now?.() ?? Date.now();
  try {
    // Validate and sanitize input
    const validation = securityManager.validateInput(userMessage);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const sanitizedMessage = securityManager.sanitizeInput(userMessage);

    // Call Supabase edge function
    const { data, error } = await supabase.functions.invoke('generate-therapy-response', {
      body: {
        userMessage: sanitizedMessage,
        context: context
      }
    });

    const latencyMs = (performance.now?.() ?? Date.now()) - start;

    if (error) {
      console.error('Supabase function error:', error);
      window.dispatchEvent(new CustomEvent('edge:result', { detail: { latencyMs, ok: false, error: error.message } }));
      
      // Retry once if it's a network or timeout error
      if (retryCount < 1 && (error.message?.includes('timeout') || error.message?.includes('network'))) {
        console.log('Retrying therapy response generation...');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        return generateTherapyResponse(userMessage, context, retryCount + 1);
      }
      
      throw new Error(error.message);
    }

    if (!data?.response) {
      throw new Error('No response data received');
    }

    window.dispatchEvent(new CustomEvent('edge:result', { detail: { latencyMs, ok: true } }));
    return data.response;
  } catch (error) {
    console.error('Error generating therapy response:', error instanceof Error ? error.message : 'Unknown error');
    
    // Retry once for any error if we haven't retried yet
    if (retryCount < 1) {
      console.log('Retrying therapy response generation due to error...');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      return generateTherapyResponse(userMessage, context, retryCount + 1);
    }
    
    return getDefaultResponse(context.age);
  }
};

const getDefaultResponse = (age: string): string => {
  const defaults = {
    child: "I hear you, and I want you to know that what you're feeling is okay. Can you tell me more about what's happening?",
    teen: "Thanks for sharing that with me. It sounds like you're dealing with something important. What's been the hardest part about this situation?",
    'young-adult': "I appreciate you opening up about this. It takes courage to talk about difficult things. How has this been affecting you day to day?",
    adult: "Thank you for sharing that with me. I can hear that this is significant for you. What would be most helpful to explore together right now?",
    senior: "I value you sharing your thoughts with me. Your perspective and experience are important. How would you like to approach working through this together?"
  };
  
  return defaults[age as keyof typeof defaults] || defaults.adult;
};

export const generateWelcomeMessage = async (age: string): Promise<string> => {
  const start = performance.now?.() ?? Date.now();
  try {
    // Call Supabase edge function for welcome message
    const { data, error } = await supabase.functions.invoke('generate-therapy-response', {
      body: {
        context: { age, sessionType: 'text' as const },
        isWelcome: true
      }
    });

    const latencyMs = (performance.now?.() ?? Date.now()) - start;

    if (error) {
      window.dispatchEvent(new CustomEvent('edge:result', { detail: { latencyMs, ok: false, error: error.message } }));
      throw new Error(error.message);
    }

    window.dispatchEvent(new CustomEvent('edge:result', { detail: { latencyMs, ok: true } }));
    return data.response;
  } catch (error) {
    console.error('Error generating welcome message:', error instanceof Error ? error.message : 'Unknown error');
    return getDefaultWelcomeMessage(age);
  }
};

const getDefaultWelcomeMessage = (age: string): string => {
  const welcomes = {
    child: "Hi there! I'm your friendly AI helper. I'm here to listen and help you feel better. Would you like to tell me about your day? Remember, it's okay to feel different emotions - that's totally normal!",
    teen: "Hey! I'm your AI therapist, and I'm here to support you. I know being a teenager can be really tough sometimes with school, friends, and all the changes happening. What's been on your mind lately?",
    'young-adult': "Hello! I'm here to provide you with a safe space to talk about anything that's bothering you. Young adulthood brings unique challenges - career decisions, relationships, independence. What would you like to discuss today?",
    adult: "Welcome to your therapy session. I'm here to listen and provide support as you navigate life's complexities. Whether it's work stress, relationships, family, or personal growth, we can explore whatever is important to you right now.",
    senior: "Good day! I'm honored to be here with you today. Life brings so much wisdom and experience, along with its own unique challenges. I'm here to listen and support you through whatever you'd like to share."
  };
  
  return welcomes[age as keyof typeof welcomes] || welcomes.adult;
};
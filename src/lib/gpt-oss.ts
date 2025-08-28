import { pipeline } from '@huggingface/transformers';
import { securityManager } from './security';

export interface TherapyContext {
  age: string;
  sessionType: 'realtime' | 'text';
  mood?: string;
  emotion?: string;
  previousMessages?: string[];
}

// Initialize the text generation pipeline
let textGenerator: any = null;

const initializeGPTOSS = async () => {
  if (!textGenerator) {
    try {
      console.log('Initializing GPT-OSS model...');
      textGenerator = await pipeline(
        "text-generation",
        "openai/gpt-oss-20b", // Using the smaller model for better performance
        { device: "webgpu" }
      );
      console.log('GPT-OSS initialized with WebGPU');
    } catch (error) {
      console.warn("WebGPU not available, falling back to CPU");
      textGenerator = await pipeline(
        "text-generation",
        "openai/gpt-oss-20b"
      );
      console.log('GPT-OSS initialized with CPU');
    }
  }
  return textGenerator;
};

const createTherapyPrompt = (context: TherapyContext, userMessage: string): string => {
  const ageGuidelines = {
    'child': "You are a gentle, patient therapist speaking with a child (ages 5-12). Use simple, warm language that's easy to understand. Be encouraging and supportive. Keep responses brief and caring.",
    'teen': "You are an understanding therapist working with a teenager (ages 13-17). Be relatable while maintaining professional boundaries. Acknowledge their feelings without being dismissive.",
    'young-adult': "You are a supportive therapist working with a young adult (ages 18-25). Address their unique challenges with empathy and practical guidance.",
    'adult': "You are a professional therapist working with an adult client. Provide thoughtful, evidence-based guidance while being empathetic and non-judgmental.",
    'senior': "You are a compassionate therapist working with an older adult. Be respectful of their life experience while providing gentle support and practical guidance."
  };

  const systemPrompt = ageGuidelines[context.age as keyof typeof ageGuidelines] || ageGuidelines.adult;
  
  const moodContext = context.mood || context.emotion 
    ? `\nCurrent emotional state detected: ${context.mood || 'unknown'} mood, ${context.emotion || 'unknown'} emotion. Please acknowledge these feelings appropriately.`
    : '';

  return `${systemPrompt}${moodContext}

Client: ${userMessage}

Therapist:`;
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

    console.log('Generating therapy response with GPT-OSS, context:', { 
      age: context.age, 
      sessionType: context.sessionType,
      messageLength: sanitizedMessage.length 
    });

    // Initialize the model if not already done
    const generator = await initializeGPTOSS();
    
    // Create the prompt
    const prompt = createTherapyPrompt(context, sanitizedMessage);
    
    // Generate response with appropriate parameters
    const result = await generator(prompt, {
      max_new_tokens: context.sessionType === 'realtime' ? 50 : 150,
      temperature: 0.7,
      do_sample: true,
      return_full_text: false,
      pad_token_id: 50256 // Standard padding token
    });

    let generatedText = result[0]?.generated_text || '';
    
    // Clean up the response
    generatedText = generatedText.trim();
    
    // Remove any potential prompt echoes
    if (generatedText.includes('Therapist:')) {
      generatedText = generatedText.split('Therapist:').pop()?.trim() || generatedText;
    }
    if (generatedText.includes('Client:')) {
      generatedText = generatedText.split('Client:')[0]?.trim() || generatedText;
    }
    
    if (!generatedText) {
      throw new Error('No response generated from GPT-OSS model');
    }

    const latencyMs = (performance.now?.() ?? Date.now()) - start;
    window.dispatchEvent(new CustomEvent('edge:result', { detail: { latencyMs, ok: true } }));
    
    console.log('Successfully generated therapy response with GPT-OSS');
    return generatedText;

  } catch (error: any) {
    const latencyMs = (performance.now?.() ?? Date.now()) - start;
    console.error('Error generating therapy response with GPT-OSS:', error);
    
    if (retryCount < 2) {
      console.log(`Retrying GPT-OSS generation... Attempt ${retryCount + 1}`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
      return generateTherapyResponse(userMessage, context, retryCount + 1);
    }
    
    window.dispatchEvent(new CustomEvent('edge:result', { detail: { latencyMs, ok: false, error: error.message } }));
    
    // Fallback response if all retries fail
    const fallbackResponses = {
      'child': "I'm here to listen to you. Can you tell me more about how you're feeling?",
      'teen': "That sounds really tough. I'm here to help you work through this. What's the hardest part for you right now?",
      'young-adult': "Thank you for sharing that with me. It takes courage to open up. What would feel most helpful to explore together?",
      'adult': "I hear what you're saying, and I want you to know that your feelings are valid. How can we work on this together?",
      'senior': "I appreciate you sharing this with me. Your feelings are important. What support would be most helpful right now?"
    };
    
    return fallbackResponses[context.age as keyof typeof fallbackResponses] || fallbackResponses.adult;
  }
};

export const generateWelcomeMessage = async (age: string): Promise<string> => {
  const start = performance.now?.() ?? Date.now();
  try {
    const welcomePrompts = {
      'child': "You are a gentle, caring therapist meeting a child for the first time. Create a warm, simple welcome message that makes them feel safe and comfortable.",
      'teen': "You are an understanding therapist meeting a teenager for the first time. Create a welcoming message that feels genuine and not patronizing.",
      'young-adult': "You are a supportive therapist meeting a young adult for the first time. Create a welcoming message that acknowledges their unique challenges.",
      'adult': "You are a professional therapist beginning a session with an adult client. Create a warm, professional welcome message.",
      'senior': "You are a respectful therapist meeting an older adult for the first time. Create a welcoming message that honors their experience."
    };

    const generator = await initializeGPTOSS();
    const prompt = (welcomePrompts[age as keyof typeof welcomePrompts] || welcomePrompts.adult) + "\n\nTherapist:";
    
    const result = await generator(prompt, {
      max_new_tokens: 100,
      temperature: 0.8,
      do_sample: true,
      return_full_text: false,
      pad_token_id: 50256
    });

    let welcomeMessage = result[0]?.generated_text?.trim() || '';
    
    // Clean up the response
    if (welcomeMessage.includes('Therapist:')) {
      welcomeMessage = welcomeMessage.split('Therapist:').pop()?.trim() || welcomeMessage;
    }
    
    const latencyMs = (performance.now?.() ?? Date.now()) - start;
    window.dispatchEvent(new CustomEvent('edge:result', { detail: { latencyMs, ok: true } }));
    
    return welcomeMessage || getDefaultWelcomeMessage(age);
  } catch (error) {
    const latencyMs = (performance.now?.() ?? Date.now()) - start;
    window.dispatchEvent(new CustomEvent('edge:result', { detail: { latencyMs, ok: false, error: error instanceof Error ? error.message : 'Unknown error' } }));
    console.error('Failed to generate welcome message with GPT-OSS:', error);
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
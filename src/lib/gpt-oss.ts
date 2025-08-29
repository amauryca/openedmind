import { pipeline } from '@huggingface/transformers';
import { securityManager } from './security';

export interface TherapyContext {
  age: string;
  sessionType: 'realtime' | 'text';
  mood?: string;
  emotion?: string;
  previousMessages?: string[];
}

// GPT-OSS pipeline instance
let gptOssGenerator: any = null;

const initializeGPTOSS = async () => {
  if (!gptOssGenerator) {
    try {
      console.log('Initializing text generation model...');
      // Try WebGPU first with DistilGPT-2 (has model files available)
      gptOssGenerator = await pipeline(
        "text-generation",
        "Xenova/distilgpt2",
        { 
          device: "webgpu",
          dtype: "fp16"
        }
      );
      console.log('DistilGPT-2 model initialized with WebGPU');
    } catch (error) {
      console.warn("WebGPU not available, falling back to WASM");
      try {
        gptOssGenerator = await pipeline(
          "text-generation",
          "Xenova/distilgpt2",
          { device: "wasm" }
        );
        console.log('DistilGPT-2 model initialized with WASM');
      } catch (wasmError) {
        console.warn('DistilGPT-2 failed, trying GPT-2:', wasmError);
        try {
          gptOssGenerator = await pipeline(
            "text-generation",
            "Xenova/gpt2",
            { device: "wasm" }
          );
          console.log('GPT-2 model initialized as fallback');
        } catch (finalError) {
          console.error('All models failed to initialize:', finalError);
          throw new Error('Unable to initialize any conversation model');
        }
      }
    }
  }
  return gptOssGenerator;
};

// Create therapy prompt for conversation model
const createTherapyPrompt = (context: TherapyContext, userMessage: string): string => {
  const systemInstructions = {
    'child': 'You are a gentle, caring therapist for children ages 5-12. Use simple, warm language. Be encouraging and patient. Keep responses short and easy to understand.',
    'teen': 'You are an understanding therapist for teenagers ages 13-17. Be relatable and non-judgmental. Acknowledge their unique challenges without being preachy.',
    'young-adult': 'You are a supportive therapist for young adults ages 18-25. Address career, relationship, and independence challenges with empathy and practical guidance.',
    'adult': 'You are a professional therapist for adults ages 26-45. Use evidence-based approaches and help with work-life balance, relationships, and personal growth.',
    'senior': 'You are a respectful therapist for adults 45+. Honor their life experience while addressing health, transitions, and aging-related concerns.'
  };

  const systemRole = systemInstructions[context.age as keyof typeof systemInstructions] || systemInstructions.adult;
  
  // Add emotional context if available
  let emotionalContext = '';
  if (context.mood || context.emotion) {
    emotionalContext = `\n\nThe client appears to be feeling ${context.mood || 'unknown'} and their emotional state seems ${context.emotion || 'neutral'}. Please acknowledge these feelings appropriately.`;
  }

  // Create a conversational prompt
  return `${systemRole}${emotionalContext}

You are having a therapy session. Provide a helpful, empathetic response that validates the client's feelings and offers gentle guidance. Keep responses conversational and supportive.

Client: ${userMessage}

Therapist:`;
};

// Create welcome message prompt
const createWelcomePrompt = (age: string): string => {
  const welcomeInstructions = {
    'child': 'Create a warm, simple welcome message for a child starting therapy. Make them feel safe and comfortable.',
    'teen': 'Create a genuine welcome message for a teenager. Avoid being patronizing and acknowledge their maturity.',
    'young-adult': 'Create a welcoming message for a young adult. Acknowledge their unique life stage challenges.',
    'adult': 'Create a professional but warm welcome message for an adult beginning therapy.',
    'senior': 'Create a respectful welcome message that honors the wisdom and experience of an older adult.'
  };

  const instruction = welcomeInstructions[age as keyof typeof welcomeInstructions] || welcomeInstructions.adult;

  return `You are a professional therapist meeting a new client for the first time. ${instruction}

Client: Hi, I'm here for my first therapy session.

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

    console.log('Generating therapy response with conversation model:', { 
      age: context.age, 
      sessionType: context.sessionType,
      messageLength: sanitizedMessage.length 
    });

    // Initialize conversation model if needed
    const generator = await initializeGPTOSS();
    
    // Get system role and emotional context
    const systemInstructions = {
      'child': 'You are a gentle, caring therapist for children ages 5-12. Use simple, warm language. Be encouraging and patient. Keep responses short and easy to understand.',
      'teen': 'You are an understanding therapist for teenagers ages 13-17. Be relatable and non-judgmental. Acknowledge their unique challenges without being preachy.',
      'young-adult': 'You are a supportive therapist for young adults ages 18-25. Address career, relationship, and independence challenges with empathy and practical guidance.',
      'adult': 'You are a professional therapist for adults ages 26-45. Use evidence-based approaches and help with work-life balance, relationships, and personal growth.',
      'senior': 'You are a respectful therapist for adults 45+. Honor their life experience while addressing health, transitions, and aging-related concerns.'
    };

    const systemRole = systemInstructions[context.age as keyof typeof systemInstructions] || systemInstructions.adult;
    
    // Add emotional context if available
    let emotionalContext = '';
    if (context.mood || context.emotion) {
      emotionalContext = `\n\nThe client appears to be feeling ${context.mood || 'unknown'} and their emotional state seems ${context.emotion || 'neutral'}. Please acknowledge these feelings appropriately.`;
    }

    // Use chat message format for GPT-OSS
    const messages = [
      {
        role: "system",
        content: `${systemRole}${emotionalContext}\n\nYou are having a therapy session. Provide a helpful, empathetic response that validates the client's feelings and offers gentle guidance. Keep responses conversational and supportive.`
      },
      {
        role: "user", 
        content: sanitizedMessage
      }
    ];

    // Generate response with therapy-optimized parameters
    const result = await generator(messages, {
      max_new_tokens: context.sessionType === 'realtime' ? 75 : 200,
      temperature: 0.8,
      top_p: 0.9,
      do_sample: true,
      repetition_penalty: 1.2,
      return_full_text: false
    });

    let response = result[0]?.generated_text || '';
    
    // Clean up the response
    response = response.trim();
    
    // Remove any leftover tokens or incomplete sentences
    response = response.replace(/\s*<\|.*?\|>\s*/g, '').trim();
    
    if (!response) {
      throw new Error('Empty response from conversation model');
    }

    const latencyMs = (performance.now?.() ?? Date.now()) - start;
    window.dispatchEvent(new CustomEvent('edge:result', { detail: { latencyMs, ok: true } }));
    
    console.log('Conversation response generated successfully:', response.substring(0, 100) + '...');
    return response;

  } catch (error: any) {
    const latencyMs = (performance.now?.() ?? Date.now()) - start;
    console.error('Error with conversation generation:', error);
    
    if (retryCount < 1) {
      console.log('Retrying conversation generation...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      return generateTherapyResponse(userMessage, context, retryCount + 1);
    }
    
    window.dispatchEvent(new CustomEvent('edge:result', { detail: { latencyMs, ok: false, error: error.message } }));
    
    // Fallback responses if conversation model fails
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

export const generateWelcomeMessage = async (age: string): Promise<string> => {
  const start = performance.now?.() ?? Date.now();
  
  try {
    console.log('Generating welcome message with text generation model');
    
    const generator = await initializeGPTOSS();
    const prompt = createWelcomePrompt(age);
    
    const result = await generator(prompt, {
      max_new_tokens: 100,
      temperature: 0.8,
      top_p: 0.9,
      do_sample: true,
      repetition_penalty: 1.2,
      return_full_text: false,
      pad_token_id: 50256
    });

    let welcomeMessage = result[0]?.generated_text || '';
    welcomeMessage = welcomeMessage.replace(/\s*<\|.*?\|>\s*/g, '').trim();
    
    const latencyMs = (performance.now?.() ?? Date.now()) - start;
    window.dispatchEvent(new CustomEvent('edge:result', { detail: { latencyMs, ok: true } }));
    
    return welcomeMessage || getDefaultWelcomeMessage(age);
  } catch (error) {
    const latencyMs = (performance.now?.() ?? Date.now()) - start;
    window.dispatchEvent(new CustomEvent('edge:result', { detail: { latencyMs, ok: false, error: error instanceof Error ? error.message : 'Unknown error' } }));
    console.error('Failed to generate welcome message with conversation model:', error);
    return getDefaultWelcomeMessage(age);
  }
};

const getDefaultWelcomeMessage = (age: string): string => {
  const welcomes = {
    child: "Hi there! I'm your friendly helper. I'm here to listen and help you feel better. What would you like to talk about today?",
    teen: "Hey! I'm here to support you. I know things can be tough sometimes. What's been on your mind lately?",
    'young-adult': "Hello! I'm here to provide you with a safe space to talk. What would you like to discuss today?",
    adult: "Welcome. I'm here to listen and provide support as you navigate life's challenges. What brings you here today?",
    senior: "Good day! I'm honored to be here with you. I'm here to listen and support you. What would you like to share?"
  };
  
  return welcomes[age as keyof typeof welcomes] || welcomes.adult;
};
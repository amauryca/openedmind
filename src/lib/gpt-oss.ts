import { securityManager } from './security';

export interface TherapyContext {
  age: string;
  sessionType: 'realtime' | 'text';
  mood?: string;
  emotion?: string;
  previousMessages?: string[];
}

// Simple fallback responses until GPT-OSS loads
const getTherapyResponse = (context: TherapyContext, userMessage: string): string => {
  const responses = {
    'child': [
      "I understand how you're feeling. It's okay to feel different emotions.",
      "That sounds important to you. Can you tell me more about it?",
      "I'm here to listen. What would help you feel better right now?"
    ],
    'teen': [
      "That sounds really tough. I hear that you're going through a lot.",
      "Your feelings are valid. What's been the hardest part for you?",
      "I'm here to support you. What would feel most helpful to talk about?"
    ],
    'young-adult': [
      "Thank you for sharing that with me. That takes courage.",
      "It sounds like you're dealing with some complex feelings.",
      "What do you think would be most helpful to explore together?"
    ],
    'adult': [
      "I hear what you're saying, and your feelings are completely valid.",
      "That sounds like a significant challenge you're facing.",
      "What support do you feel you need most right now?"
    ],
    'senior': [
      "I appreciate you sharing this with me. Your experience matters.",
      "That sounds like something that's been weighing on you.",
      "How can we work together to address this?"
    ]
  };

  const ageResponses = responses[context.age as keyof typeof responses] || responses.adult;
  const randomIndex = Math.floor(Math.random() * ageResponses.length);
  return ageResponses[randomIndex];
};

// For now, use simple responses while we work on GPT-OSS integration
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

    console.log('Generating therapy response (local mode):', { 
      age: context.age, 
      sessionType: context.sessionType,
      messageLength: sanitizedMessage.length 
    });

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const response = getTherapyResponse(context, sanitizedMessage);
    
    const latencyMs = (performance.now?.() ?? Date.now()) - start;
    window.dispatchEvent(new CustomEvent('edge:result', { detail: { latencyMs, ok: true } }));
    
    console.log('Successfully generated local therapy response');
    return response;

  } catch (error: any) {
    const latencyMs = (performance.now?.() ?? Date.now()) - start;
    console.error('Error generating therapy response:', error);
    
    window.dispatchEvent(new CustomEvent('edge:result', { detail: { latencyMs, ok: false, error: error.message } }));
    
    // Fallback response
    return "I'm here to listen and support you. Can you tell me more about what you're experiencing?";
  }
};

export const generateWelcomeMessage = async (age: string): Promise<string> => {
  const start = performance.now?.() ?? Date.now();
  
  try {
    console.log('Generating welcome message (local mode)');
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const welcomes = {
      child: "Hi there! I'm your friendly helper. I'm here to listen and help you feel better. What would you like to talk about today?",
      teen: "Hey! I'm here to support you. I know things can be tough sometimes. What's been on your mind lately?",
      'young-adult': "Hello! I'm here to provide you with a safe space to talk. What would you like to discuss today?",
      adult: "Welcome. I'm here to listen and provide support as you navigate life's challenges. What brings you here today?",
      senior: "Good day! I'm honored to be here with you. I'm here to listen and support you. What would you like to share?"
    };
    
    const latencyMs = (performance.now?.() ?? Date.now()) - start;
    window.dispatchEvent(new CustomEvent('edge:result', { detail: { latencyMs, ok: true } }));
    
    return welcomes[age as keyof typeof welcomes] || welcomes.adult;
  } catch (error) {
    const latencyMs = (performance.now?.() ?? Date.now()) - start;
    window.dispatchEvent(new CustomEvent('edge:result', { detail: { latencyMs, ok: false, error: error instanceof Error ? error.message : 'Unknown error' } }));
    console.error('Failed to generate welcome message:', error);
    return "Welcome! I'm here to listen and support you. How are you feeling today?";
  }
};
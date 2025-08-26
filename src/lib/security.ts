interface SecurityConfig {
  maxMessageLength: number;
  maxMessagesPerSession: number;
  cooldownPeriod: number;
  rateLimitWindow: number;
}

const DEFAULT_CONFIG: SecurityConfig = {
  maxMessageLength: 2000,
  maxMessagesPerSession: 100,
  cooldownPeriod: 500, // Reduced to 0.5 seconds for better UX
  rateLimitWindow: 60000, // 1 minute window
};

class SecurityManager {
  private messageCount = 0;
  private lastMessageTime = 0;
  private sessionStartTime = Date.now();
  private config = DEFAULT_CONFIG;

  validateInput(input: string): { isValid: boolean; error?: string } {
    // Check length
    if (input.length > this.config.maxMessageLength) {
      return { isValid: false, error: `Message too long. Maximum ${this.config.maxMessageLength} characters allowed.` };
    }

    // Check for potentially malicious patterns
    const maliciousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /data:text\/html/gi,
      /vbscript:/gi,
      /onload\s*=/gi,
      /onerror\s*=/gi
    ];

    for (const pattern of maliciousPatterns) {
      if (pattern.test(input)) {
        return { isValid: false, error: "Input contains potentially harmful content." };
      }
    }

    return { isValid: true };
  }

  sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript protocol
      .replace(/data:text\/html/gi, '') // Remove data URLs
      .trim();
  }

  checkRateLimit(): { allowed: boolean; error?: string } {
    const now = Date.now();
    
    // Check cooldown period
    if (now - this.lastMessageTime < this.config.cooldownPeriod) {
      return { allowed: false, error: "Please wait before sending another message." };
    }

    // Check session message limit
    if (this.messageCount >= this.config.maxMessagesPerSession) {
      return { allowed: false, error: "Session message limit reached. Please start a new session." };
    }

    // Check session duration (1 hour max)
    if (now - this.sessionStartTime > 3600000) {
      return { allowed: false, error: "Session expired. Please start a new session." };
    }

    this.messageCount++;
    this.lastMessageTime = now;
    return { allowed: true };
  }

  resetSession(): void {
    this.messageCount = 0;
    this.lastMessageTime = 0;
    this.sessionStartTime = Date.now();
  }

  validateApiKey(apiKey: string): boolean {
    // Basic API key format validation for Google AI
    return /^AIza[0-9A-Za-z-_]{35}$/.test(apiKey);
  }
}

export const securityManager = new SecurityManager();
export { SecurityManager };
// Free API integrations for NARA.I

// TypeScript declarations for Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

// 1. Web Speech API (100% Free - Browser Native)
export class WebSpeechAPI {
  public recognition: any = null;
  public synthesis: SpeechSynthesis;
  
  constructor() {
    // Speech-to-Text setup
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US'; // Default, will be set dynamically
    }
    
    // Text-to-Speech setup
    this.synthesis = window.speechSynthesis;
  }
  
  // Set recognition language dynamically
  setLanguage(language: string) {
    if (!this.recognition) return;
    
    // Map our language names to BCP 47 language codes
    const languageMap: Record<string, string> = {
      'english': 'en-US',
      'spanish': 'es-ES',
      'french': 'fr-FR',
      'german': 'de-DE',
      'italian': 'it-IT',
      'portuguese': 'pt-PT',
      'russian': 'ru-RU',
      'japanese': 'ja-JP',
      'korean': 'ko-KR',
      'chinese': 'zh-CN',
      'arabic': 'ar-SA',
      'hindi': 'hi-IN'
    };
    
    this.recognition.lang = languageMap[language.toLowerCase()] || 'en-US';
  }
  
  // Speech-to-Text
  startListening(onResult: (text: string, isFinal: boolean) => void, onError?: (error: any) => void) {
    if (!this.recognition) {
      onError?.('Speech recognition not supported');
      return;
    }
    
    this.recognition.onresult = (event) => {
      const result: SpeechRecognitionResult = event.results[event.results.length - 1];
      const transcript = result[0]?.transcript ?? "";
      const isFinal = result.isFinal === true;
      onResult(transcript, isFinal);
    };
    
    this.recognition.onerror = onError;
    this.recognition.start();
  }
  
  stopListening() {
    this.recognition?.stop();
  }
  
  // Text-to-Speech
  speak(text: string, voice?: string, rate: number = 1, pitch: number = 1) {
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (voice) {
      const voices = this.synthesis.getVoices();
      const selectedVoice = voices.find(v => v.name === voice);
      if (selectedVoice) utterance.voice = selectedVoice;
    }
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    this.synthesis.speak(utterance);
  }
  
  getAvailableVoices() {
    return this.synthesis.getVoices();
  }
  
  stopSpeaking() {
    this.synthesis.cancel();
  }
}

// 2. MediaPipe Face Landmark Detection for Emotion Analysis (Google - Free)
export class MediaPipeFaceEmotion {
  private faceLandmarker: any = null;
  private isInitialized = false;
  
  async initialize() {
    if (this.isInitialized) return true;
    
    try {
      const mediapipe = await import('@mediapipe/tasks-vision');
      const { FaceLandmarker, FilesetResolver } = mediapipe;
      
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm'
      );
      
      this.faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task',
          delegate: 'GPU'
        },
        runningMode: 'VIDEO',
        numFaces: 1,
        outputFaceBlendshapes: true // This gives us emotion-related data
      });
      
      this.isInitialized = true;
      console.log('[MediaPipe] Face Landmarker initialized successfully');
      return true;
    } catch (error) {
      console.error('[MediaPipe] Failed to initialize:', error);
      return false;
    }
  }
  
  async detectEmotion(videoElement: HTMLVideoElement): Promise<{ emotion: string; confidence: number }> {
    try {
      if (!videoElement || videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
        return { emotion: 'waiting', confidence: 0 };
      }
      
      if (!this.faceLandmarker || !this.isInitialized) {
        return { emotion: 'initializing', confidence: 0 };
      }
      
      const timestamp = performance.now();
      const results = this.faceLandmarker.detectForVideo(videoElement, timestamp);
      
      if (!results?.faceBlendshapes?.length) {
        return { emotion: 'no face detected', confidence: 0 };
      }
      
      // Extract blendshapes for emotion analysis
      const blendshapes = results.faceBlendshapes[0].categories;
      const getScore = (name: string): number => {
        const shape = blendshapes.find((b: any) => b.categoryName === name);
        return shape?.score || 0;
      };
      
      // Analyze facial expressions using blendshapes
      const mouthSmileLeft = getScore('mouthSmileLeft');
      const mouthSmileRight = getScore('mouthSmileRight');
      const browDownLeft = getScore('browDownLeft');
      const browDownRight = getScore('browDownRight');
      const browInnerUp = getScore('browInnerUp');
      const eyeSquintLeft = getScore('eyeSquintLeft');
      const eyeSquintRight = getScore('eyeSquintRight');
      const mouthFrownLeft = getScore('mouthFrownLeft');
      const mouthFrownRight = getScore('mouthFrownRight');
      const jawOpen = getScore('jawOpen');
      const eyeWideLeft = getScore('eyeWideLeft');
      const eyeWideRight = getScore('eyeWideRight');
      
      // Calculate emotion scores
      const smileScore = (mouthSmileLeft + mouthSmileRight) / 2;
      const frownScore = (mouthFrownLeft + mouthFrownRight) / 2;
      const browScore = (browDownLeft + browDownRight) / 2;
      const squintScore = (eyeSquintLeft + eyeSquintRight) / 2;
      const wideEyeScore = (eyeWideLeft + eyeWideRight) / 2;
      
      // Determine dominant emotion based on facial features
      const emotions: { emotion: string; score: number }[] = [
        { emotion: 'happy', score: smileScore * 1.5 + squintScore * 0.5 },
        { emotion: 'sad', score: frownScore + browInnerUp * 0.5 },
        { emotion: 'angry', score: browScore + frownScore * 0.5 },
        { emotion: 'surprised', score: wideEyeScore + browInnerUp + jawOpen * 0.3 },
        { emotion: 'focused', score: browScore * 0.5 + squintScore * 0.3 },
        { emotion: 'neutral', score: 0.15 } // baseline for neutral
      ];
      
      // Find dominant emotion
      emotions.sort((a, b) => b.score - a.score);
      const dominant = emotions[0];
      
      // Calculate confidence (normalized)
      const confidence = Math.min(1, Math.max(0.1, dominant.score));
      
      return { 
        emotion: dominant.emotion, 
        confidence: Math.round(confidence * 100) / 100 
      };
    } catch (error) {
      console.error('[MediaPipe] Emotion detection failed:', error);
      return { emotion: 'error', confidence: 0 };
    }
  }
}

// 3. Voice Emotion Analysis (Frequency-based analysis - Free)
export class VoiceEmotionAnalyzer {
  private audioContext: AudioContext | null = null;
  private analyzer: AnalyserNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private isConnected = false;
  
  async initialize() {
    try {
      this.audioContext = new AudioContext();
      this.analyzer = this.audioContext.createAnalyser();
      this.analyzer.fftSize = 512;
      this.analyzer.smoothingTimeConstant = 0.8;
      return true;
    } catch (error) {
      console.error('[VoiceAnalyzer] Failed to initialize:', error);
      return false;
    }
  }
  
  async analyzeVoiceTone(stream: MediaStream): Promise<{ emotion: string; energy: number }> {
    if (!this.audioContext || !this.analyzer) {
      return { emotion: 'not ready', energy: 0 };
    }
    
    // Connect source only once
    if (!this.isConnected) {
      try {
        this.source = this.audioContext.createMediaStreamSource(stream);
        this.source.connect(this.analyzer);
        this.isConnected = true;
      } catch (error) {
        console.error('[VoiceAnalyzer] Failed to connect stream:', error);
        return { emotion: 'error', energy: 0 };
      }
    }
    
    const dataArray = new Uint8Array(this.analyzer.frequencyBinCount);
    this.analyzer.getByteFrequencyData(dataArray);
    
    // Calculate energy levels in different frequency bands
    const lowFreq = dataArray.slice(0, 32).reduce((a, b) => a + b, 0) / 32; // Bass
    const midFreq = dataArray.slice(32, 128).reduce((a, b) => a + b, 0) / 96; // Mid
    const highFreq = dataArray.slice(128, 256).reduce((a, b) => a + b, 0) / 128; // Treble
    const totalEnergy = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    
    // Determine vocal characteristics based on frequency distribution
    let emotion = 'calm';
    
    if (totalEnergy < 10) {
      emotion = 'silent';
    } else if (totalEnergy > 80) {
      if (highFreq > midFreq) {
        emotion = 'excited';
      } else {
        emotion = 'intense';
      }
    } else if (totalEnergy > 50) {
      if (midFreq > highFreq && midFreq > lowFreq) {
        emotion = 'engaged';
      } else {
        emotion = 'active';
      }
    } else if (totalEnergy > 20) {
      emotion = 'speaking';
    } else {
      emotion = 'quiet';
    }
    
    return { 
      emotion, 
      energy: Math.round((totalEnergy / 255) * 100) / 100 
    };
  }
}

// Initialize all APIs
export const speechAPI = new WebSpeechAPI();
export const faceAPI = new MediaPipeFaceEmotion();
export const voiceAPI = new VoiceEmotionAnalyzer();

// Convenience wrapper functions for easy integration
export const initializeSpeechRecognition = async (onResult: (transcript: string) => void) => {
  return new Promise((resolve, reject) => {
    speechAPI.startListening(
      (text, isFinal) => {
        if (isFinal) {
          onResult(text);
        }
      },
      (error) => reject(error)
    );
    resolve(speechAPI);
  });
};

export const initializeFaceDetection = async (
  videoElement: HTMLVideoElement,
  onEmotionDetected: (emotions: Array<{ label: string; confidence: number }>) => void
) => {
  const initialized = await faceAPI.initialize();
  if (!initialized) {
    throw new Error('Failed to initialize face detection');
  }

  const intervalId = setInterval(async () => {
    try {
      const result = await faceAPI.detectEmotion(videoElement);
      onEmotionDetected([{ label: result.emotion, confidence: result.confidence }]);
    } catch (error) {
      console.error('Face detection error:', error);
    }
  }, 1000); // Update every 1 second

  return {
    close: () => clearInterval(intervalId)
  };
};

export const initializeVoiceEmotionAnalysis = async (
  stream: MediaStream,
  onEmotionDetected: (emotion: string) => void
) => {
  const initialized = await voiceAPI.initialize();
  if (!initialized) {
    throw new Error('Failed to initialize voice emotion analysis');
  }

  const intervalId = setInterval(async () => {
    try {
      const result = await voiceAPI.analyzeVoiceTone(stream);
      onEmotionDetected(result.emotion);
    } catch (error) {
      console.error('Voice emotion analysis error:', error);
    }
  }, 1000); // Update every 1 second

  return {
    close: () => clearInterval(intervalId)
  };
};

export const speakText = async (text: string, language?: string) => {
  return new Promise<void>((resolve) => {
    try {
      console.log('[speakText] Starting speech synthesis for:', text.substring(0, 50) + '...', 'Language:', language);

      // Use full BCP-47 language tags to improve compatibility across browsers
      const localeMap: Record<string, string> = {
        english: 'en-US',
        spanish: 'es-ES',
        french: 'fr-FR',
        german: 'de-DE',
        italian: 'it-IT',
        portuguese: 'pt-PT',
        russian: 'ru-RU',
        japanese: 'ja-JP',
        korean: 'ko-KR',
        chinese: 'zh-CN',
        arabic: 'ar-SA',
        hindi: 'hi-IN',
      };

      const selected = language ? language.toLowerCase() : 'english';
      const bcp47 = localeMap[selected] || 'en-US';
      console.log('[speakText] Using language code:', bcp47);

      // Always cancel to reset any stale queue/state (Safari/WebKit quirk)
      try { speechAPI.synthesis.cancel(); } catch {}

      // Ensure voices are loaded (getVoices may return empty initially)
      const loadVoices = (): Promise<SpeechSynthesisVoice[]> =>
        new Promise((res) => {
          const existing = speechAPI.synthesis.getVoices();
          if (existing && existing.length) {
            console.log('[speakText] Voices already loaded:', existing.length);
            return res(existing);
          }

          console.log('[speakText] Waiting for voices to load...');
          const timeoutId = setTimeout(() => {
            const fallbackVoices = speechAPI.synthesis.getVoices();
            console.log('[speakText] Voice loading timeout, using fallback:', fallbackVoices.length);
            res(fallbackVoices);
          }, 1500);

          const handler = () => {
            const v = speechAPI.synthesis.getVoices();
            if (v && v.length) {
              console.log('[speakText] Voices loaded via event:', v.length);
              // @ts-ignore - property exists in browsers
              speechAPI.synthesis.onvoiceschanged = null;
              clearTimeout(timeoutId);
              res(v);
            }
          };
          // @ts-ignore - property exists in browsers
          speechAPI.synthesis.onvoiceschanged = handler;
        });

      loadVoices().then((voices) => {
        console.log('[speakText] Available voices:', voices.map(v => `${v.name} (${v.lang})`).join(', '));

        // Prefer exact locale, otherwise fall back to language prefix
        const base = bcp47.split('-')[0];
        const voiceMatch =
          voices?.find((v) => v.lang?.toLowerCase() === bcp47.toLowerCase()) ||
          voices?.find((v) => v.lang?.toLowerCase().startsWith(base));

        const effectiveLang = (voiceMatch?.lang || bcp47);

        if (voiceMatch) {
          console.log('[speakText] Selected voice:', voiceMatch.name, voiceMatch.lang);
        } else {
          console.warn('[speakText] No matching voice found for', bcp47);
        }

        // Longer safety timer to ensure speech completes
        const safetyMs = Math.min(15000, Math.max(3000, Math.round(text.length * 60)));
        console.log('[speakText] Safety timeout set to:', safetyMs, 'ms');

        let hasResolved = false;
        const safeResolve = () => {
          if (!hasResolved) {
            hasResolved = true;
            console.log('[speakText] Speech completed');
            resolve();
          }
        };

        const safetyTimer = setTimeout(() => {
          console.warn('[speakText] Safety timeout reached');
          safeResolve();
        }, safetyMs);

        let started = false;

        const attachHandlers = (u: SpeechSynthesisUtterance) => {
          u.onstart = () => {
            started = true;
            console.log('[speakText] Speech started');
          };
          u.onend = () => {
            console.log('[speakText] Speech ended normally');
            clearTimeout(safetyTimer);
            safeResolve();
          };
          u.onerror = (event) => {
            console.error('[speakText] Speech error:', event.error, event);
            clearTimeout(safetyTimer);
            safeResolve();
          };
        };

        const speakOnce = (useVoice?: SpeechSynthesisVoice) => {
          const u = new SpeechSynthesisUtterance(text);
          u.lang = useVoice?.lang || effectiveLang;
          u.volume = 1;
          u.rate = 1;
          u.pitch = 1;
          if (useVoice) u.voice = useVoice;
          attachHandlers(u);
          console.log('[speakText] Calling speak()');
          speechAPI.synthesis.speak(u);
          console.log('[speakText] speak() called, speaking status:', speechAPI.synthesis.speaking);
        };

        // First attempt: matched voice (if any)
        speakOnce(voiceMatch);

        // Retry quickly if the engine didn't start (common on WebKit with non-Latin scripts)
        setTimeout(() => {
          if (!started) {
            console.warn('[speakText] No onstart within 800ms, retrying without explicit voice and looser lang');
            try { speechAPI.synthesis.cancel(); } catch {}
            const u2 = new SpeechSynthesisUtterance(text);
            const loose = effectiveLang.includes('-') ? effectiveLang.split('-')[0] : effectiveLang;
            u2.lang = loose;
            u2.volume = 1; u2.rate = 1; u2.pitch = 1;
            attachHandlers(u2);
            speechAPI.synthesis.speak(u2);
          }
        }, 800);
      }).catch(() => resolve());
    } catch (error) {
      console.error('[speakText] Exception:', error);
      // If anything fails, resolve to avoid blocking the UI
      resolve();
    }
  });
};
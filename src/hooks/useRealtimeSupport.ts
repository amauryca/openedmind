import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { SupportContext, generateSupportResponse, generateWelcomeMessage } from "@/lib/supportApi";
import { initializeFaceDetection, initializeVoiceEmotionAnalysis, speechAPI } from "@/lib/apis";
import { speakText } from "@/lib/apis";
import { detectEmergency } from "@/utils/emergencyDetection";
import { securityManager } from "@/lib/security";

export interface ConversationMessage {
  id: number;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface UseRealtimeSupportReturn {
  // Refs
  videoRef: React.RefObject<HTMLVideoElement>;
  // UI state
  selectedAge: string;
  setSelectedAge: (age: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  sessionActive: boolean;
  isCameraOn: boolean;
  isRecording: boolean;
  isListening: boolean;
  isAIResponding: boolean;
  showEmergencyModal: boolean;
  currentMood: string;
  emotionLevel: string;
  conversations: ConversationMessage[];
  logs: string[];
  // Actions
  handleStartSession: () => Promise<void>;
  handleEndSession: () => void;
  toggleRecording: () => void;
  toggleCamera: () => void;
  closeEmergency: () => void;
  simulateUserInput: (input: string) => void;
}

export const useRealtimeSupport = (): UseRealtimeSupportReturn => {
  const { toast } = useToast();

  // UI STATE
  const [selectedAge, setSelectedAge] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("english");
  const [sessionActive, setSessionActive] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isAIResponding, setIsAIResponding] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [currentMood, setCurrentMood] = useState("Neutral");
  const [emotionLevel, setEmotionLevel] = useState("Calm");
  const [conversations, setConversations] = useState<ConversationMessage[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  // Load conversation history from localStorage on mount (privacy-first: stored locally only)
  useEffect(() => {
    if (sessionActive) {
      const savedConversations = localStorage.getItem('openedmind-realtime-conversation');
      if (savedConversations) {
        try {
          const parsed = JSON.parse(savedConversations);
          setConversations(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
        } catch (error) {
          console.error('Error loading conversation history:', error);
        }
      }
    }
  }, [sessionActive]);

  // Save conversation history to localStorage (privacy-first: stays on device)
  useEffect(() => {
    if (conversations.length > 0 && sessionActive) {
      localStorage.setItem('openedmind-realtime-conversation', JSON.stringify(conversations));
    }
  }, [conversations, sessionActive]);

  // REFS
  const videoRef = useRef<HTMLVideoElement>(null);
  const faceDetectionRef = useRef<any>(null);
  const audioCtxRef = useRef<{ close: () => void } | null>(null);
  const isProcessingSpeech = useRef(false);
  const sessionActiveRef = useRef(false);
  const isRecordingRef = useRef(false);

  const addLog = useCallback((_msg: string) => {
    // logs disabled for realtime therapy session
  }, []);

  // Mood inference from user input
  const updateMoodFromText = useCallback((userInput: string) => {
    const lower = userInput.toLowerCase();
    if (lower.includes("sad") || lower.includes("depressed") || lower.includes("down")) {
      setCurrentMood("Concerned");
      setEmotionLevel("Melancholic");
    } else if (lower.includes("angry") || lower.includes("frustrated") || lower.includes("mad")) {
      setCurrentMood("Tense");
      setEmotionLevel("Frustrated");
    } else if (lower.includes("happy") || lower.includes("good") || lower.includes("great")) {
      setCurrentMood("Positive");
      setEmotionLevel("Upbeat");
    } else if (lower.includes("anxious") || lower.includes("worried") || lower.includes("nervous")) {
      setCurrentMood("Concerned");
      setEmotionLevel("Anxious");
    } else {
      setCurrentMood("Engaged");
      setEmotionLevel("Thoughtful");
    }
  }, []);

  // CAMERA + ANALYSIS INITIALIZATION
  useEffect(() => {
    if (!isCameraOn || !videoRef.current) return;

    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
          audio: { echoCancellation: true, noiseSuppression: true },
        });

        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        videoRef.current.setAttribute("webkit-playsinline", "true");

        try {
          faceDetectionRef.current = await initializeFaceDetection(videoRef.current, (emotions) => {
            const dominant = emotions[0];
            if (dominant) {
              setCurrentMood(dominant.label);
              setEmotionLevel(dominant.confidence > 0.7 ? "Strong" : "Mild");
            }
          });
        } catch (e) {
          addLog("Face detection error: " + (e as Error).message);
        }

        try {
          audioCtxRef.current = await initializeVoiceEmotionAnalysis(stream, (voiceEmotion) => {
            setEmotionLevel(voiceEmotion);
          });
        } catch (e) {
          addLog("Voice analysis error: " + (e as Error).message);
        }
      } catch (err: any) {
        addLog("Media access error: " + err?.message);
        toast({
          title: "Media Access Error",
          description: "Please allow camera and microphone access for full functionality.",
          variant: "destructive",
        });
      }
    };

    init();

    return () => {
      // cleanup on camera off
      if (faceDetectionRef.current) faceDetectionRef.current.close?.();
      if (audioCtxRef.current) audioCtxRef.current.close?.();
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isCameraOn, toast, addLog]);

  // Keep refs in sync with latest state to avoid stale closures
  useEffect(() => { sessionActiveRef.current = sessionActive; }, [sessionActive]);
  useEffect(() => { isRecordingRef.current = isRecording; }, [isRecording]);

  // SPEECH: START/STOP
  const startListening = useCallback(() => {
    if (!sessionActiveRef.current || !isRecordingRef.current || isProcessingSpeech.current) {
      addLog(
        `Cannot start listening - sessionActive: ${sessionActiveRef.current} isRecording: ${isRecordingRef.current} isProcessingSpeech: ${isProcessingSpeech.current}`
      );
      return;
    }

    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      addLog("Speech recognition not supported in this browser");
      toast({
        title: "Speech Recognition Error",
        description: "Speech recognition is not supported in your browser",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsListening(true);
      addLog("Starting speech recognition...");
      // Set the recognition language before starting
      speechAPI.setLanguage(selectedLanguage);
      speechAPI.startListening(
        (text, isFinal) => {
          addLog(`Speech result: ${text} | isFinal: ${isFinal}`);
          if (isFinal && text.trim() && !isProcessingSpeech.current && text.trim().length > 2) {
            // Auto-stop on final before processing
            setIsListening(false);
            speechAPI.stopListening();
            handleUserSpeech(text.trim());
          }
        },
        (error) => {
          addLog("Speech recognition error: " + (error?.message || String(error)));
          setIsListening(false);
          if (sessionActiveRef.current && isRecordingRef.current && !isProcessingSpeech.current) {
            setTimeout(() => {
              addLog("Restarting listening after error...");
              startListening();
            }, 1500);
          }
        }
      );
    } catch (e: any) {
      addLog("Failed to start speech recognition: " + e?.message);
      setIsListening(false);
    }
  }, [toast, addLog, selectedLanguage]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    speechAPI.stopListening();
  }, []);

  // CORE: Handle user speech end-to-end
  const handleUserSpeech = useCallback(
    async (input: string) => {
      addLog("User said: " + input);
      if (!sessionActiveRef.current || !selectedAge || isProcessingSpeech.current) {
        addLog(
          `Blocked processing - sessionActive: ${sessionActiveRef.current} selectedAge: ${selectedAge} isProcessing: ${isProcessingSpeech.current}`
        );
        return;
      }

      isProcessingSpeech.current = true;
      setIsListening(false);
      setIsAIResponding(true);

      // Validate
      const validation = securityManager.validateInput(input);
      if (!validation.isValid) {
        addLog("Input validation failed: " + validation.error);
        toast({ title: "Invalid Input", description: validation.error, variant: "destructive" });
        isProcessingSpeech.current = false;
        setIsAIResponding(false);
        return;
      }

      // Emergency detection (async AI-powered with language awareness)
      const isEmergency = await detectEmergency(input, selectedLanguage);
      if (isEmergency) {
        addLog("Emergency detected");
        setShowEmergencyModal(true);
        isProcessingSpeech.current = false;
        setIsAIResponding(false);
        return;
      }

      try {
        // add user message
        const userMsg: ConversationMessage = {
          id: Date.now(),
          type: "user",
          content: input,
          timestamp: new Date(),
        };
        setConversations((p) => [...p, userMsg]);

        // generate AI with full conversation history (until page refresh)
        // Privacy: Messages never leave the secure edge function, processed only for conversation continuity
        const ctx: SupportContext = {
          age: selectedAge,
          sessionType: "realtime",
          mood: currentMood || "neutral",
          emotion: emotionLevel || "calm",
          previousMessages: conversations.map((m) => m.content),
          language: selectedLanguage
        };

        addLog("Generating AI response...");
        const aiText = await generateSupportResponse(input, ctx);
        addLog("AI responded: " + aiText);

        const aiMsg: ConversationMessage = {
          id: Date.now() + 1,
          type: "ai",
          content: aiText,
          timestamp: new Date(),
        };
        setConversations((p) => [...p, aiMsg]);

        // speak
        addLog("Speaking AI response");
        try {
          await speakText(aiText, selectedLanguage);
          addLog("Finished speaking");
        } catch (se: any) {
          addLog("Speech synthesis failed: " + se?.message);
        }

        // mood update
        updateMoodFromText(input);
      } catch (err: any) {
        addLog("Error generating AI: " + err?.message);
        const fallback: ConversationMessage = {
          id: Date.now() + 2,
          type: "ai",
          content:
            "I apologize, but I'm having trouble responding right now. Could you please try again?",
          timestamp: new Date(),
        };
        setConversations((p) => [...p, fallback]);
        try {
          await speakText(fallback.content, selectedLanguage);
        } catch {}
      } finally {
        // reset and resume listening
        setIsAIResponding(false);
        isProcessingSpeech.current = false;
        setTimeout(() => {
          if (sessionActiveRef.current && !isProcessingSpeech.current && isRecordingRef.current) {
            addLog("Resuming listening...");
            setIsListening(true);
            // Set the recognition language
            speechAPI.setLanguage(selectedLanguage);
            speechAPI.startListening(
              (text, isFinal) => {
                addLog(`Speech result: ${text} | isFinal: ${isFinal}`);
                if (isFinal && text.trim() && !isProcessingSpeech.current && text.trim().length > 2) {
                  // Auto-stop on final before processing
                  setIsListening(false);
                  speechAPI.stopListening();
                  handleUserSpeech(text.trim());
                }
              },
              (error) => {
                addLog("Speech recognition error: " + (error?.message || String(error)));
                setIsListening(false);
              }
            );
          }
        }, 1000);
      }
    },
    [sessionActive, selectedAge, selectedLanguage, currentMood, emotionLevel, conversations, toast, updateMoodFromText, addLog]
  );

  // Session controls
  const handleStartSession = useCallback(async () => {
    if (!selectedAge) {
      toast({ title: "Age Selection Required", description: "Please select an age range to continue", variant: "destructive" });
      return;
    }

    setSessionActive(true);
    sessionActiveRef.current = true;
    setIsCameraOn(true);
    setIsRecording(true);
    isRecordingRef.current = true;
    setIsAIResponding(true);

    try {
      const welcome = await generateWelcomeMessage(selectedAge, selectedLanguage);
      setConversations([
        { id: Date.now(), type: "ai", content: welcome, timestamp: new Date() },
      ]);
      await speakText(welcome, selectedLanguage);
      addLog("Welcome message spoken");
      setTimeout(() => {
        if (sessionActiveRef.current && isRecordingRef.current && !isProcessingSpeech.current) {
          setIsListening(true);
          addLog("Starting listening after welcome (direct)");
          // Set the recognition language
          speechAPI.setLanguage(selectedLanguage);
          speechAPI.startListening(
            (text, isFinal) => {
              addLog(`Speech result: ${text} | isFinal: ${isFinal}`);
              if (isFinal && text.trim() && !isProcessingSpeech.current && text.trim().length > 2) {
                // Auto-stop on final before processing
                setIsListening(false);
                speechAPI.stopListening();
                handleUserSpeech(text.trim());
              }
            },
            (error) => {
              addLog("Speech recognition error: " + (error?.message || String(error)));
              setIsListening(false);
            }
          );
        }
      }, 800);
    } catch (e: any) {
      addLog("Failed to start session: " + e?.message);
      toast({ title: "Session Error", description: "Failed to start AI session. Please try again.", variant: "destructive" });
    } finally {
      setIsAIResponding(false);
    }
  }, [selectedAge, selectedLanguage, startListening, toast, addLog]);

  const handleEndSession = useCallback(() => {
    setSessionActive(false);
    setIsCameraOn(false);
    setIsRecording(false);
    setIsListening(false);
    setConversations([]);
    setCurrentMood("Neutral");
    setEmotionLevel("Calm");
    isProcessingSpeech.current = false;
    
    // Clear conversation history from localStorage for privacy
    localStorage.removeItem('openedmind-realtime-conversation');

    stopListening();
    speechAPI.stopSpeaking();
    if (faceDetectionRef.current) faceDetectionRef.current.close?.();
    if (audioCtxRef.current) audioCtxRef.current.close?.();
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
    }
  }, [stopListening]);

  // UI toggles
  const toggleRecording = useCallback(() => {
    setIsRecording((prev) => {
      const next = !prev;
      if (next) startListening();
      else stopListening();
      return next;
    });
  }, [startListening, stopListening]);

  const toggleCamera = useCallback(() => setIsCameraOn((p) => !p), []);

  const closeEmergency = useCallback(() => setShowEmergencyModal(false), []);

  // Demo helper
  const simulateUserInput = useCallback((input: string) => {
    addLog("Simulating input: " + input);
    handleUserSpeech(input);
  }, [handleUserSpeech, addLog]);

  return {
    videoRef,
    selectedAge,
    setSelectedAge,
    selectedLanguage,
    setSelectedLanguage,
    sessionActive,
    isCameraOn,
    isRecording,
    isListening,
    isAIResponding,
    showEmergencyModal,
    currentMood,
    emotionLevel,
    conversations,
    logs,
    handleStartSession,
    handleEndSession,
    toggleRecording,
    toggleCamera,
    closeEmergency,
    simulateUserInput,
  };
};

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Video, VideoOff, Pause, Play } from "lucide-react";
import NavBar from "@/components/NavBar";
import EmergencyModal from "@/components/EmergencyModal";
import DisclaimerFooter from "@/components/DisclaimerFooter";
import { useRealtimeSupport } from "@/hooks/useRealtimeSupport";
import SystemStatus from "@/components/SystemStatus";
import { warmupTTS } from "@/lib/ttsWarmup";

const RealtimeSupport: React.FC = () => {
  const {
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
    
    handleStartSession,
    handleEndSession,
    toggleRecording,
    toggleCamera,
    simulateUserInput,
    closeEmergency,
  } = useRealtimeSupport();

  // Demo phrases in different languages
  const demoPhrases: Record<string, { phrase1: string; phrase2: string; phrase3: string; label1: string; label2: string; label3: string }> = {
    english: {
      phrase1: "I've been feeling a bit anxious lately about work.",
      phrase2: "I had a good day today and feel accomplished.",
      phrase3: "I'm struggling with some relationship issues.",
      label1: '"Feeling anxious"',
      label2: '"Good day today"',
      label3: '"Relationship issues"'
    },
    spanish: {
      phrase1: "Me he sentido un poco ansioso últimamente por el trabajo.",
      phrase2: "Tuve un buen día hoy y me siento satisfecho.",
      phrase3: "Estoy luchando con algunos problemas de relación.",
      label1: '"Me siento ansioso"',
      label2: '"Buen día hoy"',
      label3: '"Problemas de relación"'
    },
    french: {
      phrase1: "Je me suis senti un peu anxieux ces derniers temps à propos du travail.",
      phrase2: "J'ai passé une bonne journée aujourd'hui et je me sens accompli.",
      phrase3: "Je traverse des difficultés relationnelles.",
      label1: '"Me sens anxieux"',
      label2: '"Bonne journée"',
      label3: '"Problèmes relationnels"'
    },
    german: {
      phrase1: "Ich habe mich in letzter Zeit wegen der Arbeit etwas ängstlich gefühlt.",
      phrase2: "Ich hatte heute einen guten Tag und fühle mich erfüllt.",
      phrase3: "Ich habe Schwierigkeiten mit Beziehungsproblemen.",
      label1: '"Fühle mich ängstlich"',
      label2: '"Guter Tag heute"',
      label3: '"Beziehungsprobleme"'
    },
    italian: {
      phrase1: "Mi sono sentito un po' ansioso ultimamente per il lavoro.",
      phrase2: "Ho avuto una buona giornata oggi e mi sento realizzato.",
      phrase3: "Sto lottando con alcuni problemi di relazione.",
      label1: '"Mi sento ansioso"',
      label2: '"Buona giornata"',
      label3: '"Problemi di relazione"'
    },
    portuguese: {
      phrase1: "Tenho me sentido um pouco ansioso ultimamente sobre o trabalho.",
      phrase2: "Tive um bom dia hoje e me sinto realizado.",
      phrase3: "Estou lutando com alguns problemas de relacionamento.",
      label1: '"Me sentindo ansioso"',
      label2: '"Bom dia hoje"',
      label3: '"Problemas de relacionamento"'
    },
    russian: {
      phrase1: "В последнее время я немного беспокоюсь о работе.",
      phrase2: "У меня был хороший день сегодня, и я чувствую себя успешным.",
      phrase3: "Я борюсь с некоторыми проблемами в отношениях.",
      label1: '"Чувствую тревогу"',
      label2: '"Хороший день"',
      label3: '"Проблемы в отношениях"'
    },
    japanese: {
      phrase1: "最近、仕事のことで少し不安を感じています。",
      phrase2: "今日はいい日で、達成感を感じています。",
      phrase3: "人間関係の問題に苦しんでいます。",
      label1: '"不安を感じる"',
      label2: '"いい日"',
      label3: '"人間関係の問題"'
    },
    korean: {
      phrase1: "최근 일에 대해 조금 불안을 느끼고 있습니다.",
      phrase2: "오늘 좋은 하루를 보냈고 성취감을 느낍니다.",
      phrase3: "인간관계 문제로 어려움을 겪고 있습니다.",
      label1: '"불안감"',
      label2: '"좋은 하루"',
      label3: '"관계 문제"'
    },
    chinese: {
      phrase1: "最近我对工作感到有点焦虑。",
      phrase2: "今天过得很好，感觉很有成就感。",
      phrase3: "我正在为一些关系问题而挣扎。",
      label1: '"感到焦虑"',
      label2: '"今天很好"',
      label3: '"关系问题"'
    },
    arabic: {
      phrase1: "لقد شعرت بالقلق قليلاً مؤخرًا بشأن العمل.",
      phrase2: "كان يومي جيدًا اليوم وأشعر بالإنجاز.",
      phrase3: "أعاني من بعض مشاكل العلاقات.",
      label1: '"أشعر بالقلق"',
      label2: '"يوم جيد"',
      label3: '"مشاكل العلاقات"'
    },
    hindi: {
      phrase1: "मैं हाल ही में काम को लेकर थोड़ा चिंतित महसूस कर रहा हूं।",
      phrase2: "आज मेरा दिन अच्छा रहा और मुझे उपलब्धि का अहसास हुआ।",
      phrase3: "मैं कुछ रिश्ते की समस्याओं से जूझ रहा हूं।",
      label1: '"चिंतित महसूस"',
      label2: '"अच्छा दिन"',
      label3: '"रिश्ते की समस्याएं"'
    }
  };

  const currentPhrases = demoPhrases[selectedLanguage] || demoPhrases.english;

  // Basic SEO tags for this page
  useEffect(() => {
    document.title = "Real-Time Empathetical Support | openedmind.org";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = "Real-time empathetical session with face and voice analysis and instant AI responses.";
      document.head.appendChild(m);
    } else {
      (metaDesc as HTMLMetaElement).content =
        "Real-time empathetical session with face and voice analysis and instant AI responses.";
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-calm">
      <NavBar />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Real-Time Empathetical Session</h1>
          <p className="text-xl text-muted-foreground">
            AI-powered emotional intelligence with live facial and voice analysis
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Video + Controls */}
          <div className="space-y-4 lg:space-y-6">
            {/* Age Selection */}
            <Card className="shadow-empathy animate-slide-in">
              <CardHeader>
                <CardTitle className="text-xl">Session Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Age Range</label>
                  <Select value={selectedAge} onValueChange={setSelectedAge}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select age range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="child">Child (6-12 years)</SelectItem>
                      <SelectItem value="teen">Teen (13-19 years)</SelectItem>
                      <SelectItem value="young-adult">Young Adult (20-39 years)</SelectItem>
                      <SelectItem value="adult">Middle Age (40-64 years)</SelectItem>
                      <SelectItem value="senior">Senior (65+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Language</label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Español</SelectItem>
                      <SelectItem value="french">Français</SelectItem>
                      <SelectItem value="german">Deutsch</SelectItem>
                      <SelectItem value="italian">Italiano</SelectItem>
                      <SelectItem value="portuguese">Português</SelectItem>
                      <SelectItem value="chinese">中文</SelectItem>
                      <SelectItem value="japanese">日本語</SelectItem>
                      <SelectItem value="korean">한국어</SelectItem>
                      <SelectItem value="arabic">العربية</SelectItem>
                      <SelectItem value="hindi">हिन्दी</SelectItem>
                      <SelectItem value="russian">Русский</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Video Feed */}
            <Card className="shadow-empathy animate-slide-in">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Video Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden aspect-video">
                  {isCameraOn ? (
                    <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Camera will activate when session starts</p>
                      </div>
                    </div>
                  )}

                  {/* Real-time Analysis Overlay */}
                  {sessionActive && (
                    <div className="absolute top-2 left-2 lg:top-4 lg:left-4 space-y-1 lg:space-y-2">
                      <Badge variant="secondary" className="bg-white/90 text-xs lg:text-sm">
                        Mood: {currentMood}
                      </Badge>
                      <Badge variant="secondary" className="bg-white/90 text-xs lg:text-sm">
                        Emotion: {emotionLevel}
                      </Badge>
                      {isListening && (
                        <Badge variant="secondary" className="bg-green-100/90 text-green-800 text-xs lg:text-sm">
                          🎤 Listening...
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <div className="flex flex-wrap justify-center gap-2 lg:gap-4">
              {!sessionActive ? (
                <Button onClick={() => { warmupTTS(selectedLanguage); handleStartSession(); }} variant="empathy" size="lg" className="min-w-[180px] lg:min-w-[200px]">
                  <Play className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                  Start Session
                </Button>
              ) : (
                <>
                  <Button onClick={toggleRecording} variant={isRecording ? "destructive" : "default"} size="lg" className="flex-1 lg:flex-none">
                    {isRecording ? (
                      <>
                        <MicOff className="h-4 w-4 lg:h-5 lg:w-5 mr-1 lg:mr-2" />
                        <span className="hidden sm:inline">Mute</span>
                        <span className="sm:hidden">🔇</span>
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 lg:h-5 lg:w-5 mr-1 lg:mr-2" />
                        <span className="hidden sm:inline">Unmute</span>
                        <span className="sm:hidden">🎤</span>
                      </>
                    )}
                  </Button>
                  <Button onClick={toggleCamera} variant={isCameraOn ? "secondary" : "outline"} size="lg" className="flex-1 lg:flex-none">
                    {isCameraOn ? (
                      <>
                        <VideoOff className="h-4 w-4 lg:h-5 lg:w-5 mr-1 lg:mr-2" />
                        <span className="hidden sm:inline">Stop Camera</span>
                        <span className="sm:hidden">📹</span>
                      </>
                    ) : (
                      <>
                        <Video className="h-4 w-4 lg:h-5 lg:w-5 mr-1 lg:mr-2" />
                        <span className="hidden sm:inline">Start Camera</span>
                        <span className="sm:hidden">📷</span>
                      </>
                    )}
                  </Button>
                  <Button onClick={handleEndSession} variant="destructive" size="lg" className="flex-1 lg:flex-none">
                    <Pause className="h-4 w-4 lg:h-5 lg:w-5 mr-1 lg:mr-2" />
                    <span className="hidden sm:inline">End Session</span>
                    <span className="sm:hidden">⏹️</span>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Chat + Analysis */}
          <div className="space-y-4 lg:space-y-6">
            {/* Conversation */}
            <Card className="shadow-empathy animate-slide-in flex-1">
              <CardHeader>
                <CardTitle className="text-xl">AI Empathetical Conversation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 lg:h-64 bg-gradient-calm rounded-lg p-3 lg:p-4 overflow-y-auto">
                  {sessionActive ? (
                    <div className="space-y-4">
                      {conversations.map((m) => (
                        <div
                          key={m.id}
                          className={`${m.type === "ai" ? "bg-white/80 dark:bg-white/10" : "bg-primary/10 ml-4 lg:ml-8"} rounded-lg p-2 lg:p-3 shadow-gentle animate-fade-in`}
                        >
                          <p className="text-xs lg:text-sm font-semibold text-primary mb-1">
                            {m.type === "ai" ? "🤖 openedmind.org" : "👤 You"}
                          </p>
                          <p className="text-foreground text-xs lg:text-sm leading-relaxed">{m.content}</p>
                          <p className="text-xs text-muted-foreground mt-1">{m.timestamp.toLocaleTimeString()}</p>
                        </div>
                      ))}

                      {isAIResponding && (
                        <div className="bg-white/80 dark:bg-white/10 rounded-lg p-2 lg:p-3 shadow-gentle animate-fade-in">
                          <p className="text-xs lg:text-sm font-semibold text-primary mb-1">🤖 openedmind.org</p>
                          <div className="animate-pulse-soft text-xs lg:text-sm text-muted-foreground">
                            💭 Analyzing your emotions and crafting response...
                          </div>
                        </div>
                      )}

                      {conversations.length === 0 && !isAIResponding && (
                        <div className="text-center">
                          <div className="animate-pulse-soft">
                            <span className="text-xs lg:text-sm text-muted-foreground">
                              {isListening ? "🎤 Listening for your voice..." : "🔇 Start speaking to begin conversation"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <p>Start a session to begin your empathetical conversation</p>
                    </div>
                  )}
                </div>

                {/* Demo Buttons & Tests */}
                {sessionActive && (
                  <div className="mt-3 lg:mt-4 space-y-2">
                    <p className="text-xs text-muted-foreground text-center">Demo: Quick test phrases (or just speak naturally)</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Button size="sm" variant="outline" onClick={() => simulateUserInput(currentPhrases.phrase1)} className="text-xs">
                        💬 {currentPhrases.label1}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => simulateUserInput(currentPhrases.phrase2)} className="text-xs">
                        💬 {currentPhrases.label2}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => simulateUserInput(currentPhrases.phrase3)} className="text-xs">
                        💬 {currentPhrases.label3}
                      </Button>
                    </div>

                    {/* Status */}
                    <div className="text-center text-xs text-muted-foreground bg-muted/30 rounded p-2">
                      Status: {isListening ? "🎤 Listening" : "🔇 Not listening"} | Processing: {isAIResponding ? "AI speaking/processing" : "Idle"}
                    </div>

                  </div>
                )}
              </CardContent>
            </Card>

            {/* Session Insights */}
            <Card className="shadow-empathy animate-slide-in">
              <CardHeader>
                <CardTitle className="text-xl">Session Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gradient-warm rounded-lg">
                    <h3 className="font-semibold text-sm text-muted-foreground">AI Understanding</h3>
                    <p className="text-lg font-bold text-primary">{currentMood}</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-warm rounded-lg">
                    <h3 className="font-semibold text-sm text-muted-foreground">Response Quality</h3>
                    <p className="text-lg font-bold text-primary">{emotionLevel}</p>
                  </div>
                </div>
                {!sessionActive && (
                  <p className="text-sm text-muted-foreground text-center py-4">Start a session to see AI insights</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info Cards */}
        <div className="mt-8 lg:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <Card className="shadow-gentle animate-slide-in">
            <CardContent className="p-4 lg:p-6 text-center">
              <Video className="h-6 w-6 lg:h-8 lg:w-8 mx-auto mb-2 lg:mb-3 text-primary" />
              <h3 className="font-semibold text-sm lg:text-base mb-1 lg:mb-2">Real-time Facial Analysis</h3>
              <p className="text-xs lg:text-sm text-muted-foreground">Free MediaPipe AI analyzes facial expressions instantly</p>
            </CardContent>
          </Card>
          <Card className="shadow-gentle animate-slide-in">
            <CardContent className="p-4 lg:p-6 text-center">
              <Mic className="h-6 w-6 lg:h-8 lg:w-8 mx-auto mb-2 lg:mb-3 text-primary" />
              <h3 className="font-semibold text-sm lg:text-base mb-1 lg:mb-2">Voice Emotion Detection</h3>
              <p className="text-xs lg:text-sm text-muted-foreground">Browser-based voice analysis with instant response</p>
            </CardContent>
          </Card>
          <Card className="shadow-gentle animate-slide-in">
            <CardContent className="p-4 lg:p-6 text-center">
              <Badge className="h-6 w-6 lg:h-8 lg:w-8 mx-auto mb-2 lg:mb-3 text-primary flex items-center justify-center text-xs">AI</Badge>
              <h3 className="font-semibold text-sm lg:text-base mb-1 lg:mb-2">Instant AI Response</h3>
              <p className="text-xs lg:text-sm text-muted-foreground">Immediate, age-appropriate empathetical responses</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Emergency Modal */}
      <EmergencyModal isOpen={showEmergencyModal} onClose={closeEmergency} />

      <SystemStatus sessionType="realtime" listening={isListening} aiResponding={isAIResponding} />

      <DisclaimerFooter />
    </div>
  );
};

export default RealtimeSupport;

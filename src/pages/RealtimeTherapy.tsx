import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Video, VideoOff, Pause, Play } from "lucide-react";
import NavBar from "@/components/NavBar";
import EmergencyModal from "@/components/EmergencyModal";
import DisclaimerFooter from "@/components/DisclaimerFooter";
import { useRealtimeTherapy } from "@/hooks/useRealtimeTherapy";
import SystemStatus from "@/components/SystemStatus";

const RealtimeTherapy: React.FC = () => {
  const {
    videoRef,
    selectedAge,
    setSelectedAge,
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
  } = useRealtimeTherapy();

  // Basic SEO tags for this page
  useEffect(() => {
    document.title = "Real-Time Therapy | openedmind.org";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = "Real-time therapy session with face and voice analysis and instant AI responses.";
      document.head.appendChild(m);
    } else {
      (metaDesc as HTMLMetaElement).content =
        "Real-time therapy session with face and voice analysis and instant AI responses.";
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-calm">
      <NavBar />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Real-Time Therapy Session</h1>
          <p className="text-xl text-muted-foreground">
            AI-powered emotional intelligence with live facial and voice analysis
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Video + Controls */}
          <div className="space-y-4 lg:space-y-6">
            {/* Age Selection */}
            <Card className="shadow-therapy animate-slide-in">
              <CardHeader>
                <CardTitle className="text-xl">Age Range</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            {/* Video Feed */}
            <Card className="shadow-therapy animate-slide-in">
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
                <Button onClick={handleStartSession} variant="therapy" size="lg" className="min-w-[180px] lg:min-w-[200px]">
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
            <Card className="shadow-therapy animate-slide-in flex-1">
              <CardHeader>
                <CardTitle className="text-xl">AI Therapist Conversation</CardTitle>
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
                      <p>Start a session to begin your therapy conversation</p>
                    </div>
                  )}
                </div>

                {/* Demo Buttons & Tests */}
                {sessionActive && (
                  <div className="mt-3 lg:mt-4 space-y-2">
                    <p className="text-xs text-muted-foreground text-center">Demo: Quick test phrases (or just speak naturally)</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Button size="sm" variant="outline" onClick={() => simulateUserInput("I've been feeling a bit anxious lately about work.")} className="text-xs">
                        💬 "Feeling anxious"
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => simulateUserInput("I had a good day today and feel accomplished.")} className="text-xs">
                        💬 "Good day today"
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => simulateUserInput("I'm struggling with some relationship issues.")} className="text-xs">
                        💬 "Relationship issues"
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
            <Card className="shadow-therapy animate-slide-in">
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
              <p className="text-xs lg:text-sm text-muted-foreground">Immediate, age-appropriate therapeutic responses</p>
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

export default RealtimeTherapy;

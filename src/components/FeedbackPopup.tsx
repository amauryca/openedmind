import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const FeedbackPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if popup was dismissed in this session
    const dismissed = sessionStorage.getItem("feedbackDismissed");
    if (dismissed) return;

    // Random delay between 30-90 seconds
    const delay = Math.random() * 60000 + 30000;
    
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("feedbackDismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-fade-in">
      <Card className="w-80 shadow-lg border-border">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">We'd love your feedback!</CardTitle>
              <CardDescription className="text-sm mt-1">
                Help us improve your experience
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            variant="empathy"
            className="w-full"
            onClick={() => {
              window.open(
                "https://forms.office.com/Pages/ResponsePage.aspx?id=E9pxtx3TRUedpjocyHRS0e46Dsi3NDxEsk8DKmAbJTFUM0JRU0FUOE9ITDRGSE5SQkhWU002VlhDQS4u",
                "_blank"
              );
              handleDismiss();
            }}
          >
            Share Feedback
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

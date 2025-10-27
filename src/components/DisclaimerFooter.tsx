import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const DisclaimerFooter = () => {
  return (
    <div className="py-8 bg-primary/5">
      <div className="container mx-auto px-4">
        <Card className="shadow-empathy bg-gradient-warm border-primary/20">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-primary mr-2" />
              <h3 className="text-lg font-semibold text-foreground">Important Disclaimer</h3>
            </div>
            <p className="text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              <strong>This AI service is not a substitute for professional mental health services or medical treatment.</strong> The conversations and responses provided are for educational and supportive purposes only. If you are experiencing a mental health crisis, thoughts of self-harm, or need immediate assistance, please contact emergency services (911), the Suicide & Crisis Lifeline (988), or consult with a qualified mental health professional immediately. For ongoing mental health concerns, we strongly recommend seeking help from licensed counselors or healthcare providers in your area.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DisclaimerFooter;
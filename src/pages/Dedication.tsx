import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import mastLogo from "@/assets/mast-logo.jpg";
import { SnakeGame } from "@/components/SnakeGame";

const Dedication = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in">
        <img 
          src={mastLogo} 
          alt="MAST Research Institute" 
          className="w-32 h-32 mx-auto rounded-full shadow-lg"
        />
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-2">
            With Gratitude <Heart className="text-primary fill-primary" />
          </h1>
          
          <div className="space-y-6 text-lg text-muted-foreground">
            <p className="leading-relaxed">
              This project is dedicated to my family and friends, whose unwavering support 
              and encouragement have made this journey possible, and to{" "}
              <span className="font-medium text-foreground">MAST (Maritime & Science Technology High School)</span>, 
              an institution that fosters innovation and excellence.
            </p>
            
            <div className="pt-4 border-t border-border/50">
              <p className="font-semibold text-foreground mb-2">Special Thanks To:</p>
              <p className="leading-relaxed">
                <span className="font-medium text-foreground">Mr. Harshman</span> and{" "}
                <span className="font-medium text-foreground">Mr. Stevenson</span>
              </p>
              <p className="text-base mt-2">
                Thank you for your invaluable guidance, mentorship, and belief in this project. 
                Your dedication to education and innovation has been truly inspiring.
              </p>
            </div>
          </div>
        </div>

        <Button 
          onClick={() => navigate("/")} 
          variant="outline"
          className="mt-8"
        >
          Return Home
        </Button>

        <div className="border-t border-border/50 pt-8 w-full">
          <SnakeGame />
        </div>
      </div>
    </div>
  );
};

export default Dedication;

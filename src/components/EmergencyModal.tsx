import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Phone, Heart, MessageCircle } from "lucide-react";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmergencyModal = ({ isOpen, onClose }: EmergencyModalProps) => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (isOpen) {
      setCountdown(10);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen]);

  const handleCall911 = () => {
    window.open("tel:911", "_self");
  };

  const handleCallSuicideHotline = () => {
    window.open("tel:988", "_self");
  };

  const handleCallCrisisText = () => {
    window.open("sms:741741", "_self");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto bg-gradient-to-br from-red-900 to-red-800 text-white border-none shadow-2xl">
        <DialogHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-yellow-400 rounded-full p-2">
              <AlertTriangle className="h-6 w-6 text-red-900" />
            </div>
          </div>
          <DialogTitle className="text-xl font-bold text-white mb-1">
            🚨 Crisis Support
          </DialogTitle>
          <p className="text-sm text-white/90 font-medium">
            You are not alone. Help is available 24/7.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Emergency 911 */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-3 shadow-lg border border-red-500">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-white mr-3" />
                <div>
                  <h3 className="text-sm font-bold text-white">Emergency Services</h3>
                  <p className="text-red-100 text-xs">Life-threatening situations</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleCall911}
              className="w-full bg-white text-red-700 hover:bg-red-50 font-bold text-sm py-2"
            >
              🚨 Call 911 Now
            </Button>
          </div>

          {/* Suicide Hotline */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-3 shadow-lg border border-blue-500">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Heart className="h-4 w-4 text-white mr-3" />
                <div>
                  <h3 className="text-sm font-bold text-white">Suicide & Crisis Lifeline</h3>
                  <p className="text-blue-100 text-xs">24/7 emotional support</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleCallSuicideHotline}
              className="w-full bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm py-2"
            >
              💙 Call 988
            </Button>
          </div>

          {/* Crisis Text Line */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-3 shadow-lg border border-green-500">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <MessageCircle className="h-4 w-4 text-white mr-3" />
                <div>
                  <h3 className="text-sm font-bold text-white">Crisis Text Line</h3>
                  <p className="text-green-100 text-xs">Text support available</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleCallCrisisText}
              className="w-full bg-white text-green-700 hover:bg-green-50 font-bold text-sm py-2"
            >
              💬 Text HOME to 741741
            </Button>
          </div>

          {/* Info Box */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <p className="text-white text-center text-xs leading-relaxed">
              <strong>All services are free, confidential, and available 24/7.</strong><br/>
              You matter, your life has value, and people care about you.
            </p>
          </div>

          {/* Continue Button */}
          <Button 
            onClick={onClose}
            disabled={countdown > 0}
            className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/40 py-2 text-sm font-medium transition-all duration-200"
          >
            {countdown > 0 ? `Continue Session (${countdown})` : '✓ Continue Session'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyModal;
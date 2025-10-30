import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { usePageTransition } from "@/hooks/usePageTransition";
import Index from "./pages/Index";
import RealtimeSupport from "./pages/RealtimeSupport";
import TextSupport from "./pages/TextSupport";
import NotFound from "./pages/NotFound";
import Interventions from "./pages/Interventions";
import HowItWorks from "./pages/HowItWorks";
import { HelmetProvider } from "react-helmet-async";
import { FeedbackPopup } from "@/components/FeedbackPopup";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isTransitioning } = usePageTransition();
  
  return (
    <div className={`min-h-screen transition-all duration-200 ease-out ${isTransitioning ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'}`}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/realtime-support" element={<RealtimeSupport />} />
        <Route path="/text-support" element={<TextSupport />} />
        <Route path="/interventions" element={<Interventions />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <FeedbackPopup />
        <Router basename={import.meta.env.DEV ? "/" : "/"}>
          <AppRoutes />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

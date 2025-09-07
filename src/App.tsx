import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { usePageTransition } from "@/hooks/usePageTransition";
import { useAccessibility } from "@/hooks/useAccessibility";
import { PerformanceMonitor } from "@/lib/performance";
import ErrorBoundary from "@/components/ErrorBoundary";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { OfflineBanner } from "@/components/OfflineBanner";
import { MobileOptimizations } from "@/components/MobileOptimizations";
import Index from "./pages/Index";
import RealtimeTherapy from "./pages/RealtimeTherapy";
import TextTherapy from "./pages/TextTherapy";
import NotFound from "./pages/NotFound";
import Interventions from "./pages/Interventions";
import HowItWorks from "./pages/HowItWorks";
import { HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isTransitioning } = usePageTransition();
  const accessibilityPrefs = useAccessibility();
  
  useEffect(() => {
    // Initialize performance monitoring
    const perfMonitor = PerformanceMonitor.getInstance();
    perfMonitor.measurePageLoad();
    
    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => perfMonitor.logMetrics(), 3000);
    }

    return () => perfMonitor.cleanup();
  }, []);
  
  return (
    <MobileOptimizations>
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      {/* Live region for screen readers */}
      <div id="live-region" className="live-region" aria-live="polite" aria-atomic="true"></div>
      
      {/* Offline banner */}
      <OfflineBanner />
      
      <div 
        id="main-content"
        className={`min-h-screen transition-all duration-200 ease-out ${
          isTransitioning ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
        } ${accessibilityPrefs.prefersReducedMotion ? 'transition-none' : ''}`}
      >
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/realtime-therapy" element={<RealtimeTherapy />} />
            <Route path="/text-therapy" element={<TextTherapy />} />
            <Route path="/interventions" element={<Interventions />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </div>
      
      {/* PWA install prompt */}
      <PWAInstallPrompt />
    </MobileOptimizations>
  );
};

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router basename={import.meta.env.DEV ? "/" : "/"}>
            <AppRoutes />
          </Router>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;

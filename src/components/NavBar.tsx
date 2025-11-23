import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Video, MessageCircle, Home, HeartPulse, Menu, BookOpen } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="relative z-50 bg-background/80 backdrop-blur-sm border-b border-border" role="navigation" aria-label="Primary">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-primary/5 transition-all duration-300 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="relative">
            <img 
              src="/uploads/b956bdcc-9ea9-4d25-9016-b4e126858282.png" 
              alt="openedmind.org" 
              className="w-10 h-10 rounded-lg shadow-md hover:scale-110 transition-transform duration-300"
            />
              <div className="absolute inset-0 bg-gradient-primary rounded-lg opacity-20"></div>
            </div>
            <span className="text-xl md:text-2xl font-bold text-foreground">
              openedmind<span className="text-primary">.org</span>
            </span>
          </div>
          
          <div className="flex space-x-2 md:space-x-4">
            {location.pathname !== "/" && (
              <Button 
                onClick={() => navigate("/")}
                variant="ghost"
                size="sm"
                className="hidden lg:flex"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            )}
            
            {location.pathname === "/" && (
              <>
                <Button 
                  onClick={() => scrollToSection("features")}
                  variant="ghost"
                  size="sm"
                  className="hidden lg:flex"
                >
                  Features
                </Button>
                <Button 
                  onClick={() => scrollToSection("support")}
                  variant="ghost"
                  size="sm"
                  className="hidden lg:flex"
                >
                  Support Options
                </Button>
              </>
            )}
            
            <Button 
              onClick={() => navigate("/realtime-support")}
              variant={location.pathname === "/realtime-support" ? "empathy" : "outline"}
              size="sm"
               className="hidden lg:inline-flex text-xs md:text-sm"
            >
              <Video className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Video Support</span>
              <span className="sm:hidden">Video</span>
            </Button>
            
            <Button 
              onClick={() => navigate("/text-support")}
              variant={location.pathname === "/text-support" ? "calm" : "outline"}
              size="sm"
               className="hidden lg:inline-flex text-xs md:text-sm"
            >
              <MessageCircle className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Text Support</span>
              <span className="sm:hidden">Text</span>
            </Button>

            <Button 
              onClick={() => navigate("/how-it-works")}
              variant={location.pathname === "/how-it-works" ? "default" : "outline"}
              size="sm"
               className="hidden lg:inline-flex text-xs md:text-sm"
            >
              <BookOpen className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">How it works</span>
              <span className="sm:hidden">About</span>
            </Button>

            <Button 
              onClick={() => navigate("/interventions")}
              variant={location.pathname === "/interventions" ? "default" : "outline"}
              size="sm"
              className="hidden lg:inline-flex text-xs md:text-sm"
            >
              <HeartPulse className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Interventions</span>
              <span className="sm:hidden">Tools</span>
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button aria-label="Open menu" variant="outline" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85%] sm:w-80">
                <SheetHeader>
                  <SheetTitle>Navigate</SheetTitle>
                </SheetHeader>
                <div className="mt-4 grid gap-2">
                  <SheetClose asChild>
                    <Button variant={location.pathname === "/" ? "default" : "ghost"} className="justify-start" onClick={() => navigate("/")}> 
                      <Home className="h-4 w-4 mr-2" /> Home
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button variant={location.pathname === "/realtime-support" ? "default" : "ghost"} className="justify-start" onClick={() => navigate("/realtime-support")}>
                      <Video className="h-4 w-4 mr-2" /> Real-Time Support
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button variant={location.pathname === "/text-support" ? "default" : "ghost"} className="justify-start" onClick={() => navigate("/text-support")}>
                      <MessageCircle className="h-4 w-4 mr-2" /> Text Support
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button variant={location.pathname === "/interventions" ? "default" : "ghost"} className="justify-start" onClick={() => navigate("/interventions")}>
                      <HeartPulse className="h-4 w-4 mr-2" /> Interventions
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button variant={location.pathname === "/how-it-works" ? "default" : "ghost"} className="justify-start" onClick={() => navigate("/how-it-works")}>
                      <BookOpen className="h-4 w-4 mr-2" /> How it works
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};


export default NavBar;
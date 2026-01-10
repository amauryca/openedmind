import { useState } from "react";
import { MapPin, Loader2, Navigation, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LocalResourceFinderProps {
  className?: string;
}

const LocalResourceFinder = ({ className }: LocalResourceFinderProps) => {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTriggered, setSearchTriggered] = useState(false);

  const getLocation = () => {
    setLoading(true);
    setError(null);
    setSearchTriggered(true);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError(
          err.code === 1
            ? "Location access denied. Please enable location services to find nearby resources."
            : "Unable to retrieve your location. Please try again."
        );
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  const searchLinks = location
    ? [
        {
          name: "Find Treatment (SAMHSA)",
          url: `https://findtreatment.gov/locator?sAddr=${location.lat},${location.lng}`,
          description: "Official SAMHSA treatment locator",
        },
        {
          name: "Psychology Today Therapists",
          url: `https://www.psychologytoday.com/us/therapists?gclid=&lat=${location.lat}&lon=${location.lng}`,
          description: "Find licensed therapists near you",
        },
        {
          name: "NAMI Local Programs",
          url: "https://www.nami.org/Support-Education/Support-Groups",
          description: "Local NAMI support groups",
        },
        {
          name: "Community Health Centers",
          url: `https://findahealthcenter.hrsa.gov/?zip=&radius=30&lat=${location.lat}&long=${location.lng}`,
          description: "Federally-funded health centers",
        },
        {
          name: "Google Maps - Mental Health",
          url: `https://www.google.com/maps/search/mental+health+services/@${location.lat},${location.lng},13z`,
          description: "Search for nearby mental health services",
        },
      ]
    : [];

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <div className="mx-auto p-3 rounded-full bg-primary/10 text-primary w-fit mb-2">
          <MapPin className="h-8 w-8" />
        </div>
        <CardTitle className="text-2xl">Find Local Resources</CardTitle>
        <CardDescription>
          Locate behavioral health facilities and therapists in your area
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!searchTriggered && (
          <Button onClick={getLocation} className="w-full" size="lg">
            <Navigation className="h-4 w-4 mr-2" />
            Use My Location
          </Button>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Getting your location...
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {location && !loading && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center mb-4">
              Click any link below to find resources near you:
            </p>
            {searchLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors group"
              >
                <div>
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {link.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            ))}
            <Button
              variant="outline"
              onClick={getLocation}
              className="w-full mt-4"
              size="sm"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Update Location
            </Button>
          </div>
        )}

        {!location && !loading && searchTriggered && !error && (
          <Button onClick={getLocation} variant="outline" className="w-full">
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default LocalResourceFinder;

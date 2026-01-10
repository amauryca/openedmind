import { Helmet } from "react-helmet-async";
import NavBar from "@/components/NavBar";
import DisclaimerFooter from "@/components/DisclaimerFooter";
import LocalResourceFinder from "@/components/LocalResourceFinder";
import { Phone, Globe, Clock, Heart, Users, Brain, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ResourceContact {
  name: string;
  description: string;
  phone?: string;
  website?: string;
  hours?: string;
  address?: string;
  icon: React.ReactNode;
}

const resources: ResourceContact[] = [
  {
    name: "988 Suicide & Crisis Lifeline",
    description: "Free, confidential support for people in distress, prevention and crisis resources.",
    phone: "988",
    website: "https://988lifeline.org",
    hours: "24/7",
    icon: <Heart className="h-6 w-6" />,
  },
  {
    name: "SAMHSA National Helpline",
    description: "Treatment referrals and information service for mental health and substance use disorders.",
    phone: "1-800-662-4357",
    website: "https://www.samhsa.gov/find-help/national-helpline",
    hours: "24/7, 365 days a year",
    icon: <Brain className="h-6 w-6" />,
  },
  {
    name: "Crisis Text Line",
    description: "Text HOME to 741741 to connect with a trained crisis counselor.",
    phone: "Text HOME to 741741",
    website: "https://www.crisistextline.org",
    hours: "24/7",
    icon: <Sparkles className="h-6 w-6" />,
  },
  {
    name: "NAMI Helpline",
    description: "National Alliance on Mental Illness provides support, education, and advocacy.",
    phone: "1-800-950-6264",
    website: "https://www.nami.org/help",
    hours: "Mon-Fri, 10am-10pm ET",
    icon: <Users className="h-6 w-6" />,
  },
  {
    name: "Veterans Crisis Line",
    description: "Confidential support for veterans and their loved ones.",
    phone: "1-800-273-8255 (Press 1)",
    website: "https://www.veteranscrisisline.net",
    hours: "24/7",
    icon: <Heart className="h-6 w-6" />,
  },
  {
    name: "National Domestic Violence Hotline",
    description: "Support for anyone affected by domestic violence or abuse.",
    phone: "1-800-799-7233",
    website: "https://www.thehotline.org",
    hours: "24/7",
    icon: <Users className="h-6 w-6" />,
  },
  {
    name: "Childhelp National Child Abuse Hotline",
    description: "Crisis intervention and support for child abuse victims and concerned adults.",
    phone: "1-800-422-4453",
    website: "https://www.childhelp.org",
    hours: "24/7",
    icon: <Heart className="h-6 w-6" />,
  },
  {
    name: "Trevor Project (LGBTQ+ Youth)",
    description: "Crisis intervention and suicide prevention for LGBTQ+ young people.",
    phone: "1-866-488-7386",
    website: "https://www.thetrevorproject.org",
    hours: "24/7",
    icon: <Sparkles className="h-6 w-6" />,
  },
];

const Resources = () => {
  return (
    <>
      <Helmet>
        <title>Behavioral Health Resources | Support Contacts</title>
        <meta
          name="description"
          content="Find behavioral health resources and crisis support contacts. Get help from trained professionals 24/7."
        />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <NavBar />
        
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Behavioral Health Resources
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                If you or someone you know needs support, these organizations provide 
                professional help and crisis intervention services.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {resources.map((resource, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10 text-primary">
                        {resource.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{resource.name}</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="mt-2">
                      {resource.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {resource.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={`tel:${resource.phone.replace(/[^0-9]/g, '')}`}
                          className="text-primary hover:underline font-medium"
                        >
                          {resource.phone}
                        </a>
                      </div>
                    )}
                    {resource.hours && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{resource.hours}</span>
                      </div>
                    )}
                    {resource.website && (
                      <Button variant="outline" size="sm" asChild className="w-full mt-2">
                        <a 
                          href={resource.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <Globe className="h-4 w-4" />
                          Visit Website
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12">
              <LocalResourceFinder />
            </div>

            <div className="mt-12 p-6 bg-muted rounded-lg text-center">
              <p className="text-muted-foreground">
                <strong>In an emergency, always call 911.</strong> These resources are meant 
                to supplement, not replace, professional medical care.
              </p>
            </div>
          </div>
        </main>

        <DisclaimerFooter />
      </div>
    </>
  );
};

export default Resources;

import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[rgba(215,201,175,0.05)] blur-[90px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06),transparent_55%)]" />
      </div>

      <Card className="relative w-full max-w-md shadow-ray-float">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-[linear-gradient(135deg,rgba(255,99,99,0.0)_0%,rgba(255,99,99,0.0)_42%,rgba(255,99,99,0.95)_42%,rgba(255,99,99,0.95)_58%,rgba(255,99,99,0.0)_58%,rgba(255,99,99,0.0)_100%)] shadow-ray-button" />
            <div>
              <p className="text-sm font-semibold text-foreground">Route not found</p>
              <p className="text-xs text-muted-foreground">{location.pathname}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-[40px] font-semibold leading-[1.1] tracking-[0px] text-foreground">404</h1>
            <p className="text-sm leading-[1.6] text-muted-foreground">
              This page doesn’t exist. Use the app entry route to return to your dashboard.
            </p>
          </div>
          <Button asChild variant="cta" className="w-full">
            <a href="/">Return to Home</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;

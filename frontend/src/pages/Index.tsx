import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[rgba(215,201,175,0.05)] blur-[90px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06),transparent_55%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1200px] items-center justify-center">
        <Card className="w-full max-w-lg shadow-ray-float">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-[linear-gradient(135deg,rgba(255,99,99,0.0)_0%,rgba(255,99,99,0.0)_42%,rgba(255,99,99,0.95)_42%,rgba(255,99,99,0.95)_58%,rgba(255,99,99,0.0)_58%,rgba(255,99,99,0.0)_100%)] shadow-ray-button" />
              <div>
                <p className="text-sm font-semibold text-foreground">MedVault-Central</p>
                <p className="text-xs text-muted-foreground">University Hospital EHR</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-[24px] font-medium tracking-[0.2px] text-foreground">Start here</h1>
              <p className="text-sm leading-[1.6] text-muted-foreground">
                Use the dashboard router to sign in and land on your role-specific workspace.
              </p>
            </div>
            <Button asChild variant="cta" className="w-full">
              <a href="/">Go to App</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;

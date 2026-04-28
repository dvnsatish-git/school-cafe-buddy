import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { BuddyProvider, useBuddy } from "@/context/BuddyContext";
import { BuddyBubble } from "@/components/BuddyBubble";
import Dashboard from "@/pages/Dashboard";
import FoodSelection from "@/pages/FoodSelection";
import Badges from "@/pages/Badges";
import Spending from "@/pages/Spending";
import Onboarding from "@/pages/Onboarding";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/select-food" component={FoodSelection} />
      <Route path="/badges" component={Badges} />
      <Route path="/spending" component={Spending} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppShell() {
  const { hasOnboarded } = useBuddy();

  if (!hasOnboarded) {
    return <Onboarding />;
  }

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3.5rem",
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur px-4 md:hidden">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <h1 className="font-display font-bold text-lg">Cafeteria Buddy</h1>
          </header>
          <main className="flex-1 overflow-auto">
            <Router />
          </main>
        </SidebarInset>
      </div>
      <BuddyBubble />
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BuddyProvider>
          <AppShell />
          <Toaster />
        </BuddyProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

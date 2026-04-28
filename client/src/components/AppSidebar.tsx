import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Home, UtensilsCrossed, Award, Wallet, RefreshCw } from "lucide-react";
import { useBuddy } from "@/context/BuddyContext";
import { ChangeBuddySheet } from "@/components/ChangeBuddySheet";
import schoolLogo from "@assets/IMG_4145_1768935229434.jpeg";

const menuItems = [
  { title: "Dashboard", href: "/", icon: Home },
  { title: "Choose Food", href: "/select-food", icon: UtensilsCrossed },
  { title: "My Badges", href: "/badges", icon: Award },
  { title: "Spending", href: "/spending", icon: Wallet },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { selectedBuddy } = useBuddy();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer" data-testid="link-home">
            <img 
              src={schoolLogo} 
              alt="Old Bridge Public School Logo" 
              className="w-10 h-10 rounded-md object-contain flex-shrink-0"
            />
            <div className="group-data-[collapsible=icon]:hidden">
              <h1 className="font-bold text-sm leading-tight">Madison Park Elementary</h1>
              <p className="text-xs text-muted-foreground">Cafeteria Buddy</p>
            </div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location === item.href;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link href={item.href} data-testid={`link-${item.title.toLowerCase().replace(" ", "-")}`}>
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 group-data-[collapsible=icon]:p-2">
        <ChangeBuddySheet
          trigger={
            <button
              className="w-full flex items-center gap-3 rounded-2xl p-3 transition-all hover:opacity-90 active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${selectedBuddy.color}22, ${selectedBuddy.color}44)`,
                border: `1.5px solid ${selectedBuddy.color}55`,
              }}
              data-testid="button-change-buddy"
            >
              <span className="text-2xl animate-buddy-bob inline-block shrink-0">
                {selectedBuddy.emoji}
              </span>
              <div className="group-data-[collapsible=icon]:hidden text-left min-w-0">
                <p className="font-display font-bold text-sm truncate" style={{ color: selectedBuddy.color }}>
                  {selectedBuddy.name}
                </p>
                <p className="font-sans text-xs text-muted-foreground flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Change buddy
                </p>
              </div>
            </button>
          }
        />
      </SidebarFooter>
    </Sidebar>
  );
}

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
import { Home, UtensilsCrossed, Award, Wallet, Sparkles } from "lucide-react";
import schoolLogo from "@assets/IMG_4145_1768935229434.jpeg";

const menuItems = [
  { title: "Dashboard", href: "/", icon: Home },
  { title: "Choose Food", href: "/select-food", icon: UtensilsCrossed },
  { title: "My Badges", href: "/badges", icon: Award },
  { title: "Spending", href: "/spending", icon: Wallet },
];

export function AppSidebar() {
  const [location] = useLocation();

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

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:p-2">
        <div className="rounded-lg bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 p-3 text-center group-data-[collapsible=icon]:hidden">
          <Sparkles className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">
            Eat healthy, earn points!
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

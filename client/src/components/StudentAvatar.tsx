import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface StudentAvatarProps {
  name: string;
  avatar?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-20 h-20",
};

export function StudentAvatar({ name, avatar, size = "md" }: StudentAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Avatar className={`${sizeClasses[size]} border-2 border-primary/20`} data-testid="avatar-student">
      {avatar && <AvatarImage src={avatar} alt={name} />}
      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-bold">
        {initials || <User className="w-4 h-4" />}
      </AvatarFallback>
    </Avatar>
  );
}

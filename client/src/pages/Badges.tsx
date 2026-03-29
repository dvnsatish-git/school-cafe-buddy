import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeCard } from "@/components/BadgeCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Award, Trophy, Target } from "lucide-react";
import { Link } from "wouter";
import type { Badge, StudentBadge, Student } from "@shared/schema";

interface BadgesData {
  student: Student;
  badges: Badge[];
  earnedBadges: StudentBadge[];
}

export default function Badges() {
  const { data, isLoading } = useQuery<BadgesData>({
    queryKey: ["/api/badges"],
  });

  if (isLoading) {
    return <BadgesSkeleton />;
  }

  if (!data) {
    return (
      <div className="p-6 text-center">
        <p className="text-destructive">Something went wrong. Please try again!</p>
      </div>
    );
  }

  const earnedBadgeIds = new Set(data.earnedBadges.map(eb => eb.badgeId));
  const earnedCount = data.earnedBadges.length;
  const totalCount = data.badges.length;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon" data-testid="button-back">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">My Badges</h1>
          <p className="text-muted-foreground">Collect them all!</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="p-5 bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 border-amber-200 dark:border-amber-700">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">Badges Earned</p>
              <p className="text-3xl font-bold text-amber-900 dark:text-amber-100" data-testid="text-earned-count">
                {earnedCount}/{totalCount}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
              <Award className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Points</p>
              <p className="text-3xl font-bold text-primary" data-testid="text-total-points">
                {data.student.totalPoints}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 border-purple-200 dark:border-purple-700">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <Target className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">Next Goal</p>
              <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
                {totalCount - earnedCount > 0 ? `${totalCount - earnedCount} badges to go!` : "All complete!"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Earned Badges
          </h2>
          {earnedCount > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.badges
                .filter(badge => earnedBadgeIds.has(badge.id))
                .map(badge => (
                  <BadgeCard 
                    key={badge.id} 
                    badge={badge} 
                    isEarned={true} 
                  />
                ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                You haven't earned any badges yet. Keep making healthy choices!
              </p>
            </Card>
          )}
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-muted-foreground" />
            Badges to Unlock
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data.badges
              .filter(badge => !earnedBadgeIds.has(badge.id))
              .map(badge => (
                <BadgeCard 
                  key={badge.id} 
                  badge={badge} 
                  isEarned={false}
                  progress={data.student.totalPoints}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BadgesSkeleton() {
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    </div>
  );
}

"use client";

import StatsCard from "@/components/dashboard/stats-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useMatches } from "@/hooks/use-ai-partner";
import { useCommunities } from "@/hooks/use-communities";
import { client } from "@/lib/api-client";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { MessageCircleIcon, UsersIcon } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const user = useUser();
  const {
    data: userCommunities,
    isLoading: isLoadingUserCommunities,
    error: errorUserCommunities,
  } = useCommunities();

  const { data: allMatches } = useMatches();

  const pendingMatchesData =
    allMatches?.filter((match) => match.status === "pending") || [];
  const activeMatchesData =
    allMatches?.filter((match) => match.status === "accepted") || [];

  const { data: learningGoals } = useQuery({
    queryKey: ["communityGoals"],
    queryFn: async () => {
      const res = await client.api.communities.goals.$get();
      if (!res.ok) {
        throw new Error("Failed to fetch learning goals");
      }
      return res.json();
    },
    enabled: !!userCommunities?.length,
  });

  if (isLoadingUserCommunities) return <div>Loading...</div>;
  if (errorUserCommunities) {
    return <div>Error: {errorUserCommunities.message}</div>;
  }

  return (
    <div className="page-wrapper">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.user?.firstName || "User"}!
        </p>
      </div>

      <Card className="border-primary">
        <CardHeader>
          <CardTitle>
            You have {pendingMatchesData.length} new{" "}
            {pendingMatchesData.length === 1 ? "match" : "matches"}!
          </CardTitle>
          <CardDescription>
            Review and accept your matches to start chatting
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Link href="/chat">
            <Button>Review Matches</Button>
          </Link>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Your Communities"
          value={userCommunities?.length || 0}
        />
        <StatsCard title="Learning Goals" value={learningGoals?.length || 0} />
        <StatsCard title="Active Matches" value={activeMatchesData.length} />
        <StatsCard title="Pending Matches" value={pendingMatchesData.length} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <MessageCircleIcon className="size-4 mr-2 text-primary" />
                Recent Chats
              </CardTitle>
              <Link href="/chat">
                <Button variant="outline" size="sm">
                  <UsersIcon className="size-4 mr-2 text-primary" />
                  View All
                </Button>
              </Link>
            </div>
            <CardDescription>Conversations you&apos;re part of</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-3">
              {activeMatchesData.length ? (
                activeMatchesData.map((match) => (
                  <Link href={`/chat/${match.id}`} key={match.id}>
                    <Card className="shadow-none">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <UserAvatar
                            name={match.partner.name}
                            imageUrl={match.partner.imageUrl ?? undefined}
                            size="sm"
                          />
                          <div className="flex-1 min-w-0">
                            <CardTitle className="font-medium">
                              {match.partner.name}
                            </CardTitle>
                            <CardDescription className="text-xs text-muted-foreground mt-1">
                              {match.userGoals.map((g) => g.title).join(", ")}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No active chats yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <UsersIcon className="size-4 mr-2 text-primary" />
                Communities
              </CardTitle>
              <Link href="/communities">
                <Button variant="outline" size="sm">
                  <UsersIcon className="size-4 mr-2 text-primary" />
                  Manage
                </Button>
              </Link>
            </div>
            <CardDescription>Communities you&apos;re part of</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {userCommunities?.length ? (
                userCommunities.map((community) => (
                  <Card className="shadow-none" key={community.id}>
                    <CardHeader>
                      <CardTitle className="text-sm">
                        {community.community.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {community.community.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))
              ) : (
                <Link href="/communities/all">
                  <Button variant="outline">Browse Communities</Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

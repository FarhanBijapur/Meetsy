"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useAcceptMatch, useMatches } from "@/hooks/use-ai-partner";
import { useCurrentUser } from "@/hooks/use-users";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const {
    data: matches,
    isLoading: isLoadingMatches,
    error: errorMatches,
  } = useMatches();

  const { data: user } = useCurrentUser();
  const isPro = user?.isPro;

  const router = useRouter();

  const acceptMatchMutation = useAcceptMatch();

  if (isLoadingMatches) return <div>Loading...</div>;
  if (errorMatches) return <div>Error: {errorMatches.message}</div>;

  const acceptedMatches = matches?.filter(
    (match) => match.status === "accepted"
  );
  const pendingMatches = matches?.filter((match) => match.status === "pending");

  let pendingMatchesToShow = [];
  if (!isPro) {
    pendingMatchesToShow = pendingMatches?.slice(0, 1) || [];
  } else {
    pendingMatchesToShow = pendingMatches || [];
  }

  if (acceptMatchMutation.isError)
    return <div>Error: {acceptMatchMutation.error.message}</div>;

  return (
    <div className="page-wrapper">
      <h2 className="text-2xl font-semibold">Pending Matches</h2>

      <div className="flex gap-4 overflow-x-scroll">
        {pendingMatchesToShow?.map((match) => {
          const partner = {
            id: match.partner.id || "",
            name: match.partner.name || "Partner",
            imageUrl: match.partner.imageUrl ?? undefined,
          };
          return (
            <Card
              key={match.id}
              className="flex flex-col max-h-[500px] max-w-[350px] min-w-[350px]"
            >
              <CardHeader className="shrink-0">
                <div className="flex items-center gap-3 mb-2">
                  <UserAvatar name={partner.name} imageUrl={partner.imageUrl} />
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">
                      {partner.name}
                    </CardTitle>
                    {match.community && (
                      <p className="text-sm text-muted-foreground mt-1 truncate">
                        {match.community.name}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 space-y-2 min-h-0 overflow-hidden">
                <div className="flex-1 space-y-2 overflow-y-auto pr-1">
                  {match.partnerGoals && match.partnerGoals.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Their Learning Goals:
                      </p>
                      <div className="space-y-2">
                        {match.partnerGoals.map((g) => (
                          <Badge
                            key={g.id}
                            variant="secondary"
                            className="text-xs"
                          >
                            {g.title}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  className="w-full shrink-0 mt-2"
                  onClick={() => acceptMatchMutation.mutate(match.id)}
                  disabled={acceptMatchMutation.isPending}
                >
                  {acceptMatchMutation.isPending
                    ? "Accepting..."
                    : "Accept & Start Chatting"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <h2 className="text-2xl font-semibold">Active Chats</h2>
      <div className="flex gap-4 overflow-x-scroll flex-col">
        {acceptedMatches?.map((match) => {
          const partner = {
            id: match.partner.id || "",
            name: match.partner.name || "Partner",
            imageUrl: match.partner.imageUrl ?? undefined,
          };
          return (
            <Card
              key={match.id}
              className="flex w-full cursor-pointer hover:bg-accent transition-colors duration-200"
              onClick={() => router.push(`/chat/${match.id}`)}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <UserAvatar name={partner.name} imageUrl={partner.imageUrl} />
                <div className="flex-1">
                  <CardTitle className="text-lg truncate font-semibold">
                    {match.partner.name}
                  </CardTitle>
                  {match.community && (
                    <p className="text-sm text-muted-foreground truncate font-medium">
                      {match.community.name}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-1">
                    {match.userGoals && (
                      <span className="text-xs text-muted-foreground">
                        Your goals:{" "}
                        {match.userGoals.map((g) => g.title).join(", ")}
                      </span>
                    )}
                    {match.partnerGoals && match.partnerGoals.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        Their goals:{" "}
                        {match.partnerGoals.map((g) => g.title).join(", ")}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

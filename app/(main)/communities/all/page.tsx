"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ArrowLeftIcon, CheckIcon, LockIcon } from "lucide-react";
import Link from "next/link";
import {
  useAllCommunities,
  useCommunities,
  useJoinCommunity,
} from "@/hooks/use-communities";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-users";

export default function AllCommunitiesPage() {
  const {
    data: allCommunities,
    isLoading: isLoadingAllCommunities,
    error: errorAllCommunities,
  } = useAllCommunities();

  const { data: user } = useCurrentUser();
  const isPro = user?.isPro;

  const { data: userCommunities } = useCommunities();
  const numberOfCommunities = userCommunities?.length || 0;

  const isJoined = (communityId: string) => {
    return userCommunities?.some(
      (community) => community.community.id === communityId
    );
  };

  const showLockIcon = numberOfCommunities >= 3 && !isPro;

  const joinCommunityMutation = useJoinCommunity();

  const handleJoinCommunity = async (communityId: string) => {
    try {
      await joinCommunityMutation.mutateAsync(communityId);
      toast.success("Joined community successfully");
    } catch (error) {
      console.error("Error joining community", error);
      toast.error("Failed to join community");
    }
  };

  if (isLoadingAllCommunities) return <div>Loading...</div>;
  if (errorAllCommunities)
    return <div>Error: {errorAllCommunities.message}</div>;

  return (
    <div>
      <Link href="/communities">
        <Button variant={"outline"}>
          <ArrowLeftIcon className="size-4" />
          Back to My Communities
        </Button>
      </Link>
      <div className="space-y-4 mt-4">
        <h2 className="text-2xl font-bold"> Browse Communities</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {allCommunities?.map((community) => (
            <Card key={community.id}>
              <CardHeader>
                <CardTitle>{community.name}</CardTitle>
                <CardDescription>{community.description}</CardDescription>
                <CardFooter className="px-0 mt-2">
                  <Button
                    className="w-full"
                    disabled={
                      isJoined(community.id) ||
                      showLockIcon ||
                      joinCommunityMutation.isPending
                    }
                    onClick={() => handleJoinCommunity(community.id)}
                  >
                    {showLockIcon && (
                      <LockIcon className="size-4 text-muted-foreground" />
                    )}
                    {isJoined(community.id) ? (
                      <>
                        <CheckIcon className="size-4" /> Joined
                      </>
                    ) : joinCommunityMutation.isPending ? (
                      "Joining..."
                    ) : (
                      "Join Community"
                    )}
                  </Button>
                </CardFooter>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

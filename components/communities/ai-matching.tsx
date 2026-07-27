import { useAiPartners } from "@/hooks/use-ai-partner";
import { useQueryClient } from "@tanstack/react-query";
import { LockIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
export default function AIMatching({
  totalGoals,
  selectedCommunityId,
  showLockIcon,
}: {
  totalGoals: number;
  selectedCommunityId: string;
  showLockIcon: boolean;
}) {
  const aiPartnerMutation = useAiPartners();
  const queryClient = useQueryClient();
  const router = useRouter();
  const handleFindAIPartners = async () => {
  try {
    const result = await aiPartnerMutation.mutateAsync(selectedCommunityId);

    if ("error" in result && result.error) {
      toast.error(result.error);
      return;
    }

    if (result.matched === 0) {
      toast.info(
        "message" in result ? result.message : "No new partners found yet"
      );
      return;
    }

    queryClient.invalidateQueries({
      queryKey: ["matches", selectedCommunityId],
    });

    toast.success(`Found ${result.matched} learning partners`, {
  action: {
    label: "View Matches",
    onClick: () => router.push("/chat"),
  },
});
  } catch (error) {
    console.error(error);
    toast.error("Failed to find AI partners");
  }
};

  return (
    <div className="text-center py-8">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">AI-Powered Matching</h3>
        <p>
          Our AI will analyze your learning goals and automatically match you
          with the most compatible learning partners in this community.
        </p>
      </div>
      <Button
        size="lg"
        disabled={
          totalGoals === 0 ||
          showLockIcon ||
          !selectedCommunityId ||
          aiPartnerMutation.isPending
        }
        onClick={handleFindAIPartners}
      >
        {showLockIcon && <LockIcon className="size-4 text-muted-foreground" />}
        {aiPartnerMutation.isPending
          ? "Finding partners..."
          : "Find Partners with AI"}
      </Button>
      {totalGoals > 0 && (
        <p className="mt-4 text-sm text-muted-foreground">
          You have {totalGoals} learning goals set
        </p>
      )}
      {totalGoals === 0 && (
        <p className="mt-4 text-sm text-muted-foreground">
          Add learning goals first to enable AI matching
        </p>
      )}
    </div>
  );
}

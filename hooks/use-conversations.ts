import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/api-client";

export const useConversations = (conversationId: string) => {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const res = await client.api.conversations[
        ":conversationId"
      ].messages.$get({
        param: { conversationId },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch messages");
      }
      return res.json();
    },
    refetchInterval: 5000, // poll every 5 seconds
  });
};

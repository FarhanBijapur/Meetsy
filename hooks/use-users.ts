import { client } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await client.api.user.$get();
      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }
      return res.json();
    },
  });
};

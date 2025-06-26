import { LeadRequestBody } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";

export const useGenerateLead = () => {
  return useMutation({
    mutationFn: async (params: LeadRequestBody) => {
      const res = await fetch("/api/ai-interest", {
        method: "POST",
        body: JSON.stringify(params),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Note generation failed");
      return data.items;
    },
  });
};

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

// import { useMutation } from "@tanstack/react-query";

// export const useGenerateLead = () => {
//   return useMutation({
//     mutationFn: async (prompt: string) => {
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       const response = await (window as any).puter.ai.chat(prompt, {
//         model: "gpt-4.1",
//       });

//       console.log({ response });
//       const content = response?.message?.content;
//       const jsonMatch =
//         typeof content === "string"
//           ? content.match(/\[\s*{[\s\S]*?}\s*\]/)
//           : null;

//       if (!jsonMatch) return [];

//       const jsonText = jsonMatch[0];
//       try {
//         const items = JSON.parse(jsonText);
//         return items ?? [];
//       } catch {
//         return [];
//       }
//     },
//   });
// };

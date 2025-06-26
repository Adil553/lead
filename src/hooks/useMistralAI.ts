import { NoteRequestBody } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";

export const useGenerateNote = () => {
  return useMutation({
    mutationFn: async (params: NoteRequestBody) => {
      const res = await fetch("/api/ask-mistral", {
        method: "POST",
        body: JSON.stringify(params),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Note generation failed");
      return data.note;
    },
  });
};

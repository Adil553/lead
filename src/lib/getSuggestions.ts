// lib/getSuggestions.ts
export async function getSuggestions({
  interest,
  location,
}: {
  interest: string | null;
  location: { longitude: number | null; latitude: number | null } | null;
}) {
  const res = await fetch("/api/ai-interest", {
    method: "POST",
    body: JSON.stringify({ interest, location }),
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  return data.items || []; // expected: [{name, description, image, price}]
}

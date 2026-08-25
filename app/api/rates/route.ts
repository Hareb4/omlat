import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const key = (
    process.env.FXRATES_API_KEY ||
    process.env.NEXT_PUBLIC_FXRATES_API_KEY ||
    ""
  )
    .trim()
    .replace(/^["']|["']$/g, "");

  const url = new URL("https://api.fxratesapi.com/latest");
  url.searchParams.set("base", "USD");

  const headers = new Headers();
  if (key) {
    headers.set("Authorization", `Bearer ${key}`);
    url.searchParams.set("api_key", key);
  }

  const response = await fetch(url, { headers, cache: "no-store" });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (data as { message?: string; error?: { message?: string } })?.error
        ?.message ||
      (data as { message?: string }).message ||
      "Failed to fetch currency data";
    return NextResponse.json({ error: message }, { status: response.status });
  }

  return NextResponse.json(data);
}

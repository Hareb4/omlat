import { NextResponse } from "next/server";

const ALLOWED_HOSTS = new Set(["images.unsplash.com"]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (parsed.protocol !== "https:" || !ALLOWED_HOSTS.has(parsed.hostname)) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 400 });
  }

  const response = await fetch(parsed.toString(), {
    headers: { Accept: "image/*" },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: `Upstream ${response.status}` },
      { status: 502 }
    );
  }

  const contentType = response.headers.get("Content-Type") || "image/jpeg";
  const buffer = await response.arrayBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400",
    },
  });
}

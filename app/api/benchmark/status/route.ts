import { NextResponse } from "next/server";
import { getOpenRouterApiKey } from "../getOpenRouterApiKey";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ hasKey: Boolean(getOpenRouterApiKey()) });
}

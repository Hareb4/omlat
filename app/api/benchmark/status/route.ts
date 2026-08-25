import { NextResponse } from "next/server";
import { getEnvOpenRouterApiKey } from "../getOpenRouterApiKey";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ hasKey: Boolean(getEnvOpenRouterApiKey()) });
}

"use client";

import type { ReactNode } from "react";
import { Battery, Signal, Wifi } from "lucide-react";

interface PostAdMockupProps {
  children: ReactNode;
}

export function PostAdMockup({ children }: PostAdMockupProps) {
  return (
    <div className="mx-auto w-[min(100%,390px)] shrink-0">
      <div className="relative overflow-hidden rounded-[2.6rem] border-[8px] border-gray-700 bg-gray-950 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
        <div className="flex h-11 items-center justify-between px-6 text-[11px] text-gray-200">
          <span className="font-medium tabular-nums">9:41</span>
          <div className="absolute left-1/2 top-2 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
          <div className="flex items-center gap-1">
            <Signal className="size-3.5" />
            <Wifi className="size-3.5" />
            <Battery className="size-3.5" />
          </div>
        </div>

        <div className="flex h-[760px] flex-col bg-gray-950">
          <div className="flex items-center justify-between px-5 pb-3">
            <p className="text-sm text-gray-400">Cancel</p>
            <p className="text-sm font-semibold text-gray-100">Post Ad</p>
            <p className="text-sm text-violet-400">Next</p>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">{children}</div>
          <div className="flex justify-center py-2">
            <div className="h-1.5 w-28 rounded-full bg-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
}

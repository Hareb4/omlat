import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "AI Vision Benchmark — Omlat",
  description:
    "Phone simulation and race-mode comparison for marketplace product vision models (cars, phones, laptops).",
};

export default function BenchmarkLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return children;
}

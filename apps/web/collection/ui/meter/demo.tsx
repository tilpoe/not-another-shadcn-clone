"use client";

import { Meter } from "@/collection/ui/meter";

export default function Demo() {
  return <Meter className="w-[350px]" label="Storage Space" value={60} />;
}

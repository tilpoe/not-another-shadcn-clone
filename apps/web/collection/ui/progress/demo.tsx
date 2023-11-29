"use client";

import { useEffect, useState } from "react";

import { Progress } from "@/collection/ui/progress";

export default function Demo() {
  const [progress, setProgress] = useState(13);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Progress className="w-[350px]" label="Loading ..." value={progress} />
  );
}

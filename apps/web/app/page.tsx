"use client";

import type { Route } from "next";

import { redirect } from "@/lib/navigation/utils";

export default function Page() {
  redirect("/docs" as Route);
}

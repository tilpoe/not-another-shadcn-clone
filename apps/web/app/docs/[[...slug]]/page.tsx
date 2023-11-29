import Link from "next/link";
import { notFound } from "next/navigation";
import { allDocs } from "contentlayer/generated";
import { ChevronRightIcon } from "lucide-react";
import { Balancer } from "react-wrap-balancer";

import { Alert, AlertDescription, AlertTitle } from "@/collection/ui/alert";
import { badgeVariants } from "@/collection/ui/badge";
import { Mdx } from "@/components/mdx-components";
import { cn } from "@/lib/utils";

interface DocPageProps {
  params: {
    slug: string[];
  };
}

async function getDocFromParams({ params }: DocPageProps) {
  const slug = params.slug?.join("/") || "";
  return allDocs.find((doc) => doc.slugAsParams === slug) ?? null;
}

export default async function Page({ params }: DocPageProps) {
  const doc = await getDocFromParams({ params });

  if (!doc) {
    notFound();
  }

  return (
    <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            Docs
          </div>
          <ChevronRightIcon className="h-4 w-4" />
          <div className="font-medium text-foreground">{doc.title}</div>
        </div>
        <div className="space-y-2">
          <h1 className={cn("scroll-m-20 text-4xl font-bold tracking-tight")}>
            {doc.title}
          </h1>
          {doc.description && (
            <p className="text-lg text-muted-foreground">
              <Balancer>{doc.description}</Balancer>
            </p>
          )}
        </div>
        {doc.api && (
          <div className="flex items-center space-x-2 pt-4">
            <Link
              href={doc.api}
              target="_blank"
              rel="noreferrer"
              className={cn(badgeVariants({ intent: "secondary" }))}
            >
              Reference
            </Link>
          </div>
        )}
        {doc.form && (
          <Alert className="my-8" type="warning">
            <AlertTitle>This is a form component.</AlertTitle>
            <AlertDescription>
              Make sure you installed the{" "}
              <Link
                href="/docs/components/ui/form"
                className="font-semibold underline"
              >
                Form Base Components.
              </Link>{" "}
              and the{" "}
              <Link
                href="/docs/library/form"
                className="font-semibold underline"
              >
                Form Library.
              </Link>
            </AlertDescription>
          </Alert>
        )}
        <div className="pb-12 pt-6">
          <Mdx code={doc.body.code} />
        </div>
      </div>
    </main>
  );
}

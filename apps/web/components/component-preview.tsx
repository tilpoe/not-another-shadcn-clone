/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/collection/ui/tabs";
import { CopyButton, CopyWithClassNames } from "@/components/copy-button";
import { cn } from "@/lib/utils";

interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  extractClassname?: boolean;
  extractedClassNames?: string;
  align?: "center" | "start" | "end";
}

export function ComponentPreview({
  name,
  children,
  className,
  extractedClassNames,
  align = "center",
  ...props
}: ComponentPreviewProps) {
  const Codes = React.Children.toArray(children) as React.ReactElement[];
  const Code = Codes[0];

  const Preview = React.useMemo(() => {
    console.log(name);
    const Component = React.lazy(() => import(`@/collection/${name}`));

    if (!Component) {
      return (
        <p className="text-sm text-muted-foreground">
          Component{" "}
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            {name}
          </code>{" "}
          not found.
        </p>
      );
    }

    return <Component />;
  }, [name]);

  const codeString = React.useMemo(() => {
    if (
      typeof Code?.props["data-rehype-pretty-code-fragment"] !== "undefined"
    ) {
      const [, Button] = React.Children.toArray(
        Code.props.children,
      ) as React.ReactElement[];
      return Button?.props?.value || Button?.props?.__rawString__ || null;
    }
  }, [Code]);

  return (
    <div
      className={cn("group relative mt-4 flex flex-col space-y-2", className)}
      {...props}
    >
      <Tabs defaultValue="preview" className="relative mr-auto w-full">
        <TabsList className="flex h-full w-full justify-start gap-2 rounded-md bg-transparent py-2">
          <TabsTrigger
            value="preview"
            className={cn(
              "relative h-9 bg-transparent p-4 font-semibold text-muted-foreground shadow-none transition-all transition-none before:transition-all data-[state=active]:text-primary-foreground data-[state=active]:shadow-none",
              "before:absolute before:inset-0 before:bottom-0 before:hidden before:h-full before:rounded-full before:bg-primary before:content-[''] data-[state=active]:before:block",
              "data-[state=inactive]:hover:before:block data-[state=inactive]:hover:before:border data-[state=inactive]:hover:before:bg-transparent",
            )}
          >
            <span className="z-20">Preview</span>
          </TabsTrigger>
          <TabsTrigger
            value="code"
            className={cn(
              "relative h-9 rounded-none border-b-transparent bg-transparent p-4 font-semibold text-muted-foreground shadow-none transition-all transition-none before:transition-all data-[state=active]:text-primary-foreground data-[state=active]:shadow-none",
              "before:absolute before:inset-0 before:bottom-0 before:hidden before:h-full before:rounded-full before:bg-primary before:content-[''] data-[state=active]:before:block",
              "data-[state=inactive]:hover:before:block data-[state=inactive]:hover:before:border data-[state=inactive]:hover:before:bg-transparent",
            )}
          >
            <span className="z-20">Code</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="relative rounded-md border">
          <div className="flex items-center justify-between p-4">
            {extractedClassNames ? (
              <CopyWithClassNames
                value={codeString}
                classNames={extractedClassNames}
              />
            ) : (
              codeString && <CopyButton value={codeString} />
            )}
          </div>
          <div
            className={cn(
              "preview flex min-h-[350px] w-full justify-center p-10",
              {
                "items-center": align === "center",
                "items-start": align === "start",
                "items-end": align === "end",
              },
            )}
          >
            <React.Suspense
              fallback={
                <div className="flex items-center text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </div>
              }
            >
              {Preview}
            </React.Suspense>
          </div>
        </TabsContent>
        <TabsContent value="code">
          <div className="flex flex-col space-y-4">
            <div className="w-full rounded-md [&_pre]:my-0 [&_pre]:max-h-[350px] [&_pre]:overflow-auto">
              {Code}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

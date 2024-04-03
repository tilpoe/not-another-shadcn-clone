/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { Tab, TabList, TabPanel, Tabs } from "@/collection/ui/tabs";
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
      <Tabs defaultSelectedKey="preview" className="relative mr-auto w-full">
        <TabList className="flex h-full w-full justify-start gap-2 rounded-md bg-transparent py-2">
          <Tab id="preview">
            <span className="z-20">Preview</span>
          </Tab>
          <Tab id="code">
            <span className="z-20">Code</span>
          </Tab>
        </TabList>
        <TabPanel id="preview" className="relative rounded-md border">
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
        </TabPanel>
        <TabPanel id="code">
          <div className="flex flex-col space-y-4">
            <div className="w-full rounded-md [&_pre]:my-0 [&_pre]:max-h-[350px] [&_pre]:overflow-auto">
              {Code}
            </div>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}

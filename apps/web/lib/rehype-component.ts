import fs from "fs";
import path from "path";
import { u } from "unist-builder";
import { visit } from "unist-util-visit";

export interface Point {
  line: number;
  column: number;
  offset?: number | undefined;
}

export interface Node<TData extends object = Record<string, unknown>> {
  type: string;
  data?: TData | undefined;
  position?:
    | {
        start: Point;
        end: Point;
        indent?: number[] | undefined;
      }
    | undefined;
}

export interface UnistNode extends Node {
  type: string;
  name?: string;
  tagName?: string;
  value?: string;
  properties?: {
    __rawString__?: string;
    __className__?: string;
    __event__?: string;
    [key: string]: unknown;
  } & NpmCommands;
  attributes?: {
    name: string;
    type?: string;
    value?: unknown;
  }[];
  children?: UnistNode[];
  __rawString__?: string;
  __src__?: unknown;
}

export interface UnistTree extends Node {
  children: UnistNode[];
}

export interface NpmCommands {
  __npmCommand__?: string;
  __yarnCommand__?: string;
  __pnpmCommand__?: string;
  __bunCommand__?: string;
}

function getNodeAttributeByName(node: UnistNode, name: string) {
  return node.attributes?.find((attribute) => attribute.name === name);
}

/* function getComponentSourceFileContent(node: UnistNode) {
  const src = getNodeAttributeByName(node, "src")?.value as string;

  if (!src) {
    return null;
  }

  // Read the source file.
  const filePath = path.join(process.cwd(), src);
  const source = fs.readFileSync(filePath, "utf8");

  return source;
} */

export function rehypeComponent() {
  return async (tree: UnistTree) => {
    visit(tree, (node: UnistNode) => {
      const { value: srcPath } =
        (getNodeAttributeByName(node, "src") as {
          name: string;
          value?: string;
          type?: string;
        }) || {};

      if (node.name === "ComponentPreview") {
        const name = getNodeAttributeByName(node, "name")?.value as string;
        const type = getNodeAttributeByName(node, "type")?.value as
          | string
          | undefined;

        if (!name) {
          return null;
        }

        try {
          const srcDir = type ?? "collection";
          const src = `${srcDir}/${name}`;

          // Read the source file.
          const filePath = path.join(process.cwd(), src);
          let source = fs.readFileSync(filePath, "utf8");

          source = source.replaceAll(`@/collection/utils/`, "@/collection/");
          source = source.replaceAll(`@/collection/`, "@/components/");

          // Add code as children so that rehype can take over at build time.
          node.children?.push(
            u("element", {
              tagName: "pre",
              properties: {
                __src__: src,
              },
              children: [
                u("element", {
                  tagName: "code",
                  properties: {
                    className: ["language-tsx"],
                  },
                  children: [
                    {
                      type: "text",
                      value: source,
                    },
                  ],
                }),
              ],
            }),
          );
        } catch (error) {
          console.error(error);
        }
      }

      if (node.name === "ComponentSource") {
        const name = getNodeAttributeByName(node, "name")?.value as string;
        const type = getNodeAttributeByName(node, "type")?.value as
          | string
          | undefined;

        if (!name && !srcPath) {
          return null;
        }

        try {
          let src: string;
          if (srcPath) {
            src = srcPath;
          } else {
            const srcDir = type ?? "collection";
            src = `${srcDir}/${name}`;
          }

          // Read the source file.
          const filePath = path.join(process.cwd(), src);
          let source = fs.readFileSync(filePath, "utf8");

          source = source.replaceAll(`@/collection/utils/`, "@/collection/");
          source = source.replaceAll(`@/collection/`, "@/components/");

          // Add code as children so that rehype can take over at build time.
          node.children?.push(
            u("element", {
              tagName: "pre",
              properties: {
                __src__: src,
              },
              attributes: [
                {
                  name: "styleName",
                  type: "mdxJsxAttribute",
                },
              ],
              children: [
                u("element", {
                  tagName: "code",
                  properties: {
                    className: ["language-tsx"],
                  },
                  children: [
                    {
                      type: "text",
                      value: source,
                    },
                  ],
                }),
              ],
            }),
          );
        } catch (error) {
          console.error(error);
        }
      }
    });
  };
}

import type { ComputedFields } from "contentlayer/source-files";
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import type { LineElement } from "rehype-pretty-code";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { codeImport } from "remark-code-import";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";

import type { UnistNode, UnistTree } from "./lib/rehype-component";
import { rehypeComponent } from "./lib/rehype-component";

const computedFields: ComputedFields = {
  slug: {
    type: "string",
    resolve: (doc) => `/${doc._raw.flattenedPath}`,
  },
  slugAsParams: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
  },
};

export const Doc = defineDocumentType(() => ({
  name: "Doc",
  filePathPattern: `docs/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
      required: false,
    },
    api: {
      type: "string",
      required: false,
    },
    form: {
      type: "boolean",
      required: false,
    },
    toc: {
      type: "boolean",
      default: true,
      required: false,
    },
  },
  computedFields,
}));

export default makeSource({
  contentDirPath: "./content",
  documentTypes: [Doc],
  mdx: {
    remarkPlugins: [remarkGfm, codeImport],
    rehypePlugins: [
      rehypeSlug,
      rehypeComponent,
      () => (tree: UnistTree) => {
        visit(tree, (node: UnistNode) => {
          if (node?.type === "element" && node?.tagName === "pre") {
            if (!node.children) {
              return;
            }

            const [codeEl] = node.children as [UnistNode];
            if (codeEl.tagName !== "code") {
              return;
            }

            node.__rawString__ = codeEl.children?.[0]?.value;
            node.__src__ = node.properties?.__src__;
          }
        });
      },
      [
        rehypePrettyCode,
        {
          onVisitLine: (node: LineElement) => {
            // Prevent lines from collapsing in `display: grid` mode, and allow empty
            // lines to be copy/pasted
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: " " }];
            }
          },
          onVisitHighlightedLine: (node: LineElement) => {
            node.properties.className ??= [];
            node.properties.className.push("line--highlighted");
          },
          onVisitHighlightedWord: (node: LineElement) => {
            node.properties.className = ["word--highlighted"];
          },
        },
      ],
      () => (tree: UnistTree) => {
        visit(tree, (node: UnistNode) => {
          if (node?.type === "element" && node?.tagName === "div") {
            if (
              !node.properties ||
              !("data-rehype-pretty-code-fragment" in node.properties) ||
              !node.children
            ) {
              return;
            }

            const preElement = node.children.at(-1);

            if (!preElement) {
              return;
            }

            if (preElement.tagName !== "pre") {
              return;
            }

            if (!preElement.properties) {
              preElement.properties = {};
            }

            preElement.properties.__withMeta__ =
              node.children.at(0)!.tagName === "div";
            preElement.properties.__rawString__ = node.__rawString__;

            if (node.__src__) {
              preElement.properties.__src__ = node.__src__;
            }
          }
        });
      },
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["subheading-anchor"],
            ariaLabel: "Link to section",
          },
        },
      ],
    ],
  },
});

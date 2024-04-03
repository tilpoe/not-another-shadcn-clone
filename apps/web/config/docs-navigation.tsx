import { Badge } from "@/collection/ui/badge";

interface NavItem {
  title: React.ReactNode;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: React.ReactNode;
  label?: string;
}

interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export type DocsNavItems = NavItemWithChildren[];

const FormComponent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="group relative flex h-[20px] items-center gap-2">
      <span className="group-hover:underline">{children}</span>
      <Badge size="xs" variant="invert" className="h-[20px]" intent="success">
        Form
      </Badge>
    </div>
  );
};

const Obligatory = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="group relative flex h-[20px] items-center gap-2">
      <span className="group-hover:underline">{children}</span>
      <Badge
        size="xs"
        variant="invert"
        className="h-[20px]"
        intent="destructive"
      >
        Obligatory
      </Badge>
    </div>
  );
};

export const docsNavigationConfig: DocsNavItems = [
  {
    title: "Getting Started",
    items: [
      {
        title: "First things first",
        href: "/docs",
        items: [],
      },
    ],
  },
  {
    title: "Libraries",
    items: [
      {
        title: "Better Next Actions",
        href: "/docs/libraries/better-next-actions",
        items: [],
      },
      {
        title: "Data Table",
        href: "/docs/libraries/data-table",
        items: [],
      },
      {
        title: "Dialog Helpers",
        href: "/docs/libraries/dialog-helpers",
        items: [],
      },
      {
        title: "E-Mail",
        href: "/docs/libraries/email",
        items: [],
      },
      {
        title: <Obligatory>Form</Obligatory>,
        href: "/docs/libraries/form",
        items: [],
      },
      {
        title: "Next.js Typed Routes",
        href: "/docs/libraries/next-typed-routes",
        items: [],
      },
      {
        title: "PDF",
        href: "/docs/libraries/pdf",
        items: [],
      },
      {
        title: "Stream Response",
        href: "/docs/libraries/stream-response",
        items: [],
      },
      {
        title: "Toast",
        href: "/docs/libraries/toast",
        items: [],
      },
      {
        title: "TS Pattern Matchers",
        href: "/docs/libraries/ts-pattern-matchers",
        items: [],
      },
      {
        title: "Types",
        href: "/docs/libraries/types",
        items: [],
      },
      {
        title: <Obligatory>Utils</Obligatory>,
        href: "/docs/libraries/utils",
        items: [],
      },
      {
        title: "Zod Helpers",
        href: "/docs/libraries/zod",
        items: [],
      },
    ],
  },
  {
    title: "UI Components",
    items: [
      {
        title: "Button",
        href: "/docs/components/ui/button",
        items: [],
      },
      {
        title: "Card",
        href: "/docs/components/ui/card",
        items: [],
      },
      {
        title: <FormComponent>Checkbox</FormComponent>,
        href: "/docs/components/ui/checkbox",
        items: [],
      },
      {
        title: <FormComponent>Combo Box</FormComponent>,
        href: "/docs/components/ui/combo-box",
        items: [],
      },
      {
        title: "Dialog",
        href: "/docs/components/ui/dialog",
        items: [],
      },
      {
        title: "Link",
        href: "/docs/components/ui/link",
        items: [],
      },
      {
        title: "ListBox",
        href: "/docs/components/ui/list-box",
        items: [],
      },
      {
        title: "Menu",
        href: "/docs/components/ui/menu",
        items: [],
      },
      {
        title: <FormComponent>Number Field</FormComponent>,
        href: "/docs/components/ui/number-field",
        items: [],
      },
      {
        title: "Page Utils",
        href: "/docs/components/ui/page",
        items: [],
      },
      {
        title: "Popover",
        href: "/docs/components/ui/popover",
        items: [],
      },
      {
        title: <FormComponent>Radio Group</FormComponent>,
        href: "/docs/components/ui/radio-group",
        items: [],
      },
      {
        title: <FormComponent>Search Field</FormComponent>,
        href: "/docs/components/ui/search-field",
        items: [],
      },
      {
        title: <FormComponent>Select</FormComponent>,
        href: "/docs/components/ui/select",
        items: [],
      },
      {
        title: "Separator",
        href: "/docs/components/ui/separator",
        items: [],
      },
      {
        title: <FormComponent>Switch</FormComponent>,
        href: "/docs/components/ui/switch",
        items: [],
      },
      {
        title: "Tabs",
        href: "/docs/components/ui/tabs",
        items: [],
      },
      {
        title: <FormComponent>Text Field</FormComponent>,
        href: "/docs/components/ui/text-field",
        items: [],
      },
      /*       {
        title: "Accordion",
        href: "/docs/components/ui/accordion",
        items: [],
      },
      {
        title: "Alert",
        href: "/docs/components/ui/alert",
        items: [],
      },
      {
        title: "Aspect Ratio",
        href: "/docs/components/ui/aspect-ratio",
        items: [],
      },
      {
        title: "Avatar",
        href: "/docs/components/ui/avatar",
        items: [],
      },
      {
        title: "Badge",
        href: "/docs/components/ui/badge",
        items: [],
      },
      {
        title: "Bar Indicator",
        href: "/docs/components/ui/bar-indicator",
        items: [],
      },
      {
        title: "Collapsible",
        href: "/docs/components/ui/collapsible",
        items: [],
      },
      {
        title: "Command",
        href: "/docs/components/ui/command",
        items: [],
      },
      {
        title: "Container",
        href: "/docs/components/ui/container",
        items: [],
      },
      {
        title: "Loader",
        href: "/docs/components/ui/loader",
        items: [],
      },
      {
        title: "Meter",
        href: "/docs/components/ui/meter",
        items: [],
      },

      {
        title: "Progress",
        href: "/docs/components/ui/progress",
        items: [],
      },
      {
        title: "Scroll Area",
        href: "/docs/components/ui/scroll-area",
        items: [],
      },

      {
        title: "Sheet",
        href: "/docs/components/ui/sheet",
        items: [],
      },
      {
        title: "Skeleton",
        href: "/docs/components/ui/skeleton",
        items: [],
      },
      {
        title: <FormComponent>Slider</FormComponent>,
        href: "/docs/components/ui/slider",
        items: [],
      },
      {
        title: "Table",
        href: "/docs/components/ui/table",
        items: [],
      },
      {
        title: "Typography",
        href: "/docs/components/ui/typography",
        items: [],
      }, */
    ],
  },
];

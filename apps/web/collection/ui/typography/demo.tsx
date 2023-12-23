import { Separator } from "@/collection/ui/separator";
import { Typography } from "@/collection/ui/typography";

export default function Demo() {
  return (
    <div className="w-full">
      <Typography type="h1">This is a h1 heading.</Typography>
      <Separator className="my-4" />
      <Typography type="h2" className="border-b-0">
        This is a h2 heading.
      </Typography>
      <Separator className="my-4" />
      <Typography type="h3">This is a h3 heading.</Typography>
      <Separator className="my-4" />
      <Typography type="h4">This is a h4 heading.</Typography>
      <Separator className="my-4" />
      <Typography type="p">This is a paragraph.</Typography>
      <Separator className="my-4" />
      <Typography type="blockquote">This is a blockquote.</Typography>
      <Separator className="my-4" />
      <Typography type="list">
        <li>This is a list item.</li>
        <li>This is a list item.</li>
        <li>This is a list item.</li>
      </Typography>
      <Separator className="my-4" />
      <Typography type="code">This is a code line.</Typography>
      <Separator className="my-4" />
      <Typography type="lead">This is a lead.</Typography>
      <Separator className="my-4" />
      <Typography type="large">This is a large.</Typography>
      <Separator className="my-4" />
      <Typography type="small">This is a small.</Typography>
      <Separator className="my-4" />
      <Typography type="muted">This is a muted.</Typography>
    </div>
  );
}

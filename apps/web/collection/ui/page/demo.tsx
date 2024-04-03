import { Button } from "@/collection/ui/button";
import {
  PageBar,
  PageBarLeft,
  PageBarRight,
  PageTitle,
} from "@/collection/ui/page";

export default function Demo() {
  return (
    <PageBar>
      <PageBarLeft>
        <PageTitle>Accounts</PageTitle>
      </PageBarLeft>
      <PageBarRight>
        <Button>Export</Button>
      </PageBarRight>
    </PageBar>
  );
}

import { Checkbox } from "@/collection/ui/checkbox";
import { Cell, Column, Row, Table, TBody, THead } from "@/collection/ui/table";

export default function Demo() {
  return (
    <div className="w-full max-w-[600px]">
      <Table ariaLabel="Table" selectionMode="multiple">
        <THead>
          <Column />
          <Column isRowHeader>Col 1</Column>
          <Column>Col 2</Column>
          <Column>Col 3</Column>
        </THead>
        <TBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <Row key={i}>
              <Cell>
                <Checkbox slot="selection" />
              </Cell>
              <Cell>test</Cell>
              <Cell>File folder</Cell>
              <Cell>4/7/2021</Cell>
            </Row>
          ))}
        </TBody>
      </Table>
    </div>
  );
}

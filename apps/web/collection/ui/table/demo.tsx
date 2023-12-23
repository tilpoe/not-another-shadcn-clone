import { Checkbox } from "@/collection/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHead,
  TableRow,
} from "@/collection/ui/table";

export default function Demo() {
  return (
    <div className="w-full max-w-[600px]">
      <Table ariaLabel="Table" selectionMode="multiple">
        <TableHead>
          <TableColumn />
          <TableColumn isRowHeader>Col 1</TableColumn>
          <TableColumn>Col 2</TableColumn>
          <TableColumn>Col 3</TableColumn>
        </TableHead>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Checkbox slot="selection" />
              </TableCell>
              <TableCell>test</TableCell>
              <TableCell>File folder</TableCell>
              <TableCell>4/7/2021</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

import { Model } from "@jimmodel/shared";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../ui/table";
function ExperienceTable({
    experiences,
  }: {
    experiences: Model["experiences"];
  }) {
    return (
      <Table className="p-0">
        <TableHeader>
          <TableRow>
            <TableHead className="text-black h-10">Year</TableHead>
            <TableHead className="text-black h-10">Product</TableHead>
            <TableHead className="text-black h-10">Media</TableHead>
            <TableHead className="text-black h-10">Country</TableHead>
            <TableHead className="text-black h-10">Details</TableHead>
          </TableRow>
        </TableHeader>
       <TableBody>
          {experiences?.map((experience) => (
            <TableRow key={experience.id}>
              <TableCell>{experience.year}</TableCell>
              <TableCell>{experience.product}</TableCell>
              <TableCell>{experience.media}</TableCell>
              <TableCell>{experience.country}</TableCell>
              <TableCell>{experience.details}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }


  export default ExperienceTable;
  
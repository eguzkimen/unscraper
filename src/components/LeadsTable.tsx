import { Lead } from "@/types/models"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"

interface Props {
  leads: Lead[]
}

export function LeadsTable({ leads }: Props) {
  return (
    <TableContainer>
      <Table size='small' aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leads?.map((lead) => (
            <TableRow key={lead.email}>
              <TableCell>{lead.email}</TableCell>
              <TableCell>{lead.firstName}</TableCell>
              <TableCell>{lead.lastName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
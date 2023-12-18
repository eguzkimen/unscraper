import { SignupResult } from "@/scrape/signupInSkillMap"
import { Lead } from "@/types/models"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"

interface Props {
  leads: Lead[]
  /** matched to leads by index */
  results: SignupResult[] | null | undefined
}

export function LeadsTable({ leads, results }: Props) {
  console.log(results)
  return (
    <TableContainer>
      <Table size='small' aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leads?.map((lead, index) => (
            <TableRow key={lead.email}>
              <TableCell>{lead.email}</TableCell>
              <TableCell>{lead.firstName}</TableCell>
              <TableCell>{lead.lastName}</TableCell>
              <TableCell>{results?.[index]?.success ? 'SIGNED UP SUCCESSFULLY!' : 'FAILED TO SIGN UP: ' + results?.[index]?.message}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
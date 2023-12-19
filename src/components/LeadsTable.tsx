import { Lead, SignupResult } from '@/types/models'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

interface Props {
  leads: Lead[] | null | undefined
  results: Record<string, SignupResult>
}

export function LeadsTable({ leads, results }: Props) {

  function getStatusText (lead: Lead) {
    const result = results[lead.email]

    if (!result) return '...'
    if (result.success) return 'SUCCESS: ' + result.message

    return 'FAILED: ' + result.message
  }

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
          {leads?.map((lead) => (
            <TableRow key={lead.email}>
              <TableCell>{lead.email}</TableCell>
              <TableCell>{lead.firstName}</TableCell>
              <TableCell>{lead.lastName}</TableCell>
              <TableCell>{getStatusText(lead)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
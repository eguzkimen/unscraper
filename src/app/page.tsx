'use client';

import { Lead, LeadSchema } from '@/types/models';
import { downloadStringAsFile } from '@/util/downloadStringAsFile';
import { parseLeadsFromCSVFileInput } from '@/util/parseLeadsFromCsvFileInput';
import { Typography, Button, Box, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { parse } from 'csv-parse/sync';
import { ChangeEvent, useState } from 'react';

export default function Home() {
  const [validLeads, setValidLeads] = useState<Lead[] | null>(null)
  const [invalidLeads, setInvalidLeads] = useState<unknown[] | null>(null)

  async function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { validLeads, invalidLeads } = await parseLeadsFromCSVFileInput(event)

    setValidLeads(validLeads)
    setInvalidLeads(invalidLeads)
  }

  return (
    <Box padding={6} display='flex' flexDirection='column' gap={1}>
      <Typography variant='h4'>
        Lets sign up some leads in skillmap
      </Typography>
      <Typography variant='body1'>
        Upload your leads in .csv format below 👇
      </Typography>
      <Box display='flex' gap={1} paddingTop={2}>
        <Button
          variant="contained"
          component="label"
        >
          Upload CSV
          <input
            type="file"
            accept=".csv"
            onChange={handleFileInputChange}
            hidden
          />
        </Button>
        <Button
          variant="outlined"
          onClick={() => downloadStringAsFile('email,firstName,lastName\ntest-jane-doe@gmail.com,Jane,Doe', 'lead-data-template.csv')}
        >
          Download CSV Template

        </Button>
      </Box>
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
            {validLeads?.map((lead) => (
              <TableRow key={lead.email}>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.firstName}</TableCell>
                <TableCell>{lead.lastName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

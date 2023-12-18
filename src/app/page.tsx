'use client';

import { Lead, LeadSchema } from '@/types/models';
import { downloadStringAsFile } from '@/util/downloadStringAsFile';
import { Typography, Button, Box, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { parse } from 'csv-parse/sync';
import { ChangeEvent, useState } from 'react';

export default function Home() {
  const [leads, setLeads] = useState<Lead[] | null>(null)
  const [invalidLeadsCount, setInvalidLeadsCount] = useState<number | null>(null)

  function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) return 'No files found'

    const reader = new FileReader()

    reader.onload = async (e: ProgressEvent<FileReader>) => {
      const text = e.target?.result as string;
      const data = parse(text, { columns: true }) as unknown[];

      const validLeads: Lead[] = []
      let invalidCount: number = 0;

      data.forEach((lead) => {
        const parsed = LeadSchema.safeParse(lead);

        if (!parsed.success) {
          invalidCount += 1
          return;
        }

        validLeads.push(parsed.data)
      })

      setLeads(validLeads)
      setInvalidLeadsCount(invalidLeadsCount)
    };

    reader.readAsText(file);
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
    </Box>
  )
}

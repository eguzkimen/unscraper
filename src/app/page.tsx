'use client';

import { LeadsTable } from '@/components/LeadsTable';
import { Lead } from '@/types/models';
import { downloadStringAsFile } from '@/util/downloadStringAsFile';
import { CsvParseOutput, parseLeadsFromCSVFileInput } from '@/util/parseLeadsFromCsvFileInput';
import { Typography, Button, Box, Paper } from '@mui/material';
import { ChangeEvent, useState } from 'react';

export default function Home() {
  const [csvOutput, setCsvOputput] = useState<CsvParseOutput | null>(null)

  async function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    const output = await parseLeadsFromCSVFileInput(event)

    setCsvOputput(output)
  }

  return (
    <Box height='100vh' padding={6} boxSizing='border-box' display='flex' flexDirection='column' gap={4}>
      <Box >
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
      </Box>

      {csvOutput && (
        <>
          <Box flex={1} >
            <Typography color='GrayText'>
            </Typography>
            {csvOutput.validLeads && <LeadsTable leads={csvOutput.validLeads} />}
          </Box>

          <Box display='flex' justifyContent='flex-end' alignItems='center' gap={2} borderTop='1px solid lightgray' paddingTop={2}>
            <Typography color='GrayText'>{csvOutput.invalidLeads?.length} invalid leads were found</Typography>
            <Button variant='contained'>Register {csvOutput.validLeads?.length} valid leads in skillmap</Button>
          </Box>
        </>
      )}
    </Box>
  )
}

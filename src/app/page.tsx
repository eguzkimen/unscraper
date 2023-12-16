'use client';

import { downloadStringAsFile } from '@/util/downloadStringAsFile';
import { Typography, Button, Box } from '@mui/material';
import { parse } from 'csv-parse/sync';
import { ChangeEvent } from 'react';

export default function Home() {
  function handleFileInputChange (event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) return 'No files found'

    const reader = new FileReader()

    reader.onload = async (e: ProgressEvent<FileReader>) => {
      const text = e.target?.result as string;
      console.log(text)
      let parsedData = parse(text, { columns: true });
      console.log(parsedData);
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
    </Box>
  )
}

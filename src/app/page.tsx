'use client'

import { LeadsTable } from '@/components/LeadsTable'
import { Lead, SignupResult } from '@/types/models'
import { downloadStringAsFile } from '@/util/downloadStringAsFile'
import { CsvParseOutput, parseLeadsFromCSVFileInput } from '@/util/parseLeadsFromCsvFileInput'
import { LoadingButton } from '@mui/lab'
import { Typography, Button, Box } from '@mui/material'
import { ChangeEvent, useState } from 'react'

const REAL_SIGNUP_URL = '/api/signup-in-skillmap'
const TEST_SIGNUP_URL = '/api/fake-signup'
const DELETE_ACCOUNT_URL = '/api/delete-skillmap-account'

async function post(url: string, body: string) {
  const result = await fetch(url, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return result.json()
}

async function signupLead(lead: Lead, opts?: { useTestUrl: boolean }) {
  const url = opts?.useTestUrl ? TEST_SIGNUP_URL : REAL_SIGNUP_URL
  const body = JSON.stringify({ lead })

  const result: SignupResult = await post(url, body)

  return result
}

async function deleteLead(lead: Lead) {
  const body = JSON.stringify({ lead })

  const result: SignupResult = await post(DELETE_ACCOUNT_URL, body)

  return result
}

export default function Home() {
  const [csvOutput, setCsvOputput] = useState<CsvParseOutput | null>(null)
  const [results, setResults] = useState<Record<string, SignupResult>>({})
  const [loading, setLoading] = useState(false)

  async function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    const output = await parseLeadsFromCSVFileInput(event)

    setCsvOputput(output)
  }

  async function recurseOverLeads(leads: Lead[], callback: (lead: Lead) => Promise<SignupResult>, index: number = 0) {
    const lead = leads[index]

    if (!lead) {
      setLoading(false)
      return
    }

    setLoading(true)

    const result = await callback(lead,)

    setResults((prevResults) => ({ ...prevResults, [lead.email]: result }))

    recurseOverLeads(leads, callback, index + 1)
  }

  return (
    <Box overflow='hidden' height='100vh' padding={6} boxSizing='border-box' display='flex' flexDirection='column' gap={4}>
      <Box >
        <Typography variant='h4'>
          Lets sign up some leads in skillmap
        </Typography>
        <ol>
          <li><Typography variant='body1'>Download the csv template</Typography></li>
          <li><Typography variant='body1'>Fill it up with your leads</Typography></li>
          <li><Typography variant='body1'>Upload it here</Typography></li>
          <li><Typography variant='body1'>Click the signup button in the bottom right</Typography></li>
          <li><Typography variant='body1'>Wait for a bit...</Typography></li>
          <li><Typography variant='body1'>Done! Don&apos;t forget to double check your leads are properly registered in skillmap</Typography></li>
        </ol>
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
          <Box flex={1} overflow='auto' >
            <Typography color='GrayText'>
            </Typography>
            {csvOutput.validLeads && <LeadsTable leads={csvOutput.validLeads} results={results} />}
          </Box>

          <Box display='flex' justifyContent='flex-end' alignItems='center' gap={2} borderTop='1px solid lightgray' paddingTop={2}>
            <Typography color='GrayText'>
              {csvOutput.invalidLeads?.length} invalid leads were found
            </Typography>
            <LoadingButton
              loading={loading}
              variant='outlined'
              color='error'
              onClick={() => recurseOverLeads(csvOutput.validLeads, deleteLead)}
            >
              Delete leads
            </LoadingButton>
            <LoadingButton
              variant='contained'
              loadingIndicator="Hold on..."
              loading={loading}
              onClick={() => recurseOverLeads(csvOutput.validLeads, signupLead)}
            >
              Sign up {csvOutput.validLeads?.length} valid leads
            </LoadingButton>
          </Box>
        </>
      )}
    </Box>
  )
}

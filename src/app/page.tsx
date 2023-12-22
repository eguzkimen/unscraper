"use client";

import { LeadsTable } from "@/components/LeadsTable";
import { Lead, SignupResult } from "@/types/models";
import { downloadStringAsFile } from "@/util/downloadStringAsFile";
import {
  CsvParseOutput,
  parseLeadsFromCSVFileInput,
} from "@/util/parseLeadsFromCsvFileInput";
import { FileDownload } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Typography,
  Button,
  Box,
  ButtonGroup,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { ChangeEvent, useMemo, useState } from "react";

const REAL_SIGNUP_URL = "/api/try-sign-in-then-sign-up";
const TEST_SIGNUP_URL = "/api/fake-signup";
const DELETE_ACCOUNT_URL = "/api/delete-skillmap-account";

async function post(url: string, body: string) {
  const result = await fetch(url, {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return result.json();
}

async function signupLead(lead: Lead) {
  const url = REAL_SIGNUP_URL;
  const body = JSON.stringify({ lead, headless: true });

  const result: SignupResult = await post(url, body);

  return result;
}

async function signupLeadFake(lead: Lead) {
  const url = TEST_SIGNUP_URL;
  const body = JSON.stringify({ lead, headless: true });

  const result: SignupResult = await post(url, body);

  return result;
}

async function deleteLead(lead: Lead) {
  const body = JSON.stringify({ lead });

  const result: SignupResult = await post(DELETE_ACCOUNT_URL, body);

  return result;
}

type SuccessStatus = "successful" | "failed" | "pending";
type StatusFilter = SuccessStatus | "all";

function getSuccessStatus(result: SignupResult | undefined): SuccessStatus {
  if (!result) return "pending";
  if (result.success) return "successful";

  return "failed";
}

async function exportLeads(leads: Lead[], filename: string) {
  let csvString = "email,firstName,lastName";

  leads.forEach(
    (lead) =>
      (csvString += `\n${lead.email},${lead.firstName},${lead.lastName}`)
  );

  downloadStringAsFile(csvString, filename);
}

export default function Home() {
  const [csvOutput, setCsvOputput] = useState<CsvParseOutput | null>(null);
  const [results, setResults] = useState<Record<string, SignupResult>>({});
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState<StatusFilter>("all");

  const leadsPerStatus = useMemo(() => {
    const perStatusRecord: Record<SuccessStatus, Lead[]> = {
      failed: [],
      pending: [],
      successful: [],
    };

    csvOutput?.validLeads.forEach((lead) => {
      const status = getSuccessStatus(results[lead.email]);

      perStatusRecord[status].push(lead);
    });

    return perStatusRecord;
  }, [csvOutput?.validLeads, results]);

  const filteredLeads = useMemo(() => {
    if (filter === "all") {
      return csvOutput?.validLeads;
    }

    return leadsPerStatus[filter];
  }, [csvOutput?.validLeads, leadsPerStatus, filter]);

  async function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    const output = await parseLeadsFromCSVFileInput(event);

    setCsvOputput(output);
  }

  async function recurseOverLeads(
    leads: Lead[],
    callback: (lead: Lead) => Promise<SignupResult>,
    index: number = 0
  ) {
    const lead = leads[index];

    if (!lead) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const result = await callback(lead);

    setResults((prevResults) => ({ ...prevResults, [lead.email]: result }));

    recurseOverLeads(leads, callback, index + 1);
  }

  return (
    <Box
      overflow="hidden"
      height="100vh"
      padding={6}
      boxSizing="border-box"
      display="flex"
      flexDirection="column"
      gap={4}
    >
      <Box>
        <Typography variant="h4">
          Lets sign up some leads in skillmap
        </Typography>
        <ol>
          <li>
            <Typography variant="body1">Download the template</Typography>
          </li>
          <li>
            <Typography variant="body1">Fill it up with your leads using excel, sheets, numbers, etc</Typography>
          </li>
          <li>
            <Typography variant="body1">Upload it here</Typography>
          </li>
          <li>
            <Typography variant="body1">
              Click the signup button in the bottom right
            </Typography>
          </li>
          <li>
            <Typography variant="body1">Wait for a bit...</Typography>
          </li>
          <li>
            <Typography variant="body1">
              Done! Don&apos;t forget to double check your leads are properly
              registered in skillmap
            </Typography>
          </li>
        </ol>
        <Box display="flex" paddingTop={2} justifyContent="space-between">
          <Box display="flex" gap={1}>
            <Button variant="contained" component="label">
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
              onClick={() =>
                downloadStringAsFile(
                  "email,firstName,lastName\ntest-jane-doe@gmail.com,Jane,Doe",
                  "lead-data-template.csv"
                )
              }
            >
              Download Template
            </Button>
          </Box>
          {csvOutput && (
            <Box display="flex" gap={1}>
              <ToggleButtonGroup
                size="small"
                value={filter}
                exclusive
                onChange={(e, value: StatusFilter) => setFilter(value)}
                aria-label="text alignment"
              >
                <ToggleButton value="all">
                  All ({csvOutput.validLeads.length})
                </ToggleButton>
                <ToggleButton value="successful">
                  Successful ({leadsPerStatus.successful.length})
                </ToggleButton>
                <ToggleButton value="failed">
                  Failed ({leadsPerStatus.failed.length})
                </ToggleButton>
                <ToggleButton value="pending">
                  Pending ({leadsPerStatus.pending.length})
                </ToggleButton>
              </ToggleButtonGroup>
              <Button
                variant="outlined"
                startIcon={<FileDownload />}
                onClick={() =>
                  filteredLeads &&
                  exportLeads(filteredLeads, `${filter}-leads.csv`)
                }
              >
                Download CSV
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      {csvOutput && (
        <>
          <Box flex={1} overflow="auto">
            <Typography color="GrayText"></Typography>
            {csvOutput.validLeads && (
              <LeadsTable leads={filteredLeads} results={results} />
            )}
          </Box>

          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            gap={2}
            borderTop="1px solid lightgray"
            paddingTop={2}
          >
            <LoadingButton
              loading={loading}
              loadingIndicator="Hold on..."
              variant="outlined"
              color="error"
              onClick={() => {
                recurseOverLeads(csvOutput.validLeads, deleteLead);
              }}
            >
              <Box paddingX={1}>Delete them all</Box>
            </LoadingButton>
            <LoadingButton
              variant="contained"
              loading={loading}
              loadingIndicator="Doing the thing..."
              onClick={() =>
                recurseOverLeads(csvOutput.validLeads, signupLeadFake)
              }
            >
              <Box paddingX={5}>Sign up all valid leads</Box>
            </LoadingButton>
          </Box>
        </>
      )}
    </Box>
  );
}

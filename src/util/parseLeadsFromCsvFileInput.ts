import { Lead, LeadSchema } from "@/types/models";
import { parse } from "csv-parse/sync";
import { ChangeEvent } from "react";

export type CsvParseOutput = {
  validLeads: Lead[];
  invalidLeads: unknown[];
}

export async function parseLeadsFromCSVFileInput(event: ChangeEvent<HTMLInputElement>): Promise<CsvParseOutput> {
  const p = new Promise<CsvParseOutput>((resolve, reject) => {
    const file = event.target.files?.[0]

    if (!file) return reject('No files found')

    const reader = new FileReader()

    reader.onload = async (e: ProgressEvent<FileReader>) => {
      const text = e.target?.result as string;
      const data = parse(text, { columns: true }) as unknown[];

      const validLeads: Lead[] = []
      const invalidLeads: unknown[] = [];

      data.forEach((lead) => {
        const parsed = LeadSchema.safeParse(lead);

        if (!parsed.success) {
          invalidLeads.push(lead)
          return;
        }

        validLeads.push(parsed.data)
      })

      const response: CsvParseOutput = {
        validLeads,
        invalidLeads,
      }

      resolve(response);
    };

    reader.readAsText(file);
  })

  return p;
}
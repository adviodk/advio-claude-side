import { getSheetsClient } from "@/lib/google";

const HEADERS = [
  "Tidspunkt booket",
  "Dato",
  "Tid",
  "Navn",
  "Email",
  "Telefon",
  "Firma",
  "Branche",
  "Har hjemmeside",
  "Har Facebook",
  "Google Meet link",
];

async function getFirstSheetTitle(sheets: ReturnType<typeof getSheetsClient>, spreadsheetId: string) {
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const title = meta.data.sheets?.[0]?.properties?.title;
  if (!title) throw new Error("Spreadsheet has no sheets");
  return title;
}

export async function appendBookingRow(row: {
  dato: string;
  tid: string;
  navn: string;
  email: string;
  telefon: string;
  firma: string;
  branche: string;
  harHjemmeside: string;
  harFacebook: string;
  meetLink: string;
}) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) throw new Error("GOOGLE_SHEET_ID is not configured");

  const sheets = getSheetsClient();
  const sheetTitle = await getFirstSheetTitle(sheets, spreadsheetId);

  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetTitle}!A1:K1`,
  });

  if (!existing.data.values || existing.data.values.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetTitle}!A1:K1`,
      valueInputOption: "RAW",
      requestBody: { values: [HEADERS] },
    });
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetTitle}!A:K`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [
          new Date().toISOString(),
          row.dato,
          row.tid,
          row.navn,
          row.email,
          row.telefon,
          row.firma,
          row.branche,
          row.harHjemmeside,
          row.harFacebook,
          row.meetLink,
        ],
      ],
    },
  });
}

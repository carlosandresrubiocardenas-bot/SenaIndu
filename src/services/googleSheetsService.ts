import { ApprenticeData } from '../types/induction';

export interface SpreadsheetInfo {
  id: string;
  name: string;
  webViewLink: string;
}

export interface SheetApprenticeRecord {
  id: string;
  timestamp: string;
  documentType: string;
  documentNumber: string;
  fullName: string;
  trainingProgram: string;
  fichaNumber: string;
  regional: string;
  trainingCenter: string;
  level: string;
  progressPercent: string;
  score: string;
  certificationStatus: string;
  verificationHash: string;
  regulationNorm: string;
}

const DEFAULT_SHEET_TITLE = 'SENA - Registro de Inducción de Aprendices';
const SHEET_TAB_NAME = 'Aprendices Inducción';

const HEADERS = [
  'ID Registro',
  'Fecha / Hora',
  'Tipo Doc',
  'Número Documento',
  'Nombre del Aprendiz',
  'Programa de Formación',
  'Ficha',
  'Regional',
  'Centro de Formación',
  'Nivel',
  'Progreso Inducción (%)',
  'Calificación (1.0 - 5.0)',
  'Estado Certificado',
  'Hash de Verificación',
  'Reglamento Vigente',
];

/**
 * Searches for an existing induction spreadsheet in the user's Google Drive.
 * If not found, creates a new one with official SENA headers and formatting.
 */
export async function findOrCreateInductionSpreadsheet(
  accessToken: string
): Promise<SpreadsheetInfo> {
  // 1. Search in Google Drive
  const query = encodeURIComponent(
    `name='${DEFAULT_SHEET_TITLE}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`
  );
  
  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!searchRes.ok) {
    const err = await searchRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Error al buscar archivos en Google Drive');
  }

  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    const existing = searchData.files[0];
    return {
      id: existing.id,
      name: existing.name,
      webViewLink: existing.webViewLink || `https://docs.google.com/spreadsheets/d/${existing.id}/edit`,
    };
  }

  // 2. Not found, create new Google Sheet
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: DEFAULT_SHEET_TITLE,
      },
      sheets: [
        {
          properties: {
            title: SHEET_TAB_NAME,
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Error al crear la hoja de cálculo en Google Drive');
  }

  const createdSheet = await createRes.json();
  const spreadsheetId = createdSheet.spreadsheetId;

  // 3. Write Headers
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${SHEET_TAB_NAME}'!A1:O1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [HEADERS],
      }),
    }
  );

  // 4. Style Header Row with SENA Green (#39A900)
  try {
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: createdSheet.sheets[0]?.properties?.sheetId || 0,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: HEADERS.length,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 0.223, // 57/255 (#39A900)
                    green: 0.662, // 169/255
                    blue: 0.0,
                  },
                  textFormat: {
                    foregroundColor: { red: 1, green: 1, blue: 1 },
                    bold: true,
                    fontSize: 11,
                  },
                  horizontalAlignment: 'CENTER',
                },
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
            },
          },
        ],
      }),
    });
  } catch {
    // Non-fatal if batch styling fails
  }

  return {
    id: spreadsheetId,
    name: DEFAULT_SHEET_TITLE,
    webViewLink: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
  };
}

/**
 * Saves or updates an apprentice's induction status in the Google Sheet.
 */
export async function syncApprenticeToSheet(
  accessToken: string,
  spreadsheetId: string,
  apprentice: ApprenticeData,
  progressPercent: number,
  score: number,
  isCertified: boolean,
  verificationHash: string
): Promise<{ action: 'created' | 'updated'; rowNumber: number }> {
  // Format current datetime
  const now = new Date().toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    dateStyle: 'short',
    timeStyle: 'medium',
  });

  const rowValues = [
    `APP-${apprentice.documentNumber}-${apprentice.fichaNumber}`,
    now,
    apprentice.documentType,
    apprentice.documentNumber,
    apprentice.fullName,
    apprentice.trainingProgram,
    apprentice.fichaNumber,
    apprentice.regional,
    apprentice.trainingCenter,
    apprentice.level,
    `${progressPercent}%`,
    score.toFixed(1),
    isCertified ? 'CERTIFICADO APROBADO' : 'EN PROCESO DE INDUCCIÓN',
    verificationHash || 'N/A',
    'Acuerdo No. 0009 de 2024 (Vigente)',
  ];

  // 1. Fetch existing rows to check for existing record
  const getRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${SHEET_TAB_NAME}'!A2:O`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  let existingRowIndex = -1;
  if (getRes.ok) {
    const getData = await getRes.json();
    const rows: string[][] = getData.values || [];
    
    // Find by matching document number (column D = index 3) and ficha (column G = index 6)
    existingRowIndex = rows.findIndex(
      (r) => r[3] === apprentice.documentNumber && r[6] === apprentice.fichaNumber
    );
  }

  if (existingRowIndex >= 0) {
    // Row in Sheet is (existingRowIndex + 2) because row 1 is headers and array is 0-indexed
    const rowNumber = existingRowIndex + 2;
    const updateRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${SHEET_TAB_NAME}'!A${rowNumber}:O${rowNumber}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [rowValues],
        }),
      }
    );

    if (!updateRes.ok) {
      const err = await updateRes.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Error al actualizar el registro en la hoja de cálculo');
    }

    return { action: 'updated', rowNumber };
  } else {
    // Append new row
    const appendRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${SHEET_TAB_NAME}'!A:O:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [rowValues],
        }),
      }
    );

    if (!appendRes.ok) {
      const err = await appendRes.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Error al registrar el aprendiz en la hoja de cálculo');
    }

    const appendData = await appendRes.json();
    const updatedRange: string = appendData.updates?.updatedRange || '';
    const match = updatedRange.match(/(\d+)$/);
    const rowNumber = match ? parseInt(match[1], 10) : 2;

    return { action: 'created', rowNumber };
  }
}

/**
 * Reads all registered apprentices from the Google Sheet.
 */
export async function getSheetApprenticeRecords(
  accessToken: string,
  spreadsheetId: string
): Promise<SheetApprenticeRecord[]> {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${SHEET_TAB_NAME}'!A2:O`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Error al leer registros de la hoja');
  }

  const data = await res.json();
  const rows: string[][] = data.values || [];

  return rows.map((r, idx) => ({
    id: r[0] || `REC-${idx + 1}`,
    timestamp: r[1] || '',
    documentType: r[2] || '',
    documentNumber: r[3] || '',
    fullName: r[4] || '',
    trainingProgram: r[5] || '',
    fichaNumber: r[6] || '',
    regional: r[7] || '',
    trainingCenter: r[8] || '',
    level: r[9] || '',
    progressPercent: r[10] || '0%',
    score: r[11] || '0.0',
    certificationStatus: r[12] || 'Pendiente',
    verificationHash: r[13] || '',
    regulationNorm: r[14] || 'Acuerdo 0009 de 2024',
  }));
}

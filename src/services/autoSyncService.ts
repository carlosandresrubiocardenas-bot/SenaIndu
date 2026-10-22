import { ApprenticeData } from '../types/induction';
import { 
  findOrCreateInductionSpreadsheet, 
  syncApprenticeToSheet, 
  SpreadsheetInfo 
} from './googleSheetsService';
import { 
  getAccessToken, 
  getCurrentUser, 
  googleSignIn,
  initAuth 
} from './googleAuth';

export type AutoSyncStatus = 'idle' | 'syncing' | 'saved' | 'error' | 'unconnected';

export interface AutoSyncState {
  status: AutoSyncStatus;
  message: string | null;
  lastSavedTime: Date | null;
  sheetInfo: SpreadsheetInfo | null;
  error: string | null;
  isConnected: boolean;
}

type AutoSyncListener = (state: AutoSyncState) => void;

// In-memory state
let currentSheetInfo: SpreadsheetInfo | null = (() => {
  try {
    const cached = localStorage.getItem('sena_induction_spreadsheet');
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
})();

let currentState: AutoSyncState = {
  status: 'idle',
  message: null,
  lastSavedTime: null,
  sheetInfo: currentSheetInfo,
  error: null,
  isConnected: false,
};

const listeners = new Set<AutoSyncListener>();
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let idleResetTimer: ReturnType<typeof setTimeout> | null = null;
let lastSyncedHash: string | null = null;
let pendingSyncPayload: {
  apprentice: ApprenticeData;
  progressPercent: number;
  score: number;
  isCertified: boolean;
  verificationHash: string;
} | null = null;

function notifyListeners() {
  currentState.sheetInfo = currentSheetInfo;
  currentState.isConnected = !!getCurrentUser();
  listeners.forEach((listener) => {
    try {
      listener({ ...currentState });
    } catch (e) {
      console.warn('Error in autoSync listener:', e);
    }
  });
}

function updateState(partial: Partial<AutoSyncState>) {
  currentState = { ...currentState, ...partial };
  notifyListeners();
}

// Listen to auth changes automatically
initAuth(
  async (_user, token) => {
    updateState({ isConnected: true, error: null });
    // If pending payload was waiting for connection, sync immediately
    if (pendingSyncPayload) {
      const payload = pendingSyncPayload;
      pendingSyncPayload = null;
      await executeSync(token, payload);
    }
  },
  () => {
    updateState({ isConnected: false });
  }
);

async function executeSync(
  token: string,
  payload: {
    apprentice: ApprenticeData;
    progressPercent: number;
    score: number;
    isCertified: boolean;
    verificationHash: string;
  }
) {
  if (idleResetTimer) {
    clearTimeout(idleResetTimer);
    idleResetTimer = null;
  }

  updateState({
    status: 'syncing',
    message: 'Guardando datos en Google Sheets...',
    error: null,
  });

  try {
    // 1. Locate or create spreadsheet if not already in memory
    let sheet = currentSheetInfo;
    if (!sheet) {
      sheet = await findOrCreateInductionSpreadsheet(token);
      currentSheetInfo = sheet;
      try {
        localStorage.setItem('sena_induction_spreadsheet', JSON.stringify(sheet));
      } catch {
        // ignore
      }
    }

    // 2. Sync apprentice data
    const result = await syncApprenticeToSheet(
      token,
      sheet.id,
      payload.apprentice,
      payload.progressPercent,
      payload.score,
      payload.isCertified,
      payload.verificationHash
    );

    const now = new Date();
    const actionLabel = result.action === 'created' ? 'registrado' : 'actualizado';
    const message = payload.isCertified
      ? `✓ Certificado oficial e inducción ${actionLabel}s en Google Sheets (fila ${result.rowNumber})`
      : `✓ Avance del ${payload.progressPercent}% sincronizado en Google Sheets (fila ${result.rowNumber})`;

    // Compute and record the payload hash
    const hash = `${payload.apprentice.documentNumber}-${payload.apprentice.fichaNumber}-${payload.progressPercent}-${payload.score.toFixed(1)}-${payload.isCertified}`;
    lastSyncedHash = hash;

    updateState({
      status: 'saved',
      message,
      lastSavedTime: now,
      sheetInfo: sheet,
      error: null,
    });

    // Reset status back to idle after 3.8 seconds
    idleResetTimer = setTimeout(() => {
      if (currentState.status === 'saved') {
        updateState({ status: 'idle', message: null });
      }
    }, 3800);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error al sincronizar con Google Sheets';
    console.error('AutoSync error:', err);
    updateState({
      status: 'error',
      message: 'No se pudo sincronizar automáticamente con Google Sheets',
      error: errorMsg,
    });
  }
}

/**
 * Triggers an automatic debounced synchronization of apprentice data.
 * Does not block UI or interrupt user workflow.
 */
export function triggerAutoSync(
  apprentice: ApprenticeData,
  progressPercent: number,
  score: number,
  isCertified: boolean,
  verificationHash: string,
  immediate: boolean = false
) {
  const payload = {
    apprentice,
    progressPercent,
    score,
    isCertified,
    verificationHash,
  };

  const payloadHash = `${apprentice.documentNumber}-${apprentice.fichaNumber}-${progressPercent}-${score.toFixed(1)}-${isCertified}`;
  if (payloadHash === lastSyncedHash) {
    // No changes since last successful sync
    return;
  }

  pendingSyncPayload = payload;

  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }

  const run = async () => {
    const token = await getAccessToken();
    if (!token) {
      updateState({
        status: 'unconnected',
        message: 'Google Drive no conectado para guardado automático',
      });
      return;
    }

    if (pendingSyncPayload) {
      const toSync = pendingSyncPayload;
      pendingSyncPayload = null;
      await executeSync(token, toSync);
    }
  };

  if (immediate) {
    run();
  } else {
    // 1.5s debounce to group multiple actions smoothly
    debounceTimer = setTimeout(run, 1500);
  }
}

/**
 * Connects Google in 1 click and immediately performs the sync
 */
export async function connectGoogleAndAutoSync(
  apprentice: ApprenticeData,
  progressPercent: number,
  score: number,
  isCertified: boolean,
  verificationHash: string
): Promise<boolean> {
  try {
    updateState({ status: 'syncing', message: 'Conectando con Google...' });
    const result = await googleSignIn();
    if (result) {
      triggerAutoSync(apprentice, progressPercent, score, isCertified, verificationHash, true);
      return true;
    }
    return false;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error al conectar con Google';
    updateState({
      status: 'error',
      message: 'Fallo al autenticar cuenta de Google',
      error: errorMsg,
    });
    return false;
  }
}

/**
 * Subscribe to sync state changes
 */
export function subscribeAutoSync(listener: AutoSyncListener): () => void {
  listeners.add(listener);
  // Send initial state
  listener({ ...currentState });
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Get current sync state snapshot
 */
export function getAutoSyncState(): AutoSyncState {
  return { ...currentState };
}

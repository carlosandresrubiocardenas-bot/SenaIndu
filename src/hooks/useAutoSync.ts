import { useEffect, useState, useCallback, useRef } from 'react';
import { ApprenticeData } from '../types/induction';
import { 
  triggerAutoSync, 
  subscribeAutoSync, 
  connectGoogleAndAutoSync,
  getAutoSyncState,
  AutoSyncState 
} from '../services/autoSyncService';

interface UseAutoSyncOptions {
  apprentice: ApprenticeData;
  progressPercent: number;
  score: number;
  isCertified: boolean;
  verificationHash: string;
}

export function useAutoSync({
  apprentice,
  progressPercent,
  score,
  isCertified,
  verificationHash,
}: UseAutoSyncOptions) {
  const [syncState, setSyncState] = useState<AutoSyncState>(getAutoSyncState());
  const initialMountRef = useRef(true);

  // Subscribe to autoSync service state
  useEffect(() => {
    const unsubscribe = subscribeAutoSync((state) => {
      setSyncState(state);
    });
    return () => unsubscribe();
  }, []);

  // Trigger auto sync on changes to progress, apprentice, score, or certification
  useEffect(() => {
    // If not first mount, trigger debounced auto-sync
    if (!initialMountRef.current) {
      triggerAutoSync(apprentice, progressPercent, score, isCertified, verificationHash);
    } else {
      initialMountRef.current = false;
    }
  }, [apprentice, progressPercent, score, isCertified, verificationHash]);

  const connectAndSync = useCallback(async () => {
    return await connectGoogleAndAutoSync(
      apprentice,
      progressPercent,
      score,
      isCertified,
      verificationHash
    );
  }, [apprentice, progressPercent, score, isCertified, verificationHash]);

  const forceSync = useCallback(() => {
    triggerAutoSync(apprentice, progressPercent, score, isCertified, verificationHash, true);
  }, [apprentice, progressPercent, score, isCertified, verificationHash]);

  return {
    ...syncState,
    connectAndSync,
    forceSync,
  };
}

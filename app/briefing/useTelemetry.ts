"use client";

import { useState, useEffect, useCallback } from 'react';

export interface TelemetryData {
  device: string;
  os: string;
  resolution: string;
  startTime: string;
  endTime?: string;
  totalTimeSeconds?: number;
  timePerStep: Record<number, number>;
  reloads: number;
}

export function useTelemetry() {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [stepStartTime, setStepStartTime] = useState<number>(0);
  const [timePerStep, setTimePerStep] = useState<Record<number, number>>({});

  useEffect(() => {
    const ua = navigator.userAgent;
    let device = "Desktop";
    if (/Mobi|Android/i.test(ua)) device = "Mobile";
    else if (/Tablet|iPad/i.test(ua)) device = "Tablet";

    let os = "Unknown OS";
    if (ua.indexOf("Win") !== -1) os = "Windows";
    else if (ua.indexOf("Mac") !== -1) os = "MacOS/iOS";
    else if (ua.indexOf("Linux") !== -1) os = "Linux";
    else if (ua.indexOf("Android") !== -1) os = "Android";

    const reloads = parseInt(sessionStorage.getItem('felipe_briefing_reloads') || '0', 10);
    sessionStorage.setItem('felipe_briefing_reloads', (reloads + 1).toString());

    setTelemetry({
      device,
      os,
      resolution: `${window.innerWidth}x${window.innerHeight}`,
      startTime: new Date().toISOString(),
      timePerStep: {},
      reloads
    });
    setStepStartTime(Date.now());
  }, []);

  const recordStepChange = useCallback((fromStep: number) => {
    if (stepStartTime === 0) return;
    const now = Date.now();
    const elapsed = Math.round((now - stepStartTime) / 1000);
    
    setTimePerStep(prev => {
      const updated = { ...prev, [fromStep]: (prev[fromStep] || 0) + elapsed };
      setTelemetry(t => t ? { ...t, timePerStep: updated } : null);
      return updated;
    });
    
    setStepStartTime(now);
  }, [stepStartTime]);

  const finalizeTelemetry = useCallback(() => {
    if (!telemetry) return null;
    const finalData = {
      ...telemetry,
      timePerStep,
      endTime: new Date().toISOString(),
      totalTimeSeconds: Math.round((Date.now() - new Date(telemetry.startTime).getTime()) / 1000)
    };
    return finalData;
  }, [telemetry, timePerStep]);

  return { recordStepChange, finalizeTelemetry };
}

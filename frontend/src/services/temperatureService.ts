export type TemperatureStatus = 'SAFE' | 'WARNING' | 'CRITICAL';

export interface TemperatureVerificationInput {
  batchId: string;
  sensorId: string;
  temperature: number;
  minimumAllowed: number;
  maximumAllowed: number;
  facility: string;
  zone: string;
  rack: string;
  shelf: string;
  bin: string;
  latitude: number;
  longitude: number;
  timestamp?: number;
}

export interface TemperatureVerificationRecord extends TemperatureVerificationInput {
  id: string;
  status: TemperatureStatus;
  statusMessage: string;
  verificationTimestamp: number;
  blockchainTransactionId: string;
  network: string;
  custodianRole: string;
}

export const temperatureService = {
  calculateStatus(temp: number, min: number, max: number): { status: TemperatureStatus; message: string } {
    if (temp < min) {
      return {
        status: 'CRITICAL',
        message: `FREEZE WARNING: Current temperature (${temp}°C) is below minimum threshold (${min}°C).`,
      };
    }
    if (temp > max) {
      return {
        status: 'CRITICAL',
        message: `THERMAL EXCURSION ALERT: Temperature (${temp}°C) exceeds maximum allowed safety threshold (${max}°C).`,
      };
    }
    if (temp <= min + 1.0 || temp >= max - 1.0) {
      return {
        status: 'WARNING',
        message: `TEMPERATURE WARN: Current temperature (${temp}°C) is approaching thermal boundaries (${min}°C - ${max}°C).`,
      };
    }
    return {
      status: 'SAFE',
      message: `TEMPERATURE OPTIMAL: Current reading (${temp}°C) is strictly within compliant range (${min}°C - ${max}°C).`,
    };
  },

  verifyTemperature(input: TemperatureVerificationInput): TemperatureVerificationRecord {
    const { status, message } = this.calculateStatus(
      input.temperature,
      input.minimumAllowed,
      input.maximumAllowed
    );

    const generatedTxId =
      'TX-ALGO-TMP-' +
      Math.random().toString(36).substring(2, 8).toUpperCase() +
      '-' +
      Math.floor(1000 + Math.random() * 9000);

    const record: TemperatureVerificationRecord = {
      ...input,
      id: 'VERIF-' + Math.floor(100000 + Math.random() * 900000),
      status,
      statusMessage: message,
      verificationTimestamp: input.timestamp || Date.now(),
      blockchainTransactionId: generatedTxId,
      network: 'Algorand LocalNet AVM ARC-4',
      custodianRole: 'COLD_STORAGE',
    };

    return record;
  },
};

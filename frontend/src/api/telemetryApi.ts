// src/api/telemetryApi.ts
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/asset`

export interface TelemetryPoint {
  time: string;
  value: number;
}

export interface TelemetryStats {
  count: number;
  min: number;
  max: number;
  average: number;
  firstValue: number;
  lastValue: number;
  firstTimestamp: string;
  lastTimestamp: string;
}

export interface TelemetryResponse {
  assetId: string;
  deviceId: string;
  signalId: string;
  signalName: string;
  unit: string;
  timeRange: string;
  startTime: string;
  endTime: string;
  values: TelemetryPoint[];
  stats: TelemetryStats | null;
}

export const TimeRange = {
  LastHour: 0,
  Last6Hours: 1,
  Last24Hours: 2,
  Last7Days: 3,
  Last30Days: 4,
  Custom: 5,
} as const;

export type TimeRange = typeof TimeRange[keyof typeof TimeRange];

export interface TelemetryRequest {
  assetId: string;
  signalId: string;       // ✅ was signalTypeId
  timeRange: TimeRange;
  startDate?: string;
  endDate?: string;
}

export interface RawTelemetryRequest {
  assetId: string;
  signalId: string;       // ✅ was signalTypeId
  startDate: string;
  endDate: string;
  timeRange: TimeRange;   // must be Custom (5)
}


// 🔥 Fetch telemetry data
export const getTelemetryData = async (
  request: TelemetryRequest
): Promise<TelemetryResponse> => {
  try {
    console.log("🔍 Request payload:", request);

    const response = await axios.post<TelemetryResponse>(
      `${API_BASE_URL}/TelemetryTest/query`,
      request,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("✅ Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Full error:", error);
    console.error("❌ Error response:", error.response);
    throw new Error(error.response?.data?.error || "Failed to fetch telemetry data");
  }
};

export const getRawTelemetryData = async (
  request: RawTelemetryRequest
): Promise<TelemetryResponse> => {
  try {
    console.log("🔍 RAW Request payload:", request);

    const response = await axios.post<TelemetryResponse>(
      `${API_BASE_URL}/TelemetryTest/queryraw`,
      request,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ RAW Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ RAW telemetry error:", error);
    console.error("❌ RAW error response:", error.response);
    throw new Error(
      error.response?.data?.error || "Failed to fetch raw telemetry data"
    );
  }
};


export const getLastHourData = async (
  assetId: string,
  signalId: string
): Promise<TelemetryResponse> => {
  try {
    const response = await axios.get<TelemetryResponse>(
      `${API_BASE_URL}/TelemetryTest/last-hour`,
      { params: { assetId, signalId } }
    );
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch last hour data:", error);
    throw new Error(error.response?.data?.error || "Failed to fetch data");
  }
};

export const getLast24HoursData = async (
  assetId: string,
  signalId: string
): Promise<TelemetryResponse> => {
  try {
    const response = await axios.get<TelemetryResponse>(
      `${API_BASE_URL}/TelemetryTest/last-24-hours`,
      { params: { assetId, signalId } }
    );
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch last 24 hours data:", error);
    throw new Error(error.response?.data?.error || "Failed to fetch data");
  }
};

export const getLast7DaysData = async (
  assetId: string,
  signalId: string
): Promise<TelemetryResponse> => {
  try {
    const response = await axios.get<TelemetryResponse>(
      `${API_BASE_URL}/TelemetryTest/last-7-days`,
      { params: { assetId, signalId } }
    );
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch last 7 days data:", error);
    throw new Error(error.response?.data?.error || "Failed to fetch data");
  }
};

export const getCustomRangeData = async (
  assetId: string,
  signalId: string,
  startDate: string,
  endDate?: string
): Promise<TelemetryResponse> => {
  try {
    const response = await axios.get<TelemetryResponse>(
      `${API_BASE_URL}/TelemetryTest/custom-range`,
      { params: { assetId, signalId, startDate, endDate } }
    );
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch custom range data:", error);
    throw new Error(error.response?.data?.error || "Failed to fetch data");
  }
};
import api from "./axios";

/* ============================
   ENUMS
============================ */
export const DeviceProtocol = {
  Modbus: 1,
  OpcUa: 2,
} as const;

export type DeviceProtocol =
  (typeof DeviceProtocol)[keyof typeof DeviceProtocol];


export const OpcUaConnectionMode = {
  Polling: 1,
  PubSub: 2,
} as const;

export type OpcUaConnectionMode =
  (typeof OpcUaConnectionMode)[keyof typeof OpcUaConnectionMode];

/* ============================
   INTERFACES
============================ */

export interface DevicePort {
  slaveIndex: number;
  registerAddress: number;
  registerLength?: number;
  dataType: string;
  scale?: number;
  unit?: string;
  isHealthy?: boolean;
  protocol: DeviceProtocol;
}

export interface DeviceConfiguration {
  name: string;
  protocol: DeviceProtocol;
  pollIntervalMs?: number;
  ipAddress?: string;
  port?: number;
  slaveId?: number;
  endian?: "Little" | "Big";
  modbusMode?: number;       
  serialPort?: string;       
  baudRate?: number;         
  parity?: string;          
  connectionString?: string;
  connectionMode?: OpcUaConnectionMode;
}

export interface CreateDevicePayload {
  name: string;
  description?: string;
  gatewayClientId: string;
  protocol: DeviceProtocol;
  ports?: DevicePort[];
  configuration?: DeviceConfiguration;
}

export interface UpdateDevicePayload {
  name?: string;
  description?: string;
  gatewayClientId?: string;
  protocol?: DeviceProtocol;
}

export interface Device {
  deviceId: string;
  name: string;
  description?: string;
  gatewayId: string;
  protocol: DeviceProtocol;
  deviceSlave?: DevicePort[];
  deviceConfiguration?: DeviceConfiguration;
  deviceConfigurationId?: string;
  isDeleted: boolean;
  createdAt: string;
  items?: any[];
  totalPages?: number;
}

// Shape of a register returned by /devices/unmapped
export interface UnmappedRegister {
  registerId: string;
  registerAddress: number;
  signalName: string;
  signalUnit: string;
  registerLength: number;
  dataType: string;
  isHealthy: boolean;
  scale: number;
  byteOrder: string | null;
  wordSwap: boolean;
}

// Shape of a slave returned by /devices/unmapped
export interface UnmappedSlave {
  deviceSlaveId: string;
  slaveIndex: number;
  isHealthy: boolean;
  matchedRegisters: UnmappedRegister[];
}

// Shape of an OPC UA node returned by /devices/unmapped
export interface UnmappedNode {
  opcUaNodeId: string;
  nodeId: string;
  signalName: string;
  signalUnit: string;
  dataType: string;
  scalingFactor: number;
}

// Shape of a device returned by /devices/unmapped
export interface UnmappedDevice {
  deviceId: string;
  name: string;
  description: string | null;
  protocol: DeviceProtocol;
  matchedSlaves: UnmappedSlave[] | null;
  matchedNodes: UnmappedNode[] | null;
}

export interface UnmappedDevicesResponse {
  success: boolean;
  data: UnmappedDevice[];
  error: any | null;
}

/* ============================
   API FUNCTIONS
============================ */

// GET /api/devices
export const getDevices = async (
  pageNumber = 1,
  pageSize = 10,
  searchTerm = ""
) => {
  const response = await api.get("/devices", {
    params: { pageNumber, pageSize, searchTerm },
  });
  return response.data.data as Device[];
};

// POST /api/devices
export const createDevice = async (payload: CreateDevicePayload) => {
  const response = await api.post("/devices", payload);
  return response.data.data as Device;
};

// GET /api/devices/{id}
export const getDeviceById = async (id: string) => {
  const response = await api.get(`/devices/${id}`);
  return response.data.data as Device;
};

// PUT /api/devices/{id}
export const updateDevice = async (
  id: string,
  device: UpdateDevicePayload,
  configuration?: DeviceConfiguration
) => {
  const payload = {
    ...device,
    configuration: configuration ?? null,
  };
  const response = await api.put(`/devices/${id}`, payload);
  return response.data.data as Device;
};

// POST /api/devices/{id}/configuration
export const addDeviceConfiguration = async (
  deviceId: string,
  configuration: DeviceConfiguration
) => {
  const response = await api.post(`/devices/${deviceId}/configuration`, configuration);
  return response.data.data;
};

// DELETE /api/devices/{id}
export const deleteDevice = async (id: string) => {
  const response = await api.delete(`/devices/${id}`);
  return response.data.data;
};

// POST /api/devices/{id}/restore
export const restoreDeviceById = async (id: string) => {
  const response = await api.post(`/devices/${id}/restore`);
  return response.data.data;
};

// GET /api/devices/deleted
export const getDeletedDevices = async () => {
  const response = await api.get("/devices/deleted");
  return response.data.data as Device[];
};

// GET /api/devices/unmapped
// Returns all devices that have unmapped registers or OPC UA nodes
export const getUnmappedDevices = async (): Promise<UnmappedDevicesResponse> => {
  try {
    const response = await api.get("/devices/unmapped");
    return {
      success: true,
      data: response.data.data ?? [],
      error: null,
    };
  } catch (error: any) {
    console.error("Unmapped devices API error:", error.response?.data || error);
    return {
      success: false,
      data: [],
      error,
    };
  }
};

// POST /api/devices/match-by-address
export const matchByRegisterAddress = async (registerAddresses: number[]) => {
  try {
    const response = await api.post("/devices/match-by-address", {
      RegisterAddresses: registerAddresses,
    });
    return {
      success: true,
      data: response.data.data ?? [],
    };
  } catch (error: any) {
    console.error("Match API Error:", error.response?.data || error);
    return {
      success: false,
      data: [],
      error,
    };
  }
};

// GET /stats/avg-response-time
export const getAvgApiResponseTime = async () => {
  const response = await api.get("/stats/avg-response-time");
  return response.data.avgResponseTime;
};


// GET /devices/{id}/is-mapped
export const getDeviceIsMapped = async (id: string): Promise<boolean> => {
  const response = await api.get(`/devices/${id}/is-mapped`);
  return response.data.data.isMapped as boolean;
};
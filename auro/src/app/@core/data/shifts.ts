export interface ShiftDto {
  shiftId: number;
  storeId: number;
  storeLabel?: string | null;
  employeeId: number;
  employeeName?: string | null;
  shiftDate: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  shiftType: string;
  departmentId?: number | null;
  status: string;
  note?: string | null;
  createdAt: string;
  createdBy?: number | null;
  updatedAt?: string | null;
  updatedBy?: number | null;
}

export interface ShiftEmployee {
  employeeId: number;
  employeeName: string;
  email?: string | null;
  role?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  brojIzDESa?: string | null;
}

export interface ShiftRequestDto {
  requestId: number;
  storeId: number;
  storeLabel?: string | null;
  employeeId: number;
  employeeName?: string | null;
  type: string;
  relatedShiftId?: number | null;
  requestedDate?: string | null;
  message?: string | null;
  status: string;
  managerNote?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  approvedBy?: number | null;
  approvedAt?: string | null;
}

export interface ShiftMutationResponse {
  shift: ShiftDto;
  warning?: string | null;
}

export interface ShiftCreateRequest {
  storeId: number;
  employeeId: number;
  shiftDate: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  shiftType: string;
  departmentId?: number | null;
  status: string;
  note?: string | null;
}

export interface ShiftUpdateRequest extends ShiftCreateRequest {}

export interface ShiftCopyWeekRequest {
  storeId: number;
  sourceWeekStart: string;
  targetWeekStart: string;
  overwrite: boolean;
}

export interface ShiftPublishRequest {
  storeId: number;
  from: string;
  to: string;
}

export interface ShiftRequestCreateRequest {
  storeId: number;
  employeeId: number;
  type: string;
  relatedShiftId?: number | null;
  requestedDate?: string | null;
  message?: string | null;
}

export interface ShiftRequestDecisionRequest {
  managerNote?: string | null;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
}

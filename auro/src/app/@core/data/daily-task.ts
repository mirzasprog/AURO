export type DailyTaskType = 'REPETITIVE' | 'CUSTOM';
export type DailyTaskStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE';

export interface DailyTask {
  id: number;
  title: string;
  description?: string;
  type: DailyTaskType;
  date: string;
  status: DailyTaskStatus;
  imageAllowed: boolean;
  imageAttachment?: string;
  completionNote?: string;
  completedAt?: string;
  completedBy?: string;
  createdBy?: string;
  prodavnicaId: number;
  prodavnicaBroj?: string;
  prodavnicaNaziv?: string;
  isEditable: boolean;
  isRecurring: boolean;
}

export interface DailyTaskStore {
  id: number;
  code: string;
  name: string;
  city?: string;
  format?: string;
  managerId?: number | null;
  managerName?: string | null;
}

export interface DailyTaskPayload {
  title: string;
  description?: string;
  date: string;
  imageAllowed: boolean;
  isRecurring: boolean;
}

export interface DailyTaskStatusPayload {
  status: DailyTaskStatus;
  completionNote?: string;
  image?: File | null;
  removeImage?: boolean;
}

export interface DailyTaskBulkPayload extends DailyTaskPayload {
  targetType: 'stores' | 'city' | 'manager' | 'format';
  storeIds?: number[];
  city?: string;
  managerId?: number;
  format?: string;
}

export interface DailyTaskBulkResult {
  brojZadataka: number;
  brojProdavnica: number;
}

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
}

export interface DailyTaskStore {
  id: number;
  code: string;
  name: string;
}

export interface DailyTaskPayload {
  title: string;
  description?: string;
  date: string;
  imageAllowed: boolean;
}

export interface DailyTaskStatusPayload {
  status: DailyTaskStatus;
  completionNote?: string;
  image?: File | null;
  removeImage?: boolean;
}

import { Injectable } from '@angular/core';
import { ShiftDto, ShiftEmployee } from '../../@core/data/shifts';
import { DailyTaskStore } from '../../@core/data/daily-task';

export interface ShiftFormContextData {
  title: string;
  shift?: ShiftDto;
  employees: ShiftEmployee[];
  stores: DailyTaskStore[];
  shiftTypes: string[];
  shiftStatuses: string[];
  storeId?: number;
  canSelectStore: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ShiftDialogDataService {
  private dialogData: ShiftFormContextData | null = null;

  setDialogData(data: ShiftFormContextData): void {
    console.log('ShiftDialogDataService - postavljam podatke:', data);
    this.dialogData = data;
  }

  getDialogData(): ShiftFormContextData | null {
    console.log('ShiftDialogDataService - čitam podatke:', this.dialogData);
    return this.dialogData;
  }

  clearDialogData(): void {
    this.dialogData = null;
  }
}
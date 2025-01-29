import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Expense } from '../models/employee.model';
import { IndexedDBService } from './indexeddb.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  constructor(private indexedDB: IndexedDBService) {}

  getExpenses(): Observable<Expense[]> {
    return this.indexedDB.getExpenses();
  }

  getExpensesByDateRange(startDate: Date, endDate: Date): Observable<Expense[]> {
    return this.indexedDB.getExpensesByDateRange(startDate, endDate);
  }

  addExpense(expense: Omit<Expense, 'id'>): Observable<Expense> {
    return this.indexedDB.addExpense(expense);
  }

  getExpensesByDepartment(departmentId: string): Observable<Expense[]> {
    return this.indexedDB.getExpensesByDepartment(departmentId);
  }
}
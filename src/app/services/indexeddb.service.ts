import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Employee, Department, Expense } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {
  private dbName = 'expenseManagerDB';
  private version = 1;
  private db: IDBDatabase | null = null;
  private dbReady: Promise<void>;

  constructor() {
    this.dbReady = this.initDB();
  }

  private initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('Error opening database:', request.error);
        reject(request.error);
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('employees')) {
          const employeeStore = db.createObjectStore('employees', { keyPath: 'id' });
          employeeStore.createIndex('name', 'name', { unique: false });
        }

        if (!db.objectStoreNames.contains('departments')) {
          const departmentStore = db.createObjectStore('departments', { keyPath: 'id' });
          departmentStore.createIndex('name', 'name', { unique: false });
        }

        if (!db.objectStoreNames.contains('expenses')) {
          const expenseStore = db.createObjectStore('expenses', { keyPath: 'id' });
          expenseStore.createIndex('departmentId', 'departmentId', { unique: false });
          expenseStore.createIndex('date', 'date', { unique: false });
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('Database initialized successfully');
        resolve();
      };
    });
  }

  addEmployee(employee: Omit<Employee, 'id'>): Observable<Employee> {
    return from(
      this.dbReady.then(() => {
        return new Promise<Employee>((resolve, reject) => {
          if (!this.db) {
            reject(new Error('Database not initialized'));
            return;
          }

          const transaction = this.db.transaction('employees', 'readwrite');
          const store = transaction.objectStore('employees');
          
          const newEmployee = {
            id: crypto.randomUUID(),
            ...employee
          };

          const request = store.add(newEmployee);

          request.onsuccess = () => resolve(newEmployee);
          request.onerror = () => reject(request.error);
        });
      })
    );
  }

  addDepartment(department: Omit<Department, 'id'>): Observable<Department> {
    return from(
      this.dbReady.then(() => {
        return new Promise<Department>((resolve, reject) => {
          if (!this.db) {
            reject(new Error('Database not initialized'));
            return;
          }

          const transaction = this.db.transaction('departments', 'readwrite');
          const store = transaction.objectStore('departments');
          
          const newDepartment = {
            id: crypto.randomUUID(),
            ...department
          };

          const request = store.add(newDepartment);

          request.onsuccess = () => resolve(newDepartment);
          request.onerror = () => reject(request.error);
        });
      })
    );
  }

  getDepartments(): Observable<Department[]> {
    return from(
      this.dbReady.then(() => {
        return new Promise<Department[]>((resolve, reject) => {
          if (!this.db) {
            reject(new Error('Database not initialized'));
            return;
          }

          const transaction = this.db.transaction('departments', 'readonly');
          const store = transaction.objectStore('departments');
          const request = store.getAll();

          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
      })
    );
  }

  getEmployees(): Observable<Employee[]> {
    return from(
      this.dbReady.then(() => {
        return new Promise<Employee[]>((resolve, reject) => {
          if (!this.db) {
            reject(new Error('Database not initialized'));
            return;
          }

          const transaction = this.db.transaction('employees', 'readonly');
          const store = transaction.objectStore('employees');
          const request = store.getAll();

          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
      })
    );
  }

  addExpense(expense: Omit<Expense, 'id'>): Observable<Expense> {
    return from(
      this.dbReady.then(() => {
        return new Promise<Expense>((resolve, reject) => {
          if (!this.db) {
            reject(new Error('Database not initialized'));
            return;
          }

          const transaction = this.db.transaction('expenses', 'readwrite');
          const store = transaction.objectStore('expenses');
          
          const newExpense = {
            id: crypto.randomUUID(),
            ...expense,
            date: new Date(expense.date) // Asegurar que la fecha es un objeto Date
          };

          const request = store.add(newExpense);

          request.onsuccess = () => resolve(newExpense);
          request.onerror = () => reject(request.error);
        });
      })
    );
  }

  getExpenses(): Observable<Expense[]> {
    return from(
      this.dbReady.then(() => {
        return new Promise<Expense[]>((resolve, reject) => {
          if (!this.db) {
            reject(new Error('Database not initialized'));
            return;
          }

          const transaction = this.db.transaction('expenses', 'readonly');
          const store = transaction.objectStore('expenses');
          const request = store.getAll();

          request.onsuccess = () => {
            const expenses = request.result.map(expense => ({
              ...expense,
              date: new Date(expense.date)
            }));
            resolve(expenses);
          };
          request.onerror = () => reject(request.error);
        });
      })
    );
  }

  getExpensesByDateRange(startDate: Date, endDate: Date): Observable<Expense[]> {
    return from(
      this.dbReady.then(() => {
        return new Promise<Expense[]>((resolve, reject) => {
          if (!this.db) {
            reject(new Error('Database not initialized'));
            return;
          }

          const transaction = this.db.transaction('expenses', 'readonly');
          const store = transaction.objectStore('expenses');
          const request = store.getAll();

          request.onsuccess = () => {
            // Filtrar las fechas manualmente ya que IDBKeyRange no funciona bien con fechas
            const expenses = request.result
              .map(expense => ({
                ...expense,
                date: new Date(expense.date)
              }))
              .filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate >= startDate && expenseDate <= endDate;
              });
            resolve(expenses);
          };
          request.onerror = () => reject(request.error);
        });
      })
    );
  }

  getExpensesByDepartment(departmentId: string): Observable<Expense[]> {
    return from(
      this.dbReady.then(() => {
        return new Promise<Expense[]>((resolve, reject) => {
          if (!this.db) {
            reject(new Error('Database not initialized'));
            return;
          }

          const transaction = this.db.transaction('expenses', 'readonly');
          const store = transaction.objectStore('expenses');
          const index = store.index('departmentId');
          const request = index.getAll(departmentId);

          request.onsuccess = () => {
            const expenses = request.result.map(expense => ({
              ...expense,
              date: new Date(expense.date)
            }));
            resolve(expenses);
          };
          request.onerror = () => reject(request.error);
        });
      })
    );
  }
}
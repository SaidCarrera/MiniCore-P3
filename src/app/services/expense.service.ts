import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { Expense } from '../models/expense.model';

/**
 * SOLID - Single Responsibility Principle (SRP)
 * Este servicio tiene una única responsabilidad: manejar las operaciones
 * relacionadas con los gastos y su comunicación con el backend.
 * 
 * SOLID - Dependency Inversion Principle (DIP)
 * El servicio depende de abstracciones (HttpClient) y no de implementaciones concretas.
 * La inyección de dependencias se realiza a través del constructor.
 */
@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  /**
   * Factory Pattern
   * Los métodos del servicio actúan como una fábrica que crea
   * y configura las peticiones HTTP, encapsulando los detalles
   * de implementación y proporcionando una interfaz limpia.
   */
  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/expenses`).pipe(
      tap(expenses => console.log('Fetched expenses:', expenses)),
      catchError(error => {
        console.error('Error fetching expenses:', error);
        throw error;
      })
    );
  }

  getExpensesByDateRange(startDate: Date, endDate: Date): Observable<Expense[]> {
    return this.http.get<Expense[]>(
      `${this.apiUrl}/expenses/range?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
    ).pipe(
      tap(expenses => console.log('Fetched expenses by date range:', expenses)),
      catchError(error => {
        console.error('Error fetching expenses by date range:', error);
        throw error;
      })
    );
  }

  addExpense(expense: Omit<Expense, 'id'>): Observable<Expense> {
    console.log('Sending expense data:', expense);
    return this.http.post<Expense>(`${this.apiUrl}/expenses`, expense).pipe(
      tap(savedExpense => console.log('Saved expense:', savedExpense)),
      catchError(error => {
        console.error('Error saving expense:', error);
        throw error;
      })
    );
  }

  getExpensesByDepartment(departmentId: number): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/expenses/department/${departmentId}`).pipe(
      tap(expenses => console.log('Fetched expenses by department:', expenses)),
      catchError(error => {
        console.error('Error fetching expenses by department:', error);
        throw error;
      })
    );
  }
}
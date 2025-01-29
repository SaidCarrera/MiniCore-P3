import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import { Expense, Employee, Department } from '../../models/employee.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="expense-list">
      <h2>Expenses List</h2>
      
      <div class="filters">
        <div class="date-range">
          <label>From:</label>
          <input 
            type="date" 
            [(ngModel)]="startDate" 
            class="date-input"
          >
          <label>To:</label>
          <input 
            type="date" 
            [(ngModel)]="endDate" 
            class="date-input"
          >
          <button (click)="filterByDate()" class="filter-button">Filter</button>
          <button (click)="resetFilter()" class="reset-button">Reset</button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Employee</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let expense of expenses">
            <td>{{expense.date | date:'dd/MM/yyyy'}}</td>
            <td>{{expense.description}}</td>
            <td>{{expense.amount | currency}}</td>
            <td>{{getEmployeeName(expense.employeeId)}}</td>
            <td>{{getDepartmentName(expense.departmentId)}}</td>
          </tr>
          <tr *ngIf="expenses.length === 0">
            <td colspan="5" class="no-data">No expenses found</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .expense-list {
      margin: 20px;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .filters {
      margin-bottom: 20px;
    }
    
    .date-range {
      display: flex;
      gap: 10px;
      align-items: center;
      margin-bottom: 20px;
    }

    .date-input {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .filter-button, .reset-button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .filter-button {
      background-color: #007bff;
      color: white;
    }

    .reset-button {
      background-color: #6c757d;
      color: white;
    }

    .filter-button:hover {
      background-color: #0056b3;
    }

    .reset-button:hover {
      background-color: #5a6268;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    
    th {
      background-color: #f8f9fa;
      font-weight: 600;
    }

    tr:hover {
      background-color: #f5f5f5;
    }

    .no-data {
      text-align: center;
      color: #666;
      padding: 20px;
    }
  `]
})
export class ExpenseListComponent implements OnInit, OnDestroy {
  expenses: Expense[] = [];
  startDate: string = '';
  endDate: string = '';
  employees: Map<string, string> = new Map();
  departments: Map<string, string> = new Map();
  private destroy$ = new Subject<void>();

  constructor(
    private expenseService: ExpenseService,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit() {
    this.loadExpenses();
    this.loadEmployees();
    this.loadDepartments();

    // Escuchar el evento de nuevo gasto
    window.addEventListener('expense-added', () => this.loadExpenses());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadExpenses() {
    this.expenseService.getExpenses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.expenses = data;
        },
        error: (error) => {
          console.error('Error loading expenses', error);
        }
      });
  }

  loadEmployees() {
    this.employeeService.getEmployees()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (employees) => {
          employees.forEach(emp => {
            this.employees.set(emp.id, emp.name);
          });
        },
        error: (error) => {
          console.error('Error loading employees', error);
        }
      });
  }

  loadDepartments() {
    this.departmentService.getDepartments()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (departments) => {
          departments.forEach(dept => {
            this.departments.set(dept.id, dept.name);
          });
        },
        error: (error) => {
          console.error('Error loading departments', error);
        }
      });
  }

  filterByDate() {
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      
      // Ajustar la hora de fin a 23:59:59
      end.setHours(23, 59, 59, 999);

      this.expenseService.getExpensesByDateRange(start, end)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            this.expenses = data;
          },
          error: (error) => {
            console.error('Error filtering expenses', error);
          }
        });
    }
  }

  resetFilter() {
    this.startDate = '';
    this.endDate = '';
    this.loadExpenses();
  }

  getEmployeeName(id: string): string {
    return this.employees.get(id) || 'Unknown Employee';
  }

  getDepartmentName(id: string): string {
    return this.departments.get(id) || 'Unknown Department';
  }
}
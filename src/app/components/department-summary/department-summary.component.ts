import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../services/expense.service';
import { DepartmentService } from '../../services/department.service';
import { Department, Expense } from '../../models/employee.model';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface DepartmentSummary {
  id: string;
  name: string;
  totalAmount: number;
  expenseCount: number;
}

@Component({
  selector: 'app-department-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="department-summary">
      <h2>Department Expense Summary</h2>
      
      <div class="summary-cards">
        <div class="card" *ngFor="let summary of departmentSummaries">
          <h3>{{summary.name}}</h3>
          <p class="amount">{{summary.totalAmount | currency}}</p>
          <p class="expense-count">
            Total expenses: {{summary.expenseCount}}
          </p>
        </div>
        <div *ngIf="departmentSummaries.length === 0" class="no-data">
          No department data available
        </div>
      </div>

      <div *ngIf="error" class="error-message">
        {{error}}
      </div>
    </div>
  `,
  styles: [`
    .department-summary {
      margin: 20px;
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    h2 {
      margin-bottom: 20px;
      color: #333;
      font-size: 1.5rem;
    }
    
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    
    .card {
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      text-align: center;
      transition: all 0.3s ease;
      background: #ffffff;
    }
    
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    h3 {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 1.2rem;
    }
    
    .amount {
      font-size: 28px;
      font-weight: bold;
      color: #007bff;
      margin: 10px 0;
    }

    .expense-count {
      font-size: 0.9rem;
      color: #666;
      margin: 5px 0 0 0;
    }

    .no-data {
      grid-column: 1 / -1;
      text-align: center;
      padding: 30px;
      color: #666;
      border: 2px dashed #ddd;
      border-radius: 8px;
      font-size: 1.1rem;
    }

    .error-message {
      margin-top: 20px;
      padding: 12px;
      background-color: #fff3f3;
      border: 1px solid #ffcdd2;
      border-radius: 4px;
      color: #d32f2f;
      text-align: center;
    }

    @media (max-width: 768px) {
      .summary-cards {
        grid-template-columns: 1fr;
      }
      
      .card {
        margin-bottom: 15px;
      }
    }
  `]
})
export class DepartmentSummaryComponent implements OnInit, OnDestroy {
  departmentSummaries: DepartmentSummary[] = [];
  private destroy$ = new Subject<void>();
  error: string | null = null;

  constructor(
    private expenseService: ExpenseService,
    private departmentService: DepartmentService
  ) {
    // Escuchar el evento de nuevo gasto
    window.addEventListener('expense-added', () => this.loadDepartmentSummaries());
  }

  ngOnInit() {
    this.loadDepartmentSummaries();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDepartmentSummaries() {
    this.error = null;
    this.departmentSummaries = [];

    this.departmentService.getDepartments()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (departments: Department[]) => {
          const expenseObservables = departments.map(dept => 
            this.expenseService.getExpensesByDepartment(dept.id)
          );

          forkJoin(expenseObservables)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (expensesArray) => {
                departments.forEach((dept, index) => {
                  const expenses = expensesArray[index];
                  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
                  
                  this.departmentSummaries.push({
                    id: dept.id,
                    name: dept.name,
                    totalAmount,
                    expenseCount: expenses.length
                  });
                });

                // Ordenar por monto total descendente
                this.departmentSummaries.sort((a, b) => b.totalAmount - a.totalAmount);
              },
              error: (error) => {
                console.error('Error loading expenses:', error);
                this.error = 'Error loading department expenses. Please try again later.';
              }
            });
        },
        error: (error) => {
          console.error('Error loading departments:', error);
          this.error = 'Error loading departments. Please try again later.';
        }
      });
  }
}
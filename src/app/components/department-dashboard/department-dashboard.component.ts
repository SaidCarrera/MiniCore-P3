import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { CommonModule } from '@angular/common';

interface DepartmentExpense {
  departmentId: number;
  totalAmount: number;
}

@Component({
  selector: 'app-department-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h2>Department Expenses Dashboard</h2>
      <div class="dashboard-grid">
        <div *ngFor="let dept of departmentExpenses" class="dashboard-card">
          <h3>Department {{dept.departmentId}}</h3>
          <p class="amount">{{dept.totalAmount | currency}}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 20px;
      background-color: #f8f9fa;
      border-radius: 8px;
      margin: 20px 0;
    }
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .dashboard-card {
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
    }
    .amount {
      font-size: 24px;
      font-weight: bold;
      color: #28a745;
      margin: 10px 0;
    }
    h3 {
      margin: 0;
      color: #495057;
    }
  `]
})
export class DepartmentDashboardComponent implements OnInit {
  departmentExpenses: DepartmentExpense[] = [];

  constructor(private expenseService: ExpenseService) {}

  ngOnInit() {
    this.loadDepartmentExpenses();
  }

  loadDepartmentExpenses() {
    this.expenseService.getExpenses().subscribe(expenses => {
      // Agrupar y sumar gastos por departamento
      const expensesByDepartment = expenses.reduce((acc, expense) => {
        const existing = acc.find(item => item.departmentId === expense.departmentId);
        if (existing) {
          existing.totalAmount += expense.amount;
        } else {
          acc.push({
            departmentId: expense.departmentId,
            totalAmount: expense.amount
          });
        }
        return acc;
      }, [] as DepartmentExpense[]);

      this.departmentExpenses = expensesByDepartment.sort((a, b) => 
        a.departmentId - b.departmentId
      );
    });
  }
}
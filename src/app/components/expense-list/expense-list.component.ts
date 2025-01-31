import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="expense-list">
      <h2>Expenses List</h2>
      
      <div class="date-filter">
        <label>
          Start Date:
          <input type="date" [(ngModel)]="startDate" (change)="filterExpenses()">
        </label>
        <label>
          End Date:
          <input type="date" [(ngModel)]="endDate" (change)="filterExpenses()">
        </label>
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Employee ID</th>
            <th>Department ID</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let expense of expenses">
            <td>{{expense.date | date}}</td>
            <td>{{expense.description}}</td>
            <td>{{expense.amount | currency}}</td>
            <td>{{expense.employeeId}}</td>
            <td>{{expense.departmentId}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .expense-list {
      padding: 20px;
    }
    .date-filter {
      margin-bottom: 20px;
    }
    .date-filter label {
      margin-right: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 8px;
      border: 1px solid #ddd;
      text-align: left;
    }
    th {
      background-color: #f4f4f4;
    }
  `]
})
export class ExpenseListComponent implements OnInit {
  expenses: Expense[] = [];
  startDate: string = '';
  endDate: string = '';

  constructor(private expenseService: ExpenseService) {}

  ngOnInit() {
    this.loadExpenses();
  }

  loadExpenses() {
    this.expenseService.getExpenses().subscribe(
      expenses => this.expenses = expenses
    );
  }

  filterExpenses() {
    if (this.startDate && this.endDate) {
      this.expenseService.getExpensesByDateRange(
        new Date(this.startDate),
        new Date(this.endDate)
      ).subscribe(
        expenses => this.expenses = expenses
      );
    }
  }
}
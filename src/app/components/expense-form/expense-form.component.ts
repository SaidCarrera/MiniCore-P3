import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="expense-form">
      <h2>Add New Expense</h2>
      <form [formGroup]="expenseForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="date">Date:</label>
          <input type="date" id="date" formControlName="date">
        </div>

        <div class="form-group">
          <label for="description">Description:</label>
          <input type="text" id="description" formControlName="description">
        </div>

        <div class="form-group">
          <label for="amount">Amount:</label>
          <input type="number" id="amount" formControlName="amount">
        </div>

        <div class="form-group">
          <label for="employeeId">Employee ID:</label>
          <input type="number" id="employeeId" formControlName="employeeId">
        </div>

        <div class="form-group">
          <label for="departmentId">Department ID:</label>
          <input type="number" id="departmentId" formControlName="departmentId">
        </div>

        <button type="submit" [disabled]="!expenseForm.valid">Submit</button>
      </form>
    </div>
  `,
  styles: [`
    .expense-form {
      padding: 20px;
      max-width: 500px;
      margin: 0 auto;
    }
    .form-group {
      margin-bottom: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
    }
    input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    button {
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:disabled {
      background-color: #cccccc;
    }
  `]
})
export class ExpenseFormComponent {
  expenseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService
  ) {
    this.expenseForm = this.fb.group({
      date: ['', Validators.required],
      description: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      employeeId: ['', Validators.required],
      departmentId: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      this.expenseService.addExpense(this.expenseForm.value).subscribe(
        response => {
          console.log('Expense added successfully', response);
          this.expenseForm.reset();
        },
        error => {
          console.error('Error adding expense', error);
        }
      );
    }
  }
}
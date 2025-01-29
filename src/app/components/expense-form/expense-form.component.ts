import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import { Employee, Department } from '../../models/employee.model';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="expense-form">
      <h2>Register New Expense</h2>
      <form [formGroup]="expenseForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="description">Description</label>
          <input id="description" type="text" formControlName="description">
          <div *ngIf="expenseForm.get('description')?.errors?.['required'] && expenseForm.get('description')?.touched" class="error-message">
            Description is required
          </div>
        </div>
        
        <div class="form-group">
          <label for="amount">Amount</label>
          <input id="amount" type="number" formControlName="amount">
          <div *ngIf="expenseForm.get('amount')?.errors?.['required'] && expenseForm.get('amount')?.touched" class="error-message">
            Amount is required
          </div>
          <div *ngIf="expenseForm.get('amount')?.errors?.['min']" class="error-message">
            Amount must be greater than 0
          </div>
        </div>
        
        <div class="form-group">
          <label for="date">Date</label>
          <input id="date" type="date" formControlName="date">
          <div *ngIf="expenseForm.get('date')?.errors?.['required'] && expenseForm.get('date')?.touched" class="error-message">
            Date is required
          </div>
        </div>
        
        <div class="form-group">
          <label for="employeeId">Employee</label>
          <select id="employeeId" formControlName="employeeId">
            <option value="">Select Employee</option>
            <option *ngFor="let employee of employees" [value]="employee.id">
              {{employee.name}}
            </option>
          </select>
          <div *ngIf="expenseForm.get('employeeId')?.errors?.['required'] && expenseForm.get('employeeId')?.touched" class="error-message">
            Employee is required
          </div>
        </div>
        
        <div class="form-group">
          <label for="departmentId">Department</label>
          <select id="departmentId" formControlName="departmentId">
            <option value="">Select Department</option>
            <option *ngFor="let department of departments" [value]="department.id">
              {{department.name}}
            </option>
          </select>
          <div *ngIf="expenseForm.get('departmentId')?.errors?.['required'] && expenseForm.get('departmentId')?.touched" class="error-message">
            Department is required
          </div>
        </div>
        
        <button type="submit" [disabled]="!expenseForm.valid">Submit</button>
      </form>

      <div *ngIf="successMessage" class="success-message">
        {{successMessage}}
      </div>
      <div *ngIf="errorMessage" class="error-message">
        {{errorMessage}}
      </div>
    </div>
  `,
  styles: [`
    .expense-form {
      max-width: 500px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
    }
    
    input, select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    button {
      background-color: #007bff;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    button:disabled {
      background-color: #ccc;
    }

    .success-message {
      color: green;
      margin-top: 10px;
      padding: 10px;
      background-color: #e8f5e9;
      border-radius: 4px;
    }

    .error-message {
      color: red;
      margin-top: 10px;
      padding: 10px;
      background-color: #ffebee;
      border-radius: 4px;
    }
  `]
})
export class ExpenseFormComponent implements OnInit {
  expenseForm: FormGroup;
  employees: Employee[] = [];
  departments: Department[] = [];
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService
  ) {
    this.expenseForm = this.fb.group({
      description: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      date: ['', Validators.required],
      employeeId: ['', Validators.required],
      departmentId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadEmployees();
    this.loadDepartments();
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
      },
      error: (error) => {
        console.error('Error loading employees', error);
        this.errorMessage = 'Error loading employees';
      }
    });
  }

  loadDepartments() {
    this.departmentService.getDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
      },
      error: (error) => {
        console.error('Error loading departments', error);
        this.errorMessage = 'Error loading departments';
      }
    });
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      const formValue = this.expenseForm.value;
      
      // Asegurar que la fecha es un objeto Date
      const expense = {
        ...formValue,
        date: new Date(formValue.date),
        amount: Number(formValue.amount)
      };

      this.expenseService.addExpense(expense).subscribe({
        next: (response) => {
          console.log('Expense added successfully', response);
          this.successMessage = 'Expense saved successfully';
          this.expenseForm.reset();
          setTimeout(() => this.successMessage = '', 3000);
          
          // Disparar un evento personalizado para notificar la actualización
          window.dispatchEvent(new CustomEvent('expense-added'));
        },
        error: (error) => {
          console.error('Error adding expense', error);
          this.errorMessage = 'Error saving expense';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }
}
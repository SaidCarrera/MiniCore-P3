import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="employee-form">
      <h2>Registrar Nuevo Empleado</h2>
      <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="name">Nombre</label>
          <input id="name" type="text" formControlName="name">
          <div *ngIf="employeeForm.get('name')?.errors?.['required'] && employeeForm.get('name')?.touched">
            El nombre es requerido
          </div>
        </div>
        
        <button type="submit" [disabled]="!employeeForm.valid">Guardar Empleado</button>
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
    .employee-form {
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
    
    input {
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
export class EmployeeFormComponent {
  employeeForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      this.employeeService.addEmployee(this.employeeForm.value).subscribe({
        next: (response) => {
          console.log('Empleado agregado exitosamente', response);
          this.successMessage = 'Empleado guardado exitosamente';
          this.employeeForm.reset();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error al agregar empleado', error);
          this.errorMessage = 'Error al guardar el empleado';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }
}
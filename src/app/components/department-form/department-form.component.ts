import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DepartmentService } from '../../services/department.service';

@Component({
  selector: 'app-department-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="department-form">
      <h2>Registrar Nuevo Departamento</h2>
      <form [formGroup]="departmentForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="name">Nombre del Departamento</label>
          <input id="name" type="text" formControlName="name">
          <div *ngIf="departmentForm.get('name')?.errors?.['required'] && departmentForm.get('name')?.touched">
            El nombre del departamento es requerido
          </div>
        </div>
        
        <button type="submit" [disabled]="!departmentForm.valid">Guardar Departamento</button>
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
    .department-form {
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
export class DepartmentFormComponent {
  departmentForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService
  ) {
    this.departmentForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.departmentForm.valid) {
      this.departmentService.addDepartment(this.departmentForm.value).subscribe({
        next: (response) => {
          console.log('Departamento agregado exitosamente', response);
          this.successMessage = 'Departamento guardado exitosamente';
          this.departmentForm.reset();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error al agregar departamento', error);
          this.errorMessage = 'Error al guardar el departamento';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }
}
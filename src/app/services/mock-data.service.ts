import { Injectable } from '@angular/core';
import { Employee, Department, Expense } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private employees: Employee[] = [
    { id: '1', name: 'Juan Pérez' },
    { id: '2', name: 'María García' },
    { id: '3', name: 'Carlos López' },
    { id: '4', name: 'Ana Martínez' }
  ];

  private departments: Department[] = [
    { id: '1', name: 'IT' },
    { id: '2', name: 'HR' },
    { id: '3', name: 'Finance' },
    { id: '4', name: 'Marketing' }
  ];

  private expenses: Expense[] = [
    {
      id: '1',
      date: new Date('2024-01-15'),
      description: 'Equipos de computación',
      amount: 1500.00,
      employeeId: '1',
      departmentId: '1'
    },
    {
      id: '2',
      date: new Date('2024-01-20'),
      description: 'Capacitación personal',
      amount: 800.00,
      employeeId: '2',
      departmentId: '2'
    },
    {
      id: '3',
      date: new Date('2024-01-25'),
      description: 'Software financiero',
      amount: 2000.00,
      employeeId: '3',
      departmentId: '3'
    },
    {
      id: '4',
      date: new Date('2024-02-01'),
      description: 'Campaña publicitaria',
      amount: 1200.00,
      employeeId: '4',
      departmentId: '4'
    }
  ];

  getEmployees(): Employee[] {
    return this.employees;
  }

  getDepartments(): Department[] {
    return this.departments;
  }

  getExpenses(): Expense[] {
    return this.expenses;
  }
}
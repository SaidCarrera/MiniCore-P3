import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import { IndexedDBService } from './indexeddb.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private indexedDB: IndexedDBService) {}

  getEmployees(): Observable<Employee[]> {
    return this.indexedDB.getEmployees();
  }

  addEmployee(employee: Omit<Employee, 'id'>): Observable<Employee> {
    return this.indexedDB.addEmployee(employee);
  }
}
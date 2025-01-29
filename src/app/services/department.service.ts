import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Department } from '../models/employee.model';
import { IndexedDBService } from './indexeddb.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  constructor(private indexedDB: IndexedDBService) {}

  getDepartments(): Observable<Department[]> {
    return this.indexedDB.getDepartments();
  }

  addDepartment(department: Omit<Department, 'id'>): Observable<Department> {
    return this.indexedDB.addDepartment(department);
  }
}
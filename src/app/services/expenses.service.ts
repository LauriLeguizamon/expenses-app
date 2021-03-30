import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Expense } from '../interfaces/expense';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getExpenses() {
    return this.http.get<Expense[]>(`${environment.apiUrl}/expenses?user_id=${this.authService.user.id}`);
  }

  updateExpense(newExpense: Expense) {
    return this.http.put<Expense[]>(`${environment.apiUrl}/expenses/${newExpense.id}`, {
      "expense": {
        "name": newExpense.name,
        "description": newExpense.description,
        "type": newExpense.type,
        "ammount": newExpense.ammount,
      }
    })
  }

  deleteExpense(id: number) {
    return this.http.delete(`${environment.apiUrl}/expenses/${id}`)
  }

  addExpense(expense: Expense) {
    console.log(expense)
    return this.http.post<Expense>(`${environment.apiUrl}/expenses`, {
      "expense": {
        "description": expense.description,
        "name": expense.name,
        "type": expense.type,
        "ammount": expense.ammount,
        "user_id": this.authService.user.id
      }
    })
  }

  updateTotalBudget(totalBudget: number) {
    return this.http.put<User>(`${environment.apiUrl}/users/${this.authService.user.id}`, {
      "user": {
        "total_budget": totalBudget
      }
    })
  }
}

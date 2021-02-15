import { Injectable } from '@angular/core';
import { Expense } from '../interfaces/expense';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  expenses: Expense[] = [
    // {
    //   id: 1,
    //   name: 'Laundry',
    //   description: 'I wash my clothes',
    //   ammount: 200,
    //   type: 'outcome'
    // },
    // {
    //   id: 2,
    //   name: 'Food',
    //   description: 'McDonnals',
    //   ammount: 400,
    //   type: 'outcome'
    // },
    // {
    //   id: 3,
    //   name: 'Mouse',
    //   description: 'g203 gaming mouse',
    //   ammount: 3500,
    //   type: 'outcome'
    // },
    // {
    //   id: 4,
    //   name: 'Web Work',
    //   description: 'e-commerce for santi',
    //   ammount: 5000,
    //   type: 'income'
    // }
  ];

  constructor() { }

  getExpenses() {
    return this.expenses;
  }

  updateExpense(expense: Expense) {
  }

  deleteExpense(index: number) {
    this.expenses.splice(index, 1);
  }

  addExpense(expense: Expense) {
    this.expenses.push(expense);
  }
}

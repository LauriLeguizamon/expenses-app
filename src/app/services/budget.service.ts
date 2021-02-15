import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  totalBudget: number = 0;

  constructor() {}

  getBudget() {
    return this.totalBudget;
  }

  addBudget(ammount: number) {
    console.log(this.totalBudget);
    this.totalBudget += ammount
    console.log(this.totalBudget);
    return this.totalBudget;
  }

  subtractBudget(ammount: number) {
    this.totalBudget -= ammount
    return this.totalBudget;
  }
}

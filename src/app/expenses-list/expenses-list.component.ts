import { Component, OnInit } from '@angular/core';
import { Expense } from '../interfaces/expense';
import { ExpensesService } from '../services/expenses.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BudgetService } from '../services/budget.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss'],
})
export class ExpensesListComponent implements OnInit {
  expenses: Expense[];
  expenseEdited: Expense;
  expenseForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    ammount: [0, [Validators.required, Validators.min(1)]],
  });
  editingExpense: boolean = false;
  radioValue: 'income' | 'outcome';
  totalBudget: number;
  outcomeRadio: HTMLInputElement;
  incomeRadio: HTMLInputElement;
  radioNotificationAlert: boolean;

  constructor(
    private expensesService: ExpensesService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.loginUserById().subscribe((user) => {
      if (user === null) {
        this.router.navigate(['/login']);
      }

      this.authService.user = user;
      this.totalBudget = user.totalBudget;
      this.changeColor();
      this.expensesService.getExpenses().subscribe((expenses) => {
        this.expenses = expenses;
      });
    });

    this.outcomeRadio = document.getElementById('outcome') as HTMLInputElement;
    this.incomeRadio = document.getElementById('income') as HTMLInputElement;
  }

  deleteExpense(expense: Expense, index: number) {
    if (confirm('Are you sure?')) {
      this.expensesService.deleteExpense(expense.id).subscribe();
      this.expenses.splice(index, 1);
      if (expense.type === 'income') {
        this.subtractBudget(expense.ammount);
      } else {
        this.addBudget(expense.ammount);
      }
      console.log(expense);
    }
    this.changeColor();
  }

  addExpense() {
    if (this.radioValue !== undefined || null) {
      const newExpense: Expense = {
        ...this.expenseForm.value,
        type: this.radioValue,
        user_id: this.authService.user.id,
      };
      this.expensesService.addExpense(newExpense).subscribe((e) => {
        this.expenses.push(e);
      });
      if (newExpense.type === 'income') {
        this.addBudget(newExpense.ammount);
      } else {
        this.subtractBudget(newExpense.ammount);
      }

      this.changeColor();
      this.radioNotificationAlert = false;
      this.expenseForm.reset();
      return;
    }
    this.radioNotificationAlert = true;
  }

  editExpense(expense: Expense) {
    this.editingExpense = true;
    this.expenseForm.get('name').setValue(expense.name);
    this.expenseForm.get('description').setValue(expense.description);
    this.expenseForm.get('ammount').setValue(expense.ammount);
    if (expense.type === 'income') {
      this.incomeRadio.checked = true;
    } else {
      this.outcomeRadio.checked = true;
    }
    this.expenseEdited = expense;
    this.changeColor();
  }

  onRadioChange(event) {
    this.radioValue = event.target.value;
  }

  edit() {
    this.checkRadio();
    let finalExpense: Expense = {
      ...this.expenseForm.value,
      type: this.radioValue,
    };
    const index = this.expenses.findIndex(
      (e) => e.id === this.expenseEdited.id
      );
    finalExpense = {...finalExpense, id: this.expenses[index].id}
    this.expenses[index] = finalExpense;
    this.expensesService.updateExpense(finalExpense).subscribe();

    if (
      this.expenseEdited.type === 'outcome' &&
      finalExpense.type === 'income'
    ) {
      let finalAmmount = this.expenseEdited.ammount + finalExpense.ammount
      this.addBudget(finalAmmount);
    } else if (
      this.expenseEdited.type === 'income' &&
      finalExpense.type === 'outcome'
    ) {
      let finalAmmount = this.expenseEdited.ammount + finalExpense.ammount
      this.subtractBudget(finalAmmount);
    } else if (
      this.expenseEdited.type === 'income' &&
      finalExpense.type === 'income'
    ) {
      this.subtractBudget(this.expenseEdited.ammount);
      this.addBudget(finalExpense.ammount);
    } else if (
      this.expenseEdited.type === 'outcome' &&
      finalExpense.type === 'outcome'
    ) {
      this.addBudget(this.expenseEdited.ammount);
      this.subtractBudget(finalExpense.ammount);
    }

    this.editingExpense = false;
    this.changeColor();
    this.expenseForm.reset();
  }

  addBudget(ammount: number) {
    this.totalBudget += ammount;
    this.expensesService.updateTotalBudget(this.totalBudget).subscribe();
  }

  subtractBudget(ammount: number) {
    this.totalBudget -= ammount;
    this.expensesService.updateTotalBudget(this.totalBudget).subscribe();
  }

  changeColor() {
    if (this.totalBudget < 0) {
      document.getElementById('balance').style.color = 'red';
    } else {
      document.getElementById('balance').style.color = 'green';
    }
  }

  checkRadio() {
    if (this.incomeRadio.checked) {
      this.radioValue = 'income';
    } else {
      this.radioValue = 'outcome';
    }
  }

  cancelEdit() {
    this.expenseForm.reset();
    this.editingExpense = false;
  }
}

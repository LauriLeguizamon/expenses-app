import { Component, OnInit } from '@angular/core';
import { Expense } from '../interfaces/expense';
import { ExpensesService } from '../services/expenses.service';
import { FormBuilder, FormGroup } from '@angular/forms'
import { BudgetService } from '../services/budget.service';

@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss']
})
export class ExpensesListComponent implements OnInit {
  expenses: Expense[]
  expenseEdited: Expense;
  expenseForm: FormGroup = this.fb.group({
    id: [0],
    name: [''],
    description: [''],
    ammount: [0],
  })
  editingExpense: boolean = false;
  radioValue: 'income' | 'outcome';
  totalBudget: number;
  outcomeRadio = document.getElementById('outcome') as HTMLInputElement;
  incomeRadio = document.getElementById('income') as HTMLInputElement;
  
  constructor(private expensesService: ExpensesService, private fb: FormBuilder, private budgetService: BudgetService) { }

  ngOnInit(): void {
    this.expenses = this.expensesService.getExpenses();
    this.totalBudget = this.budgetService.getBudget()
    this.changeColor();
  }
  
  deleteExpense(expense: Expense, index: number) {
    if (confirm('Are you sure?')) {
      this.expensesService.deleteExpense(index);
      this.expensesService.getExpenses();
      this.subtractBudget(expense.ammount);
      console.log(expense);
    }
    this.changeColor();
  }

  addExpense() {
    const newExpense = {...this.expenseForm.value, type: this.radioValue};
    this.expensesService.addExpense(newExpense);
    this.expenses = this.expensesService.getExpenses();
    if(newExpense.type === 'income') {
      this.addBudget(newExpense.ammount);
    } else {
      this.subtractBudget(newExpense.ammount);
    }
      
    this.changeColor();
    this.expenseForm.reset();
  }

  editExpense(expense: Expense) {
    this.editingExpense = true;
    this.expenseForm.get('id').setValue(expense.id)
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
    this.radioValue = event.target.value
  }

  edit() {
    this.checkRadio()
    const finalExpense: Expense = {...this.expenseForm.value, type: this.radioValue};
    const index = this.expenses.findIndex( e => e.id === this.expenseEdited.id);
    this.expenses[index] = finalExpense;
    this.editingExpense = false;
    console.log(this.expenses);

    // const temporalCorrectionExpense = finalExpense.ammount * 2;
    // if (this.expenseEdited.type === finalExpense.type) {
    //   this.subtractBudget(this.expenseEdited.ammount);
    //   this.addBudget(finalExpense.ammount);
    // } else if (finalExpense.type === 'income'){
    //   this.addBudget(temporalCorrectionExpense);
    // } else {
    //   this.subtractBudget(temporalCorrectionExpense);
    // }

    // console.log(this.expenseEdited.ammount);
    // console.log(finalExpense.ammount);
    // console.log(finalExpense.type);
    if (finalExpense.type === 'income') {
      this.addBudget(finalExpense.ammount * 2);
    } else {
      console.log('estas aca en outcome')
      this.subtractBudget(this.expenseEdited.ammount);
      this.subtractBudget(finalExpense.ammount);
    }

    this.changeColor();
    this.expenseForm.reset();
  }

  addBudget(ammount: number) {
    this.totalBudget = this.budgetService.addBudget(ammount);
  }

  subtractBudget(ammount: number) {
    this.totalBudget = this.budgetService.subtractBudget(ammount);
  }

  changeColor() {
    if (this.totalBudget < 0) {
      document.getElementById("balance").style.color = "red"
    } else {
      document.getElementById("balance").style.color = "green"
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

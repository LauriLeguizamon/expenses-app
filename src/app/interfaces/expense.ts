export interface Expense {
    id: number;
    name: string;
    description: string;
    ammount: number;
    type: 'outcome' | 'income';
}
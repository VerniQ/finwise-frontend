export interface Budget {
    id: number;
    totalBudgetLimit?: number;
    month: number;
    year: number;
    userId: number;
}

export interface Category {
    id: number;
    name: string;
}

export interface BudgetCategory {
    id: number;
    budgetId: number;
    categoryId: number;
    categoryBudgetLimit: number;
}

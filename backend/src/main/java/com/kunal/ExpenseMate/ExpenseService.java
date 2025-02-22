package com.kunal.ExpenseMate;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    @Autowired
    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    // ✅ Get all expenses
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    // ✅ Get expenses for a specific user
    public List<Expense> getExpensesByUser(Long userId) {
        return expenseRepository.findByUserId(userId);
    }

    // ✅ Add an expense
    public Expense addExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    // ✅ Delete an expense
    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }
}

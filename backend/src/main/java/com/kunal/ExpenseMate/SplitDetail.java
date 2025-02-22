package com.kunal.ExpenseMate;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class SplitDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String username;
    private double amount;

    // ✅ Prevent circular reference
    @ManyToOne
    @JoinColumn(name = "expense_id", nullable = false)
    @JsonBackReference
    private Expense expense;

    public SplitDetail() {}

    public SplitDetail(Long userId, String username, double amount, Expense expense) {
        this.userId = userId;
        this.username = username;
        this.amount = amount;
        this.expense = expense;
    }

    // ✅ Getters and Setters
    public Long getId() { return id; }
    public Long getUserId() { return userId; } // ✅ Ensuring this method exists
    public String getUsername() { return username; }
    public double getAmount() { return amount; }
    public Expense getExpense() { return expense; }

    public void setId(Long id) { this.id = id; }
    public void setUserId(Long userId) { this.userId = userId; } // ✅ Ensuring this method exists
    public void setUsername(String username) { this.username = username; } // ✅ Ensuring this method exists
    public void setAmount(double amount) { this.amount = amount; }
    public void setExpense(Expense expense) { this.expense = expense; }
}

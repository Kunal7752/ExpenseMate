package com.kunal.ExpenseMate;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

@Entity
public class Expense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Description is required")
    @Size(min = 3, max = 255, message = "Description must be between 3 and 255 characters")
    private String description;

    @Min(value = 0, message = "Amount must be a positive number")
    private double amount;

    // ✅ Prevent circular reference by ignoring user field in JSON serialization
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    @JsonIgnore
    private User user;

    // ✅ Prevent circular reference for multiple users involved
    @ManyToMany
    @JoinTable(
        name = "expense_users",
        joinColumns = @JoinColumn(name = "expense_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @JsonIgnore
    private List<User> users;

    // ✅ Correct One-to-Many Mapping with SplitDetail
    @OneToMany(mappedBy = "expense", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<SplitDetail> splitDetails;

    public Expense() {}

    public Expense(String description, double amount, User user) {
        this.description = description;
        this.amount = amount;
        this.user = user;
    }

    // ✅ Getters and Setters
    public Long getId() { return id; }
    public String getDescription() { return description; }
    public double getAmount() { return amount; }
    public User getUser() { return user; }
    public List<User> getUsers() { return users; }
    public List<SplitDetail> getSplitDetails() { return splitDetails; }

    public void setDescription(String description) { this.description = description; }
    public void setAmount(double amount) { this.amount = amount; }
    public void setUser(User user) { this.user = user; }
    public void setUsers(List<User> users) { this.users = users; }
    public void setSplitDetails(List<SplitDetail> splitDetails) { 
        this.splitDetails = splitDetails;
        if (splitDetails != null) {
            for (SplitDetail detail : splitDetails) {
                detail.setExpense(this);
            }
        }
    }
}

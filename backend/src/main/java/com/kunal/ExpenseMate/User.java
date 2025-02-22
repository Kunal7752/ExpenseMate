package com.kunal.ExpenseMate;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Username is required")
    @Column(unique = true)
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    // ✅ Ignore expenses in JSON response to prevent recursion
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Expense> expenses;

    public User() {}

    public User(String username, String password) {
        this.username = username;
        this.password = new BCryptPasswordEncoder().encode(password);
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public List<Expense> getExpenses() { return expenses; }

    public void setUsername(String username) { this.username = username; }
    public void setPassword(String password) {
        this.password = new BCryptPasswordEncoder().encode(password);
    }
    public void setExpenses(List<Expense> expenses) { this.expenses = expenses; }
}

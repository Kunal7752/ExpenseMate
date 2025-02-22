package com.kunal.ExpenseMate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kunal.ExpenseMate.Expense;
import com.kunal.ExpenseMate.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // ✅ Find a user by username
	Optional<User> findByUsername(String username);
    // ✅ Check if a username already exists (for registration validation)
    boolean existsByUsername(String username);

    // ✅ Find all expenses for a given user
    List<Expense> findExpensesById(Long userId);
}
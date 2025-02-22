package com.kunal.ExpenseMate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    // ✅ Fix: Find expenses where the user is involved in the split
    @Query("SELECT e FROM Expense e JOIN e.users u WHERE u.id = :userId")
    List<Expense> findByUserId(@Param("userId") Long userId);
}

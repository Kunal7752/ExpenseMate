package com.kunal.ExpenseMate;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "http://localhost:4200")
public class ExpenseController {

    private static final Logger logger = Logger.getLogger(ExpenseController.class.getName());
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ExpenseController(ExpenseRepository expenseRepository, UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    /**
     * ✅ Fetch all expenses OR expenses for a specific user
     */
    @GetMapping({"/user/{userId}", "/all"})
    public ResponseEntity<List<Expense>> getExpenses(@PathVariable(required = false) Long userId) {
        logger.info("Fetching expenses for user ID: " + (userId != null ? userId : "ALL USERS"));

        List<Expense> expenses;

        if (userId == null || userId == 0) {
            expenses = expenseRepository.findAll(); // ✅ Fetch all expenses if no userId is provided
        } else {
            Optional<User> user = userRepository.findById(userId);
            if (user.isEmpty()) {
                logger.warning("User ID not found: " + userId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
            }
            expenses = expenseRepository.findByUserId(userId);
        }

        // ✅ Fetch all users in one query for better performance
        List<User> allUsers = userRepository.findAll(); 
        Map<Long, String> userMap = allUsers.stream()
                .collect(Collectors.toMap(User::getId, User::getUsername)); // ✅ Create a map of userId → username

        // ✅ Ensure usernames are populated in split details
        expenses.forEach(expense -> {
            if (expense.getSplitDetails() != null) {
                expense.getSplitDetails().forEach(splitDetail -> {
                    splitDetail.setUsername(userMap.getOrDefault(splitDetail.getUserId(), "Unknown"));
                });
            }
        });

        return ResponseEntity.ok(expenses);
    }

    /**
     * ✅ Fetch a specific expense by ID
     */
    @GetMapping("/{expenseId}")
    public ResponseEntity<?> getExpenseById(@PathVariable Long expenseId) {
        logger.info("Fetching expense with ID: " + expenseId);
        Optional<Expense> expense = expenseRepository.findById(expenseId);

        if (expense.isPresent()) {
            return ResponseEntity.ok(expense.get());
        } else {
            logger.warning("Expense ID not found: " + expenseId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Expense not found");
        }
    }

    /**
     * ✅ Add an expense involving multiple users
     */
    @PostMapping("/add")
    public ResponseEntity<?> addExpense(@RequestBody ExpenseRequest expenseRequest) {
        logger.info("Received expense data | Description: " + expenseRequest.getDescription());

        // ✅ Fetch all users involved
        List<User> users = userRepository.findAllById(expenseRequest.getUserIds());
        if (users.isEmpty()) {
            logger.warning("Failed to add expense. No valid users found.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Users not found");
        }

        // ✅ Ensure at least one user exists for the expense
        User primaryUser = users.get(0);

        Expense expense = new Expense();
        expense.setDescription(expenseRequest.getDescription());
        expense.setAmount(expenseRequest.getAmount());
        expense.setUser(primaryUser);
        expense.setUsers(users);

        // ✅ Convert SplitDetails from request to entity objects
        List<SplitDetail> splitDetails = new ArrayList<>();
        for (SplitDetail requestDetail : expenseRequest.getSplitDetails()) {
            SplitDetail splitDetail = new SplitDetail();
            splitDetail.setUserId(requestDetail.getUserId());

            // ✅ Fetch username from DB if null
            Optional<User> user = userRepository.findById(requestDetail.getUserId());
            splitDetail.setUsername(user.map(User::getUsername).orElse("Unknown"));

            splitDetail.setAmount(requestDetail.getAmount());
            splitDetail.setExpense(expense);
            splitDetails.add(splitDetail);
        }

        expense.setSplitDetails(splitDetails); // ✅ Set split details

        Expense savedExpense = expenseRepository.save(expense);
        logger.info("Expense added successfully | Expense ID: " + savedExpense.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(savedExpense);
    }

    /**
     * ✅ Delete an expense by ID
     */
    @DeleteMapping("/{expenseId}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long expenseId) {
        logger.info("🗑️ Deleting expense ID: " + expenseId);

        // ✅ Check if the expense exists
        Optional<Expense> optionalExpense = expenseRepository.findById(expenseId);
        if (optionalExpense.isEmpty()) {
            logger.warning("❌ Expense ID not found: " + expenseId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Expense not found");
        }

        Expense expense = optionalExpense.get();

        // ✅ Unlink associated split details
        if (expense.getSplitDetails() != null) {
            expense.getSplitDetails().clear();
        }

        // ✅ Unlink associated users
        if (expense.getUsers() != null) {
            expense.getUsers().clear();
        }

        // ✅ Save changes before deletion (optional, for safe ORM handling)
        expenseRepository.save(expense);

        // ✅ Delete the expense
        expenseRepository.delete(expense);
        logger.info("✅ Expense ID " + expenseId + " deleted successfully");

        return ResponseEntity.ok("Expense deleted successfully");
    }
}

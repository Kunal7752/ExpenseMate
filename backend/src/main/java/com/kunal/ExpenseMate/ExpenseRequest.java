package com.kunal.ExpenseMate;

import java.util.List;

public class ExpenseRequest {
    private List<Long> userIds;  // ✅ List of User IDs involved in the expense
    private String description;
    private double amount;
    private String type;
    private List<SplitDetail> splitDetails; // ✅ Store individual user split details

    // ✅ Default Constructor
    public ExpenseRequest() {}

    // ✅ Parameterized Constructor
    public ExpenseRequest(List<Long> userIds, String description, double amount, String type, List<SplitDetail> splitDetails) {
        this.userIds = userIds;
        this.description = description;
        this.amount = amount;
        this.type = type;
        this.splitDetails = splitDetails;
    }

    // ✅ Getters and Setters
    public List<Long> getUserIds() {
        return userIds;
    }

    public void setUserIds(List<Long> userIds) {
        this.userIds = userIds;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<SplitDetail> getSplitDetails() {
        return splitDetails;
    }

    public void setSplitDetails(List<SplitDetail> splitDetails) {
        this.splitDetails = splitDetails;
    }

    @Override
    public String toString() {
        return "ExpenseRequest{" +
                "userIds=" + userIds +
                ", description='" + description + '\'' +
                ", amount=" + amount +
                ", type='" + type + '\'' +
                ", splitDetails=" + splitDetails +
                '}';
    }
}

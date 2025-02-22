package com.kunal.ExpenseMate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kunal.ExpenseMate.*;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> { }

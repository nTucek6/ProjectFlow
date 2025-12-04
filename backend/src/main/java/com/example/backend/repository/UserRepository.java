package com.example.backend.repository;

import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

    @Query("""
    SELECT u FROM User u
    WHERE lower(u.name) LIKE lower(concat('%', :search, '%'))
       OR lower(u.surname) LIKE lower(concat('%', :search, '%'))
       OR lower(concat(u.name, ' ', u.surname)) LIKE lower(concat('%', :search, '%'))
    """)
    List<User> searchUsers(@Param("search") String search);

}

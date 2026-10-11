package com.example.backend.repository;

import com.example.backend.entity.Users;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsersRepository extends JpaRepository<Users, Long> {

  Optional<Users> findByEmail(String email);

  boolean existsByEmail(String email);

  boolean existsByRole(String role);

  List<Users> findByRoleAndLastAccessedAtBefore(String role, LocalDateTime lastAccessedAt);
}

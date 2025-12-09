package com.example.qa_service;

import com.example.qa_service.model.Role;
import com.example.qa_service.model.User;
import com.example.qa_service.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void testSaveUser() {
        User user = new User("john", "john@example.com", "password", Role.ROLE_USER);
        userRepository.save(user);
        System.out.println("User saved: " + user.getUsername());
    }
}

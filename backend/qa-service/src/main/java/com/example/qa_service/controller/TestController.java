package com.example.qa_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/secure/hello")
    public String hello() {
        return "Hello, authenticated user!";
    }
}

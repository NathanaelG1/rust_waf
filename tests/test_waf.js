import http from "k6/http";
import { check } from "k6";

// Define the base URL for your WAF
const baseUrl = "http://localhost:3000"; // Modify this to your WAF URL

// Simulate valid and invalid test cases
export default function () {
  // Test case 1: Valid request
  let validRequest = http.get(`${baseUrl}/search?q=hello`);
  check(validRequest, {
    "Valid request status is 200": (r) => r.status === 200,
    "Valid request passes WAF": (r) =>
      r.body.includes("Request allowed by WAF"),
  });

  // Test case 2: Invalid request with SQL Injection
  let sqlInjectionRequest = http.get(`${baseUrl}/search?q=SELECT * FROM users`);
  check(sqlInjectionRequest, {
    "SQL injection request status is 403": (r) => r.status === 403,
    "SQL injection request blocked by WAF": (r) =>
      r.body.includes("Request blocked by WAF"),
  });

  // Test case 3: Invalid request with XSS
  let xssRequest = http.get(
    `${baseUrl}/search?q=<script>alert('XSS')</script>`,
  );
  check(xssRequest, {
    "XSS request status is 403": (r) => r.status === 403,
    "XSS request blocked by WAF": (r) =>
      r.body.includes("Request blocked by WAF"),
  });

  // Test case 4: Another valid request
  let anotherValidRequest = http.get(`${baseUrl}/profile?name=johndoe`);
  check(anotherValidRequest, {
    "Another valid request status is 200": (r) => r.status === 200,
    "Another valid request passes WAF": (r) =>
      r.body.includes("Request allowed by WAF"),
  });
}

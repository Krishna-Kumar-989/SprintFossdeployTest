Potential Backend Issues in FindIt Application (PR Sprint)

Total Base Points: 20
Bonus Points Available: 10

Objective:
Improve backend correctness, reliability, and developer experience of the FindIt application. Contributors may fix one or more issues independently.

Functionality & Reliability (15 Points)
1. Incorrect HTTP Status Code Usage

Description:
Several API endpoints return 200 OK even when requests fail due to validation errors, authorization failures, missing resources, or server errors.

Expected Fix:

Return semantically correct HTTP status codes

Use:

400 for validation errors

401 / 403 for auth-related failures

404 for missing resources

500 for internal server errors

Urgency: Medium
Security Impact: None

Points: 6

2. Fragmented Error Handling Logic

Description:
Errors are handled independently inside controllers, resulting in duplicated logic, inconsistent responses, and poor debuggability.

Expected Fix:

Implement centralized error-handling middleware

Forward errors using next(err)

Standardize error response format across APIs

Urgency: Medium
Security Impact: Low

Points: 9

Code Quality & Developer Experience (5 Points + Bonuses)
3. Missing API Documentation

Description:
The backend does not expose a formal API reference, making it difficult for contributors and frontend developers to understand available endpoints.

Expected Fix:

Integrate Swagger / OpenAPI documentation

Document:

Routes

Request parameters

Response formats

Example payloads

Urgency: Low
Security Impact: None

Points: 5

Bonus: +4 (High effort – full coverage & accuracy)
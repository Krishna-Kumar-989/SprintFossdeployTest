# Combined Issues - FindIt Application (Frontend + Backend)

**Total Base Points:** 40  
**Total Bonus Points Available:** 20

> **Note:** Bonus issues will be evaluated only if all base issues are successfully resolved.

---

## Base Issues (Ordered by Difficulty: Easy -> Medium -> Hard)

### 1. Welcome Page Shown for Logged-In Users

| Attribute | Value |
|-----------|-------|
| **Points** | 1 |
| **Difficulty** | Easy |
| **Urgency** | Low |
| **Security Impact** | Low |

**Description:**  
The welcome page is shown even when a valid user session exists. Logged-in users should be redirected to the dashboard.

---

### 2. Clickable Website Logo

| Attribute | Value |
|-----------|-------|
| **Points** | 1 |
| **Difficulty** | Easy |
| **Urgency** | Low |
| **Security Impact** | Low |

**Description:**  
The website logo should be clickable and redirect users to the dashboard.

---

### 3. Dashboard Filter Alignment

| Attribute | Value |
|-----------|-------|
| **Points** | 1 |
| **Difficulty** | Easy |
| **Urgency** | Low |
| **Security Impact** | Low |

**Description:**  
Dashboard filters are displayed across multiple rows. Align them into a single row for UI consistency.

---

### 4. Client-Side Timestamp Generation

| Attribute | Value |
|-----------|-------|
| **Points** | 1 |
| **Difficulty** | Easy |
| **Urgency** | Low |
| **Security Impact** | Low |

**Description:**  
Timestamps are generated using the client's local system time. This should be handled by the backend to avoid inconsistencies.

---

### 5. Emoji Icons Used in Navigation Bar

| Attribute | Value |
|-----------|-------|
| **Points** | 2 |
| **Difficulty** | Easy |
| **Urgency** | Low |
| **Security Impact** | Low |

**Description:**  
Notification and archive buttons use emoji icons. Replace them with image-based icons stored in the resources folder to match existing navigation icons.

---

### 6. Confusing Location Input Handling

| Attribute | Value |
|-----------|-------|
| **Points** | 2 |
| **Difficulty** | Medium |
| **Urgency** | Medium |
| **Security Impact** | None |

**Description:**  
In `RegisterItem.jsx`, selecting a map location overwrites the text-based location description, which may confuse users.

---

### 7. Public Exposure of User Emails

| Attribute | Value |
|-----------|-------|
| **Points** | 2 |
| **Difficulty** | Medium |
| **Urgency** | Medium |
| **Security Impact** | Medium |

**Description:**  
`ProfileView.jsx` publicly exposes user email addresses, violating basic privacy standards.

---

### 8. Missing API Documentation

| Attribute | Value |
|-----------|-------|
| **Points** | 5 |
| **Difficulty** | Medium |
| **Urgency** | Low |
| **Security Impact** | None |

**Description:**  
The backend lacks formal API documentation, making it difficult for contributors and frontend developers.

**Expected Fix:**
- Integrate Swagger / OpenAPI
- Document routes, parameters, responses, and example payloads

---

### 9. Incorrect HTTP Status Code Usage

| Attribute | Value |
|-----------|-------|
| **Points** | 6 |
| **Difficulty** | Medium-Hard |
| **Urgency** | Medium |
| **Security Impact** | None |

**Description:**  
Several endpoints return `200 OK` even when requests fail.

**Expected Fix:**
- `400` for validation errors
- `401` / `403` for authentication/authorization failures
- `404` for missing resources
- `500` for server errors

---

### 10. Broken Sign-Out Functionality

| Attribute | Value |
|-----------|-------|
| **Points** | 4 |
| **Difficulty** | Hard |
| **Urgency** | High |
| **Security Impact** | High |

**Description:**  
Sign-out only redirects users to the welcome page without invalidating the session.

**Impact:**  
Major security flaw - session remains active.

---

### 11. Insecure User Attribution During Item Registration

| Attribute | Value |
|-----------|-------|
| **Points** | 6 |
| **Difficulty** | Hard |
| **Urgency** | High |
| **Security Impact** | Critical |

**Description:**  
`RegisterItem.jsx` retrieves user identity from localStorage. The backend should determine the user from the authentication token.

---

### 12. Fragmented Error Handling Logic

| Attribute | Value |
|-----------|-------|
| **Points** | 9 |
| **Difficulty** | Hard (Highest) |
| **Urgency** | Medium |
| **Security Impact** | Low |

**Description:**  
Error handling is duplicated across controllers, causing inconsistency and poor debuggability.

**Expected Fix:**
- Centralized error-handling middleware
- Use `next(err)` pattern
- Standardize error response format

---

## Bonus Issues (Up to 20 Points)

> **Note:** Bonus issues will be evaluated only if all base issues are resolved.

---

### B1. Improve Website Color Scheme

| Attribute | Value |
|-----------|-------|
| **Bonus Points** | Up to 10 |

**Description:**  
Improve and standardize the website's color palette for better visual consistency and UX.

---

### B2. Full & Accurate API Documentation Coverage

| Attribute | Value |
|-----------|-------|
| **Bonus Points** | +10 |

**Description:**  
Extend API documentation to ensure complete coverage and accuracy across all endpoints, including edge cases and examples.

> **Note:** This is an extension of the base API documentation task and will be evaluated separately as a bonus.
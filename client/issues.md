# Issues – FindIt Application

**Total Base Points:** 20  
**Bonus Points Available:** 10  

>  Bonus issues will be evaluated **only if all base issues are successfully resolved**.

---

##  Base Issues (Ascending Order – Easy → Hard)

### 1. Welcome Page Shown for Logged-In Users
**Points:** 1  

**Description:**  
The welcome page is displayed even when a valid user session exists. Logged-in users should be automatically redirected to the dashboard.

**Hint:**  
Use protected routes or route guards to check authentication state.

**Urgency:** Low  
**Security Impact:** Low  

---

### 2. Clickable Website Logo
**Points:** 1  

**Description:**  
The website logo should be clickable and redirect users to the dashboard.

**Urgency:** Low  
**Security Impact:** Low  

---

### 3. Dashboard Filter Alignment
**Points:** 1  

**Description:**  
Dashboard filter options are currently displayed across multiple rows. They should be aligned in a single row for improved UI consistency.

**Urgency:** Low  
**Security Impact:** Low  

---

### 4. Client-Side Timestamp Generation
**Points:** 1  

**Description:**  
Timestamps are generated on the client using local system time. This may lead to inconsistencies and should be handled by the backend.

**Urgency:** Low  
**Security Impact:** Low  

---

### 5. Confusing Location Input Handling
**Points:** 2  

**Description:**  
In `RegisterItem.jsx`, selecting a location on the map overwrites the text-based location description, which can confuse users.

**Urgency:** Medium  
**Security Impact:** None  

---

### 6. Public Exposure of User Emails
**Points:** 2  

**Description:**  
`ProfileView.jsx` exposes user email addresses publicly, which violates basic data privacy practices.

**Urgency:** Medium  
**Security Impact:** Medium  

---

### 7. Emoji Icons Used in Navigation Bar
**Points:** 2  

**Description:**  
The notification and archive buttons in the navigation bar use emoji icons. Replace them with image-based icons stored in the `resources` folder, consistent with other navigation icons.

**Urgency:** Low  
**Security Impact:** Low  

---

### 8. Broken Sign-Out Functionality
**Points:** 4  

**Description:**  
The sign-out feature on the account page does not properly invalidate the user session. It only redirects to the welcome page while keeping the session active.

**Impact:**  
This is a major security flaw and must be fixed.

**Urgency:** High  
**Security Impact:** High  

---

### 9. Insecure User Attribution During Item Registration
**Points:** 6  

**Description:**  
In `RegisterItem.jsx`, user identity is retrieved from `localStorage`. The backend should instead determine the user from the authentication token to prevent spoofing.

**Urgency:** High  
**Security Impact:** Critical  

---

##  Bonus Issues (Up to 10 Points)

### 10. Improve Website Color Scheme
**Bonus Points:** Up to 10  

**Description:**  
Improve and standardize the website’s color palette to enhance visual consistency and user experience.

**Evaluation Rule:**  
This bonus issue will be evaluated **only if all base issues are resolved**.

---

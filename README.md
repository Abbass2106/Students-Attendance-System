# RollBook: Student Attendance System

A role-based web app for managing students, academic structure, class enrollment and attendance, built so that historical attendance stays accurate even when students change classes.

- **Backend:** Spring Boot (Java 17), Spring Security with JWT in an httpOnly cookie, Spring Data JPA, PostgreSQL
- **Frontend:** React 19, Vite, Tailwind CSS 4, React Router, Axios

---

## How the system works

```
Department
  └── Program
Course
  └── Class / Section (e.g. CS301-A, Semester 1, 2026/2027)  ← teacher assigned here
        └── Enrollment  ← links a Student to a Class
              └── Attendance Session (a class held on a date)
                    └── Attendance (PRESENT / ABSENT / LATE / EXCUSED)
```

Attendance is never stored directly against a student or a class. It flows **Student → Enrollment → Class → Session → Attendance**. The system checks that a student is actively enrolled in a class before attendance can be recorded for them.

### Roles

| Role | Can do |
|------|--------|
| **Admin** | Everything: departments, programs, courses, classes, students (including CSV import), users, teacher assignment, enrollments, attendance, all reports |
| **Teacher** | Read-only on classes, students and courses. Enroll or withdraw students and take or correct attendance **only for classes assigned to them**. Reports for their own classes |
| **Student** | Own dashboard: enrolled classes, per-class attendance percentage, low-attendance alert (below 75%) |

---

## Project structure

```
backend/    Spring Boot API
  src/main/java/com/example/student_attendance/
    Config/        Security + CORS
    Security/      JWT filter, auth error handlers
    controllers/   REST endpoints
    services/      Business rules
    repositories/  Spring Data JPA
    models/        Entities and DTOs
    Exceptions/    ApiException + global handler
frontend/   React app
  src/pages/       Screens (one per feature, plus a dashboard per role)
  src/components/  Layout, sidebar, navbar
  src/context/     Auth state
  src/routes/      Role-protected routes
```

---

## Running locally

### Prerequisites
- Java 17
- Node.js 20.19+ (or 22.12+)
- A PostgreSQL database (local, or a hosted one such as Supabase)

### Backend

Set these environment variables, then run the app:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | JDBC URL, e.g. `jdbc:postgresql://localhost:5432/attendance` (must start with `jdbc:postgresql://`) |
| `DATABASE_USERNAME` | Yes | Database user |
| `DATABASE_PASSWORD` | Yes | Database password |
| `JWT_SECRET` | In production | At least 32 bytes. A development default exists, but **never rely on it in production** |
| `COOKIE_SECURE` | In production | `true` for HTTPS deployments (sets `Secure` and `SameSite=None`). `false` for local HTTP |
| `PORT` | No | Defaults to `8080` |

```bash
cd backend
./mvnw spring-boot:run
```

Tables are created on first start (`spring.jpa.hibernate.ddl-auto=update`). See the schema warning under **Known limitations**.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173` and talks to `http://localhost:8080/api` by default. To point it elsewhere, set `VITE_API_BASE_URL` **before building** (it is read at build time).

### Creating the first admin

User creation is admin-only, so the very first admin has to be inserted directly into the database. Generate a BCrypt hash of your password, then:

```sql
INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'admin@school.edu', '<bcrypt-hash>', 'ADMIN');
```

Sign in with that account and create everything else from the UI.

---

## Using the system

Set things up in this order, since each step depends on the one before it:

1. **Academic Structure:** add Departments, then Programs, then Courses.
2. **Users:** create teacher accounts (and student logins if students should sign in).
3. **Students:** add profiles one by one or with **Import CSV**.
4. **Classes:** create classes (a class is one offering of a course) and assign a teacher.
5. **Enrollments:** pick a class and enroll students.
6. **Attendance:** choose a class and date, mark each student, save. Opening the same class and date later shows the saved register, and saving again updates it.
7. **Reports:** per-student and per-class summaries.

**Student logins:** a student's user account is linked to their student profile **only by matching email**. Use the identical email in both places.

**Withdrawing a student** from a class keeps their past attendance. Re-enrolling reactivates the same record. A student who has enrollment history can't be deleted; set them to **Inactive** instead.

### CSV import format

Required columns: `studentNumber, firstName, lastName, email`
Optional: `phone, programId, year, semester, status`

Column order doesn't matter. Rows that fail (duplicates, missing fields, unknown `programId`) are skipped and reported, and the rest are imported. Maximum file size is 5 MB.

---

## API overview

All routes are under `/api`. Authentication is via the `accessToken` httpOnly cookie set at login.

| Area | Endpoints | Access |
|------|-----------|--------|
| Auth | `POST /users/login`, `POST /users/logout`, `GET /users/me` | Login/logout public, `me` any signed-in user |
| Users | `GET/POST /users`, `GET /users/{id}`, `DELETE /users/{id}` | Admin |
| Departments, Programs | CRUD under `/departments`, `/programs` | Admin |
| Courses | CRUD under `/courses` (`GET` also open to Teacher) | Admin (write) |
| Students | CRUD under `/students`, `POST /students/import` | Admin (write), Teacher (read) |
| Student self-service | `GET /students/me`, `/me/enrollments`, `/me/attendance` | Any signed-in role |
| Classes | CRUD under `/classes`, `GET /classes/mine`, `PUT/DELETE /classes/{id}/teacher[/{teacherId}]` | Admin (write), Teacher (own classes, read) |
| Enrollments | `POST /enrollments` (JSON body `{studentId, classId}`), `GET /enrollments/class/{id}`, `DELETE /enrollments/student/{id}/class/{id}` (withdraws) | Admin, Teacher (own classes) |
| Sessions | `/attendance-sessions` (create, list, by class/date, delete) | Admin, Teacher (own classes) |
| Attendance | `POST /attendance/bulk`, `GET /attendance`, `/attendance/date/{date}`, `/attendance/class/{id}/date/{date}`, `/attendance/student/{id}/summary`, `/attendance/class/{id}/summary`, plus single-record endpoints | Admin, Teacher (own classes) |

**Bulk attendance** (`POST /attendance/bulk`):

```json
{
  "classId": 3,
  "date": "2026-10-06",
  "topic": "Normalization",
  "records": [
    { "enrollmentId": 12, "status": "PRESENT" },
    { "enrollmentId": 13, "status": "LATE" }
  ]
}
```

It finds or creates the session for that class and date, then creates or updates one record per enrollment. Every enrollment must belong to the class and be active.

---

## Deployment notes

The backend ships with a `Dockerfile` (multi-stage Maven build, Java 17 runtime) and reads its configuration from environment variables.

- Set `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, a strong `JWT_SECRET`, and `COOKIE_SECURE=true`.
- Allowed CORS origins are listed in `Config/CorsConfig.java`. Add your frontend's URL there, or requests will be blocked by the browser.
- The auth cookie is cross-site when frontend and backend are on different domains. Keeping them on subdomains of the same parent domain is more reliable.
- If you use Supabase's **Transaction pooler** (port 6543), append `?prepareThreshold=0` to the JDBC URL.
- On free hosting tiers the backend may sleep when idle, so the first request can take up to a minute.

---

## Known limitations

- **Schema management:** the app relies on `ddl-auto=update`, which only ever *adds* to a database. On a database created by an older version of the code, this can cause missing columns, leftover `NOT NULL` columns and stale enum check constraints. Moving to Flyway migrations is the recommended fix.
- **No first-admin seeding:** the first admin must be inserted manually (see above).
- **No password reset or change:** admins can't reset passwords and users can't change their own. The "Forgot password?" link on the login page is not wired up.
- **Users can be created and deleted but not edited.**
- **Delete protection is partial:** students and users with dependents are protected. Courses, classes, sessions, programs and departments can still be deleted while records depend on them.
- **Teachers can list all students** (the spec says only students in their classes).
- **Attendance percentage** counts only `PRESENT` as attended.
- **Dates:** the frontend uses UTC dates in a few places, which can show the previous day in time zones ahead of UTC.
- **Tests:** only a small number of unit tests exist. The bulk attendance and teacher-ownership rules should be covered next.

---

## Roadmap

1. Flyway migrations and an admin seeder
2. Delete protection and `@Valid` on all create/update endpoints
3. Password reset and change-password
4. Teacher-scoped student list and an explicit user-to-student link
5. Attendance session history screen
6. Tests for attendance and permissions

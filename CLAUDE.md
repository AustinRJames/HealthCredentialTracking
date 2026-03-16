# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-stack healthcare credential tracking system. Employees are assigned certifications that have expiration dates; the admin dashboard tracks status (Valid / ExpiringSoon / Expired). The stack is:

- **Backend**: ASP.NET Core 9 Web API (`HealthcareCredentialTracker/`)
- **Frontend**: Angular 21 standalone components (`healthcare-frontend/`)
- **Database**: SQL Server (runs on `localhost,1433` via Docker or local install)

---

## Commands

### Backend (.NET)

```bash
# Run the API (listens on http://localhost:5285)
cd HealthcareCredentialTracker
dotnet run

# Add a new EF Core migration
dotnet ef migrations add <MigrationName>

# Apply pending migrations to the database
dotnet ef database update
```

### Frontend (Angular)

```bash
cd healthcare-frontend

# Install dependencies
npm install

# Start dev server (http://localhost:4200)
npm start

# Build for production
npm run build

# Run tests (Vitest)
npm test
```

---

## Architecture

### Backend

Controllers follow `[Route("api/[controller]")]` with dependency-injected `HealthcareContext` (EF Core). Write operations that require admin privilege are guarded with `[Authorize(Roles = "Admin")]`.

| Controller | Responsibility |
|---|---|
| `AuthController` | Login — validates credentials with BCrypt, returns a JWT (2-hour expiry) |
| `EmployeesController` | CRUD for employees; GET includes department name and certifications via EF projections |
| `CertificationsController` | CRUD for certification definitions |
| `EmployeeCertificationsController` | Assign/revoke certifications to employees; calls `ICertificationService.UpdateStatus` on save |
| `DepartmentController` | CRUD for departments |

**`CertificationService`** — the only application service. Computes `CertificationStatus` (Valid / ExpiringSoon ≤30 days / Expired) given an `EmployeeCertification`.

**Data model key relationships:**
- `Employee` → `Department` (optional FK `DepartmentId`)
- `EmployeeCertification` — composite PK `(EmployeeId, CertificationId)` — join table between `Employee` and `Certification`
- `DepartmentCertification` — composite PK `(DepartmentId, CertificationId)` — tracks required certs per department

A seeded `admin` user (Role = "Admin") is baked into `HealthcareContext.OnModelCreating`. JWT config (key, issuer, audience) lives in `appsettings.json`.

### Frontend

Uses Angular standalone components and signals (`signal<T>`) for reactive state — no NgRx store.

**`Api` service** (`src/app/services/api.ts`) is the single HTTP layer. It also owns JWT token management (`localStorage` key `jwt_token`) and exposes `isLoggedInSignal` for auth state.

**`DepartmentService`** (`src/app/services/department.ts`) handles department-specific HTTP calls separately from `Api`.

**`authInterceptor`** (`auth.interceptor.ts`) automatically attaches `Authorization: Bearer <token>` to every outgoing request.

**`authGuard`** (`auth.guard.ts`) protects the `/admin` route; unauthenticated users are redirected to `/login`.

**Routes:**

| Path | Component | Guard |
|---|---|---|
| `/login` | `Login` | — |
| `/admin` | `CredentialTrackerComponent` | `authGuard` |
| `**` | redirect → `/login` | — |

`CredentialTrackerComponent` is the main admin dashboard and embeds `DepartmentManager` as a child component. All data is loaded via `loadData()` in `ngOnInit`.

### CORS

The API allows requests only from `http://localhost:4200` (the Angular dev server). To change this, update `Program.cs`.

### JSON serialization

Enums are serialized as strings (`JsonStringEnumConverter`). Circular reference handling uses `ReferenceHandler.IgnoreCycles`.

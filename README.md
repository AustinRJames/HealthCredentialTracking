# HealthCredentialTracking

A full-stack admin dashboard for tracking healthcare employee certifications. Admins can manage employees, assign certifications, and monitor expiration status (Valid, Expiring Soon, Expired).

**Stack:** ASP.NET Core 9 · Angular 21 · SQL Server · JWT Auth

---

## Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js + npm 11](https://nodejs.org/)
- [Angular CLI](https://angular.dev/tools/cli) — `npm install -g @angular/cli`
- SQL Server running on `localhost,1433` (Docker example below)

---

## Installation & Setup

### 1. Start SQL Server (Docker)

```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=SuperStrong@Passw0rd!" \
  -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:2022-latest
```

> If you use a different password, update `ConnectionStrings.DefaultConnection` in `HealthcareCredentialTracker/appsettings.json`.

### 2. Run the Backend

```bash
cd HealthcareCredentialTracker

# Apply migrations and seed the database
dotnet ef database update

# Start the API (http://localhost:5285)
dotnet run
```

Swagger UI is available at `http://localhost:5285/swagger`.

### 3. Run the Frontend

```bash
cd healthcare-frontend

npm install

# Start the dev server (http://localhost:4200)
npm start
```

---

## Default Login

| Username | Password |
|----------|----------|
| `admin`  | `admin`  |

The admin user is seeded automatically when migrations are applied.

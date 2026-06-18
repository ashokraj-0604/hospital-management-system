# Hospital Management System - Repository Analysis & Architecture

**Created:** 2026-06-18  
**Status:** Active Development Phase  
**Language:** TypeScript (99.3%)

---

## 📋 Executive Summary

This is a **full-stack healthcare management application** using a monorepo architecture with:
- **Frontend:** Next.js 16.2.7 (React 19.2.4) - Modern React framework with App Router
- **Backend:** NestJS 11.0.1 - Enterprise Node.js framework
- **Database:** PostgreSQL with TypeORM
- **Auth:** JWT-based authentication with refresh tokens

The system is designed to manage hospital operations including user roles, authentication, billing, auditing, and hospital settings.

---

## 📁 Repository Structure

```
hospital-management-system/
├── hms-backend/                          # NestJS Backend
│   ├── src/
│   │   ├── auth/                         # Authentication module
│   │   │   ├── auth.controller.ts        # Auth endpoints
│   │   │   ├── auth.service.ts           # Auth business logic
│   │   │   ├── jwt-auth.guard.ts         # JWT protection
│   │   │   ├── jwt.strategy.ts           # Passport JWT strategy
│   │   │   └── dto/                      # Data transfer objects
│   │   ├── users/                        # User management module
│   │   │   ├── user.entity.ts            # User database model
│   │   │   ├── users.service.ts          # User operations
│   │   │   ├── users.controller.ts       # User endpoints
│   │   │   └── users.module.ts           # Module configuration
│   │   ├── super-admin/                  # Admin-only features
│   │   │   ├── hospitals/                # Hospital management
│   │   │   ├── audit/                    # Audit logging
│   │   │   ├── billing/                  # Billing operations
│   │   │   └── settings/                 # System settings
│   │   ├── app.module.ts                 # Root module with DB config
│   │   ├── app.controller.ts             # Root controller
│   │   ├── app.service.ts                # Root service
│   │   ├── main.ts                       # Entry point
│   │   └── seed.ts                       # Database seeding
│   ├── test/                             # E2E tests
│   ├── package.json                      # Backend dependencies
│   ├── tsconfig.json                     # Backend TypeScript config
│   └── jest.config                       # Testing framework config
│
├── src/                                  # Next.js Frontend
│   ├── app/                              # Next.js App Router
│   ├── components/                       # React components
│   ├── constants/                        # Application constants
│   ├── hooks/                            # Custom React hooks
│   ├── lib/                              # Utility functions
│   ├── services/                         # API service clients
│   └── types/                            # TypeScript type definitions
│
├── public/                               # Static assets
├── middleware.ts                         # Next.js middleware
├── next.config.ts                        # Next.js configuration
├── package.json                          # Frontend dependencies
├── tsconfig.json                         # Frontend TypeScript config
├── tailwind.config.ts                    # Tailwind CSS config
├── AGENTS.md                             # Agent configuration
├── README.md                             # Project documentation
└── REPOSITORY_ANALYSIS.md               # This file

```

---

## 🔧 Technology Stack

### Backend (NestJS)
| Technology | Version | Purpose |
|-----------|---------|---------|
| NestJS | 11.0.1 | Framework |
| TypeORM | 1.0.0 | ORM |
| PostgreSQL | 8.21.0 | Database |
| Passport | 0.7.0 | Authentication |
| JWT | 11.0.2 | Token management |
| Bcrypt | 6.0.0 | Password hashing |
| Jest | 30.0.0 | Testing |

### Frontend (Next.js)
| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.2.7 | Framework |
| React | 19.2.4 | UI library |
| Tailwind CSS | 4.0 | Styling |
| React Hook Form | 7.78.0 | Form management |
| Zod | 4.4.3 | Schema validation |
| Axios | 1.17.0 | HTTP client |
| Lucide React | 1.18.0 | Icons |
| QR Code | 1.5.4 | QR generation |

---

## 🏗️ Core Components Analysis

### 1. **Authentication Module** (Backend)
**Location:** `hms-backend/src/auth/`

#### Key Files:
- `auth.service.ts` - Core authentication logic
- `auth.controller.ts` - REST endpoints
- `jwt.strategy.ts` - Passport JWT strategy
- `jwt-auth.guard.ts` - Route protection

#### Features:
✅ **Login Flow:**
- Email/password validation
- Bcrypt password comparison
- JWT access token generation (15 min expiry)
- Refresh token generation & hashing
- Account status verification

✅ **Token Management:**
- Access & refresh token pair system
- Hashed refresh token storage
- Token verification and rotation

✅ **Password Reset:**
- Forgot password endpoint
- Reset token with 1-hour expiry
- Password update with validation

✅ **Logout:**
- Clear refresh token on logout

**Response Structure:**
```typescript
{
  requires_mfa: false,
  tokens: {
    access_token: string,
    refresh_token: string,
    expires_in: 900 // 15 minutes
  },
  user: {
    user_id: string,
    email: string,
    full_name: string,
    role: UserRole,
    hospital_id: string,
    is_mfa_enabled: false
  }
}
```

---

### 2. **Users Module** (Backend)
**Location:** `hms-backend/src/users/`

#### Key Files:
- `user.entity.ts` - Database schema
- `users.service.ts` - Business logic
- `users.controller.ts` - REST endpoints

#### User Entity:
```typescript
{
  id: UUID (Primary Key),
  email: string (Unique),
  password: string (Hashed),
  name: string,
  role: UserRole,
  isActive: boolean,
  hospitalId: string | null,
  refreshToken: string | null (Hashed),
  passwordResetToken: string | null (Hashed),
  passwordResetExpiry: Date | null,
  createdAt: Date,
  updatedAt: Date
}
```

#### User Roles:
```typescript
- SUPER_ADMIN         // Full system access
- HOSPITAL_ADMIN      // Hospital-level admin
- DOCTOR              // Medical practitioner
- NURSE               // Nursing staff
- RECEPTIONIST        // Front desk
- PHARMACIST          // Pharmacy staff
- LAB_TECHNICIAN      // Lab operations
- BILLING_OFFICER     // Billing operations
```

#### Implemented Features:
✅ Find all users with filtering (search, role, status)
✅ Find user by ID
✅ Find user by email
✅ Query builder with soft filtering

---

### 3. **Application Configuration** (Backend)
**Location:** `hms-backend/src/`

#### Main Entry Point (`main.ts`):
- CORS enabled for frontend (localhost:3000)
- Global prefix: `/api/v1`
- Automatic request validation
- Cookie parser middleware
- Port: 4000 (configurable via env)

#### App Module (`app.module.ts`):
- PostgreSQL TypeORM connection
- Environment-based configuration
- Dynamic module loading:
  - AuthModule
  - UsersModule
  - HospitalsModule (super-admin)
  - AuditModule (super-admin)
  - BillingModule (super-admin)
  - SettingsModule (super-admin)

#### Database Seeding (`seed.ts`):
Default super admin account:
```
Email: admin@medsocio.com
Password: Admin@1234
Role: SUPER_ADMIN
```

---

### 4. **Frontend Structure** (Next.js)
**Location:** `src/`

#### Directories:
| Directory | Purpose |
|-----------|---------|
| `app/` | Next.js App Router pages |
| `components/` | Reusable React components |
| `constants/` | Application-wide constants |
| `hooks/` | Custom React hooks |
| `lib/` | Utility functions |
| `services/` | API client services |
| `types/` | TypeScript interfaces |

#### Configuration:
- **Middleware:** Next.js middleware for request processing
- **Styling:** Tailwind CSS with PostCSS
- **Forms:** React Hook Form + Zod validation
- **UI:** Lucide React icons
- **HTTP:** Axios client

---

## 🔌 API Endpoints

### Authentication (`/api/v1/auth`)
```
POST   /auth/login              - User login with credentials
POST   /auth/refresh            - Refresh access token
POST   /auth/logout             - Clear session
POST   /auth/forgot-password    - Request password reset
```

### Users (`/api/v1/users`)
```
GET    /users                   - List users (with filters)
GET    /users/:id               - Get specific user
```

### Admin Features
```
/super-admin/hospitals          - Hospital management
/super-admin/audit              - Audit logging
/super-admin/billing            - Billing operations
/super-admin/settings           - System configuration
```

---

## 🔐 Security Features

✅ **Password Security:**
- Bcrypt hashing (salt rounds: 10)
- Password validation on login
- Password reset token management

✅ **Token Security:**
- JWT with separate access/refresh secrets
- Refresh token hashing in database
- Token expiry management (15 min access, longer refresh)

✅ **Authentication Guard:**
- JWT-based route protection
- Passport strategy integration
- Account active status check

✅ **Data Validation:**
- DTO-based input validation
- Whitelist + transform pipes
- Type-safe request/response handling

✅ **CORS Protection:**
- Origin whitelist (configurable)
- Credentials allowed for trusted origins

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  password VARCHAR,
  name VARCHAR,
  role VARCHAR DEFAULT 'HOSPITAL_ADMIN',
  isActive BOOLEAN DEFAULT true,
  hospitalId VARCHAR NULLABLE,
  refreshToken VARCHAR NULLABLE,
  passwordResetToken VARCHAR NULLABLE,
  passwordResetExpiry TIMESTAMPTZ NULLABLE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Planned Entities (Modules structure):
- `Hospital` - Hospital management
- `Audit` - Activity logging
- `Billing` - Billing records
- `Settings` - System configuration

---

## 🚀 Deployment & Environment

### Backend Environment Variables
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=hospital_db

# JWT
JWT_ACCESS_SECRET=secret_key
JWT_ACCESS_EXPIRY=900s
JWT_REFRESH_SECRET=refresh_secret
JWT_REFRESH_EXPIRY=7d

# Server
PORT=4000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Build & Run Commands

**Backend:**
```bash
cd hms-backend
npm install
npm run start:dev     # Development with hot reload
npm run build         # Production build
npm run start:prod    # Production mode
npm run test          # Run tests
npm run seed          # Seed database
```

**Frontend:**
```bash
npm install
npm run dev           # Development server
npm run build         # Production build
npm run start         # Production server
npm run lint          # Lint code
```

---

## 🔄 Data Flow

### Login Flow:
```
Frontend (Login Form)
        ↓
POST /api/v1/auth/login
        ↓
AuthService.login()
├─ Find user by email
├─ Compare password (bcrypt)
├─ Check isActive status
├─ Generate JWT tokens
├─ Hash refresh token
└─ Return tokens + user data
        ↓
Frontend (Store tokens + redirect)
```

### Protected Request Flow:
```
Frontend (API Call with token)
        ↓
Request Header: Authorization: Bearer {access_token}
        ↓
JwtAuthGuard
├─ Extract token from header
├─ Verify signature & expiry
└─ Attach user to request
        ↓
Controller/Service Logic
        ↓
Database Query (if needed)
        ↓
Response
```

---

## ✅ Completed Features

| Feature | Status | Location |
|---------|--------|----------|
| User Authentication (JWT) | ✅ Complete | `hms-backend/src/auth/` |
| User Management | ✅ Complete | `hms-backend/src/users/` |
| Role-Based Access | ✅ Defined | `hms-backend/src/users/user.entity.ts` |
| Password Hashing | ✅ Complete | `hms-backend/src/auth/auth.service.ts` |
| Refresh Token System | ✅ Complete | `hms-backend/src/auth/auth.service.ts` |
| Database Configuration | ✅ Complete | `hms-backend/src/app.module.ts` |
| Frontend Setup | ✅ Complete | `src/` |
| Middleware Layer | ✅ Complete | `middleware.ts` |
| CSS Framework | ✅ Complete | Tailwind CSS 4.0 |

---

## 🔨 TODO & Next Phase

### Authentication & Authorization
- [ ] Implement MFA (currently placeholder: `requires_mfa: false`)
- [ ] Add email verification for forgot-password
- [ ] Add login attempt throttling
- [ ] Implement refresh token rotation

### Frontend Components
- [ ] Build login/registration pages
- [ ] Create dashboard layout
- [ ] Implement role-based UI rendering
- [ ] Add protected routes

### Super Admin Features
- [ ] Build hospitals management CRUD
- [ ] Implement audit logging system
- [ ] Build billing module
- [ ] Create system settings interface

### Additional Modules
- [ ] Patient management
- [ ] Appointment scheduling
- [ ] Medical records
- [ ] Prescription management
- [ ] Lab/Test results
- [ ] Notification system

### Testing & Quality
- [ ] Unit tests (backend)
- [ ] E2E tests (both stacks)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Error handling standardization

### DevOps
- [ ] Docker configuration
- [ ] CI/CD pipeline setup
- [ ] Database migration scripts
- [ ] Logging & monitoring

---

## 📝 Key Code Patterns

### Service Injection (NestJS)
```typescript
constructor(
  @InjectRepository(User)
  private usersRepo: Repository<User>,
  private jwtService: JwtService,
  private config: ConfigService,
) {}
```

### Query Building (TypeORM)
```typescript
const qb = this.userRepository.createQueryBuilder('user');
qb.andWhere('user.email ILIKE :email', { email: `%${search}%` });
qb.orderBy('user.createdAt', 'DESC');
const [data, total] = await qb.getManyAndCount();
```

### JWT Token Generation
```typescript
const payload = { sub: user.id, email: user.email, role: user.role };
const token = await this.jwtService.signAsync(payload, {
  secret: this.config.get('JWT_ACCESS_SECRET'),
  expiresIn: this.config.get('JWT_ACCESS_EXPIRY'),
});
```

---

## 🎯 Summary for Next Phase

**Core Components Identified:**
1. ✅ Authentication Engine (JWT + Bcrypt)
2. ✅ User Management System
3. ✅ Role-Based Access Control
4. ✅ Database Layer (TypeORM + PostgreSQL)
5. ✅ Frontend Framework (Next.js)
6. 🔄 Admin Modules (Structure ready, implementation pending)
7. 🔄 Frontend Pages (Not yet implemented)

**Recommended Next Steps:**
1. Implement frontend authentication pages
2. Build protected dashboard with role-based navigation
3. Create super-admin management interfaces
4. Add patient management module
5. Implement audit logging system
6. Setup error handling & monitoring

---

**Last Updated:** 2026-06-18  
**By:** Analysis Agent  
**Architecture Phase:** 1 (Foundation Complete)

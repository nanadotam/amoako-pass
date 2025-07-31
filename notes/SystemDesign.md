# Amoako's Passwords - System Design Document

## 1. System Overview

### 1.1 Architecture Philosophy
Amoako's Passwords follows a modern, cloud-native architecture with security-first design principles. The system implements a zero-knowledge architecture where sensitive data is encrypted client-side before transmission to servers.

### 1.2 High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Apps   │    │   API Gateway   │    │   Microservices │
│                 │    │                 │    │                 │
│ • Web App       │◄──►│ • Rate Limiting │◄──►│ • Auth Service  │
│ • Mobile App    │    │ • Load Balancer │    │ • Vault Service │
│ • Browser Ext   │    │ • SSL/TLS       │    │ • User Service  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                       ┌─────────────────┐             │
                       │   Data Layer    │◄────────────┘
                       │                 │
                       │ • PostgreSQL    │
                       │ • Redis Cache   │
                       │ • File Storage  │
                       └─────────────────┘
```

## 2. System Components

### 2.1 Frontend Architecture

#### 2.1.1 Web Application
- **Framework**: Next.js 14 with App Router
- **UI Library**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context + useState/useReducer
- **Authentication**: NextAuth.js with custom providers
- **Encryption**: Web Crypto API for client-side encryption

#### 2.1.2 Mobile Applications (Future)
- **Framework**: React Native or Flutter
- **Biometric Auth**: Platform-specific APIs
- **Secure Storage**: iOS Keychain / Android Keystore

#### 2.1.3 Browser Extensions (Future)
- **Framework**: Manifest V3 compatible
- **Auto-fill**: Content script injection
- **Communication**: Native messaging with web app

### 2.2 Backend Architecture

#### 2.2.1 API Gateway
- **Technology**: Kong or AWS API Gateway
- **Features**:
  - Rate limiting (100 requests/minute per user)
  - SSL/TLS termination
  - Request/response logging
  - CORS handling
  - Authentication middleware

#### 2.2.2 Microservices

##### Authentication Service
```typescript
// Core responsibilities:
- User registration/login
- Session management
- Password reset flows
- 2FA verification
- JWT token generation/validation

// API Endpoints:
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh
POST /auth/reset-password
POST /auth/verify-2fa
```

##### Vault Service
```typescript
// Core responsibilities:
- Password CRUD operations
- WiFi password management
- Category management
- Search and filtering
- Data export/import

// API Endpoints:
GET    /vault/passwords
POST   /vault/passwords
PUT    /vault/passwords/:id
DELETE /vault/passwords/:id
GET    /vault/categories
POST   /vault/categories
GET    /vault/search?q=query
POST   /vault/export
POST   /vault/import
```

##### User Service
```typescript
// Core responsibilities:
- User profile management
- Settings and preferences
- Audit logging
- Usage analytics

// API Endpoints:
GET    /users/profile
PUT    /users/profile
GET    /users/settings
PUT    /users/settings
GET    /users/audit-logs
POST   /users/analytics
```

### 2.3 Data Layer

#### 2.3.1 Primary Database (PostgreSQL)
- **Version**: PostgreSQL 15+
- **Configuration**:
  - Connection pooling (PgBouncer)
  - Read replicas for scaling
  - Automated backups every 6 hours
  - Point-in-time recovery
  - Encryption at rest

#### 2.3.2 Cache Layer (Redis)
- **Use Cases**:
  - Session storage
  - Rate limiting counters
  - Frequently accessed data
  - Password strength calculations
- **Configuration**:
  - Redis Cluster for high availability
  - TTL-based expiration
  - Encrypted connections

#### 2.3.3 File Storage
- **Technology**: AWS S3 or compatible
- **Use Cases**:
  - Favicon storage
  - Export file generation
  - Backup storage
- **Security**: Server-side encryption, signed URLs

## 3. Security Architecture

### 3.1 Encryption Strategy

#### 3.1.1 Client-Side Encryption
```typescript
// Encryption Flow:
1. User enters master password
2. Derive encryption key using PBKDF2/Argon2
3. Encrypt sensitive data with AES-256-GCM
4. Send encrypted data to server
5. Server stores encrypted data (zero-knowledge)

// Key Derivation:
const salt = crypto.getRandomValues(new Uint8Array(32));
const key = await crypto.subtle.importKey(
  'raw',
  new TextEncoder().encode(masterPassword),
  'PBKDF2',
  false,
  ['deriveKey']
);

const encryptionKey = await crypto.subtle.deriveKey(
  {
    name: 'PBKDF2',
    salt: salt,
    iterations: 100000,
    hash: 'SHA-256'
  },
  key,
  { name: 'AES-GCM', length: 256 },
  false,
  ['encrypt', 'decrypt']
);
```

#### 3.1.2 Data Classification
- **Highly Sensitive**: Passwords, notes (AES-256 encrypted)
- **Sensitive**: Usernames, emails (AES-256 encrypted)
- **Internal**: Categories, metadata (database-level encryption)
- **Public**: Favicons, non-sensitive settings (no encryption)

### 3.2 Authentication & Authorization

#### 3.2.1 Authentication Flow
```mermaid
sequenceDiagram
    participant C as Client
    participant A as Auth Service
    participant D as Database
    
    C->>A: Login request (email, password)
    A->>D: Verify credentials
    D-->>A: User data
    A->>A: Generate JWT tokens
    A-->>C: Access token + Refresh token
    C->>A: API request with token
    A->>A: Validate token
    A-->>C: Authorized response
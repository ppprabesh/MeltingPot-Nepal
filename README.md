# The Melting Pot - Enterprise E-Commerce Platform

## Executive Summary

The Melting Pot is a sophisticated e-commerce solution developed with Next.js 14, delivering a comprehensive online shopping experience for apparel and accessories. This enterprise-grade platform integrates secure payment processing, robust user authentication protocols, and an intuitive shopping interface designed for conversion optimization.

## Table of Contents

1. [Core Capabilities](#core-capabilities)
2. [Technology Architecture](#technology-architecture)
3. [System Architecture](#system-architecture)
4. [Development Setup](#development-setup)
5. [Environment Configuration](#environment-configuration)
6. [Payment Gateway Integration](#payment-gateway-integration)
7. [Security Implementation](#security-implementation)
8. [Data Architecture](#data-architecture)
9. [API Reference](#api-reference)
10. [Quality Assurance](#quality-assurance)
11. [Deployment Protocol](#deployment-protocol)
12. [Development Team](#development-team)

## Core Capabilities

- **Identity Management**

  - Enterprise-grade authentication system
  - Persistent session management
  - Role-based authorization framework (Administrator/Customer)

- **Inventory Management**

  - Comprehensive product catalog system
  - Detailed product information architecture
  - Media asset management solution
  - Real-time inventory control

- **Customer Experience**

  - Advanced cart functionality
  - Customer favorites system
  - Sophisticated search and filtering mechanisms
  - Fully responsive cross-device interface

- **Transaction Processing**

  - Integrated Khalti payment services
  - Integrated eSewa payment services
  - End-to-end transaction security
  - Comprehensive order lifecycle management

- **Administrative Controls**
  - Centralized product administration
  - Order processing workflow
  - Customer data management
  - Business intelligence dashboard

## Technology Architecture

- **Frontend Framework**

  - Next.js 14 application framework
  - React component architecture
  - TypeScript implementation
  - Tailwind CSS styling framework
  - Shadcn UI component library

- **Backend Services**

  - Next.js API routing infrastructure
  - MongoDB document database
  - Mongoose object modeling toolkit
  - NextAuth.js authentication framework

- **Payment Infrastructure**

  - Khalti payment processing
  - eSewa transaction handling

- **Cloud Infrastructure**
  - Cloudinary media asset management
  - MongoDB Atlas database service

## System Architecture

```
melting-pot/
├── src/
│   ├── app/
│   │   ├── api/               # API endpoints
│   │   ├── admin/             # Administrative interfaces
│   │   ├── clothing/          # Apparel product catalog
│   │   ├── accessories/       # Accessories product catalog
│   │   ├── checkout/          # Transaction processing
│   │   └── payment/           # Payment integration
│   ├── components/            # Reusable UI components
│   ├── context/               # Application state management
│   ├── lib/                   # Utility functions
│   └── models/                # Data schema definitions
├── public/                    # Static assets
└── .env.local                 # Environment configuration
```

## Development Setup

1. Repository initialization:

   ```bash
   git clone https://github.com/yourusername/theMeltingPot.git
   cd theMeltingPot
   ```

2. Dependency installation:

   ```bash
   npm install
   ```

3. Environment variable configuration:

   ```bash
   cp .env.example .env.local
   ```

4. Development server initialization:
   ```bash
   npm run dev
   ```

## Environment Configuration

Configure your environment with the following variables in `.env.local`:

````env
# Database Configuration
MONGODB_URI=your_mongodb_uri

# Authentication Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

# Media Asset Management
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payment Gateway Configuration Parameters
# Implementation based on technical documentation from:
# Paudel, R. (2024). "Integrating eSewa and Khalti Payment Gateways in Next.js 14 with Server Actions."
# Retrieved from: https://medium.com/@paudelronish/integrating-esewa-and-khalti-payment-gateways-in-next-js-14-with-server-actions-f15729ffae3e

# Application Base URL for Payment Gateway Callbacks
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# eSewa Merchant Authentication Credentials
ESEWA_MERCHANT_ID=your_esewa_merchant_id
ESEWA_MERCHANT_SECRET=your_esewa_secret

# Khalti Payment Gateway API Authentication
KHALTI_SECRET_KEY=your_khalti_secret_key

## Payment Gateway Integration

### Khalti Payment Services

- Testing credentials:
  - Test account ID: 9800000000
  - Test MPIN: 1111
  - Test OTP: 987654

### eSewa Payment Services

- Testing credentials:
  - Merchant identifier: EPAYTEST
  - Merchant key: 8gBm/:&EnhH.1/q
  - Test account ID: 9806800001
  - Test password: Nepal@123
  - Test MPIN: 1122

## Security Implementation

- NextAuth.js authentication framework
- Environment variable security protocols
- Cross-Site Request Forgery (CSRF) protection
- Input sanitization and validation
- PCI-compliant payment processing
- Granular permission controls

## Data Architecture

### User Data Model

```typescript
interface User {
  name: string;
  email: string;
  password: string; // Stored with bcrypt encryption
  role: "user" | "admin";
  createdAt: Date;
}
````

### Product Data Model

```typescript
interface Product {
  name: string;
  description: string;
  price: number;
  category: "clothing" | "accessories";
  image: string; // Cloudinary URL
  stock: number;
  createdAt: Date;
}
```

### Order Data Model

```typescript
interface Order {
  userId: string; // Reference to User
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "completed" | "failed";
  paymentMethod: "khalti" | "esewa";
  shippingInfo: ShippingInfo;
  createdAt: Date;
}
```

## API Reference

### Authentication Endpoints

| Endpoint            | Method | Description                | Access Control |
| ------------------- | ------ | -------------------------- | -------------- |
| `/api/auth/signup`  | POST   | Create new user account    | Public         |
| `/api/auth/login`   | POST   | Authenticate existing user | Public         |
| `/api/auth/session` | GET    | Retrieve current session   | Authenticated  |

### Product Endpoints

| Endpoint            | Method | Description               | Access Control |
| ------------------- | ------ | ------------------------- | -------------- |
| `/api/products`     | GET    | Retrieve product catalog  | Public         |
| `/api/products/:id` | GET    | Retrieve specific product | Public         |
| `/api/products`     | POST   | Create new product        | Admin          |
| `/api/products/:id` | PUT    | Update existing product   | Admin          |
| `/api/products/:id` | DELETE | Remove product            | Admin          |

### Order Endpoints

| Endpoint                 | Method | Description             | Access Control |
| ------------------------ | ------ | ----------------------- | -------------- |
| `/api/orders`            | POST   | Create new order        | Authenticated  |
| `/api/orders`            | GET    | Retrieve user orders    | Authenticated  |
| `/api/orders/:id`        | GET    | Retrieve specific order | Authenticated  |
| `/api/orders/:id/status` | PUT    | Update order status     | Admin          |

### Payment Endpoints

| Endpoint                       | Method | Description            | Access Control |
| ------------------------------ | ------ | ---------------------- | -------------- |
| `/api/payment/khalti`          | POST   | Process Khalti payment | Authenticated  |
| `/api/payment/esewa`           | POST   | Process eSewa payment  | Authenticated  |
| `/api/payment/status/:orderId` | GET    | Verify payment status  | Authenticated  |

## Quality Assurance

1. Unit testing suite:

   ```bash
   npm run test
   ```

2. Integration testing suite:
   ```bash
   npm run test:integration
   ```

## Deployment Protocol

1. Production build generation:

   ```bash
   npm run build
   ```

2. Production server initialization:
   ```bash
   npm start
   ```

## Development Team

- **Frontend Architecture**: [ppprabesh]
- **Backend Architecture**: [nirjal9]

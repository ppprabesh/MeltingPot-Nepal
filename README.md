# The Melting Pot - E-Commerce Platform

## Project Overview

The Melting Pot is a modern e-commerce platform built with Next.js 14, featuring a comprehensive online shopping experience for clothing and accessories. The platform incorporates secure payment gateways, user authentication, and a seamless shopping experience.

## Table of Contents

1. [Features](#features)
2. [Technical Stack](#technical-stack)
3. [Project Structure](#project-structure)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Payment Integration](#payment-integration)
7. [Security Features](#security-features)
8. [Database Schema](#database-schema)
9. [API Documentation](#api-documentation)
10. [Testing](#testing)
11. [Deployment](#deployment)
12. [Contributors](#contributors)

## Features

- **User Authentication**

  - Secure login/signup system
  - Session management
  - Role-based access control (Admin/User)

- **Product Management**

  - Product listing and categorization
  - Detailed product pages
  - Image upload and management
  - Inventory tracking

- **Shopping Experience**

  - Shopping cart functionality
  - Wishlist feature
  - Product search and filtering
  - Responsive design

- **Payment Integration**

  - Khalti payment gateway
  - eSewa payment gateway
  - Secure transaction processing
  - Order tracking

- **Admin Dashboard**
  - Product management
  - Order management
  - User management
  - Analytics and reporting

## Technical Stack

- **Frontend**

  - Next.js 14
  - React
  - TypeScript
  - Tailwind CSS
  - Shadcn UI Components

- **Backend**

  - Next.js API Routes
  - MongoDB
  - Mongoose ODM
  - NextAuth.js

- **Payment Gateways**

  - Khalti
  - eSewa

- **Cloud Services**
  - Cloudinary (Image Storage)
  - MongoDB Atlas (Database)

## Project Structure

```
melting-pot/
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── admin/
│   │   ├── clothing/
│   │   ├── accessories/
│   │   ├── checkout/
│   │   └── payment/
│   ├── components/
│   ├── context/
│   ├── lib/
│   └── models/
├── public/
└── .env.local
```

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/theMeltingPot.git
   cd theMeltingPot
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Configuration

Create a `.env.local` file with the following variables:

```env
# Database
MONGODB_URI=your_mongodb_uri

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payment Gateways
NEXT_PUBLIC_BASE_URL=http://localhost:3000
ESEWA_MERCHANT_ID=your_esewa_merchant_id
ESEWA_MERCHANT_SECRET=your_esewa_secret
KHALTI_SECRET_KEY=your_khalti_secret_key
```

## Payment Integration

### Khalti Payment Gateway

- Test Credentials:
  - Test Khalti ID: 9800000000
  - Test MPIN: 1111
  - Test OTP: 987654

### eSewa Payment Gateway

- Test Credentials:
  - Merchant ID: EPAYTEST
  - Secret Key: 8gBm/:&EnhH.1/q
  - Test Esewa ID: 9806800001
  - Test Password: Nepal@123
  - Test MPIN: 1122

## Security Features

- Secure authentication with NextAuth.js
- Environment variable protection
- CSRF protection
- Input validation
- Secure payment processing
- Role-based access control

## Database Schema

### User Model

```typescript
interface User {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt: Date;
}
```

### Product Model

```typescript
interface Product {
  name: string;
  description: string;
  price: number;
  category: "clothing" | "accessories";
  image: string;
  stock: number;
  createdAt: Date;
}
```

### Order Model

```typescript
interface Order {
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "completed" | "failed";
  paymentMethod: "khalti" | "esewa";
  shippingInfo: ShippingInfo;
  createdAt: Date;
}
```

## API Documentation

### Authentication Endpoints

- POST /api/auth/signup
- POST /api/auth/login
- GET /api/auth/session

### Product Endpoints

- GET /api/products
- GET /api/products/:id
- POST /api/products (Admin only)
- PUT /api/products/:id (Admin only)
- DELETE /api/products/:id (Admin only)

### Order Endpoints

- POST /api/orders
- GET /api/orders
- GET /api/orders/:id
- PUT /api/orders/:id/status

### Payment Endpoints

- POST /api/payment/khalti
- POST /api/payment/esewa
- GET /api/payment/status/:orderId

## Testing

1. Unit Tests:

   ```bash
   npm run test
   ```

2. Integration Tests:
   ```bash
   npm run test:integration
   ```

## Deployment

1. Build the application:

   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Contributors

- [Your Name] - Project Lead
- [Team Member 1] - Frontend Developer
- [Team Member 2] - Backend Developer
- [Team Member 3] - UI/UX Designer

## License

This project is licensed under the MIT License - see the LICENSE file for details.

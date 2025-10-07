# Seller Order Management System

This document describes the new seller order management functionality implemented in the Garissa e-commerce platform.

## Overview

The seller order management system allows sellers to:
- View all orders containing their products
- Update order statuses (pending → processing → shipped → delivered)
- Cancel orders when necessary
- Receive real-time notifications when buyers place orders
- Track order statistics and revenue

## Features Implemented

### Backend Features

#### 1. New API Endpoints (`routes/seller_orders.py`)

- `GET /seller/orders` - Get paginated list of orders containing seller's products
- `PATCH /seller/orders/<order_id>/status` - Update order status
- `GET /seller/orders/stats` - Get order statistics and revenue data
- `GET /seller/orders/<order_id>` - Get detailed order information
- `GET /seller/notifications` - Get seller notifications
- `PATCH /seller/notifications/<notification_id>/read` - Mark notification as read

#### 2. Enhanced Order Creation (`routes/checkout.py`)

- Automatic notification creation when buyers place orders
- Notifications sent to all sellers whose products are in the order
- Prevents duplicate notifications per seller per order

#### 3. Database Models

All necessary models already existed:
- `Order` - Main order information
- `OrderItem` - Individual product items in orders
- `Product` - Product details with seller relationships
- `Notification` - System notifications
- `User` - User accounts (buyers/sellers)

### Frontend Features

#### 1. Enhanced SellerOrders Component (`src/sellers/SellerOrders.jsx`)

- **Real-time Order Display**: Shows all orders containing seller's products
- **Status Management**: Buttons to update order statuses based on current state
- **Order Statistics**: Dashboard showing pending, processing, shipped, delivered counts
- **Revenue Tracking**: Total revenue from delivered orders
- **Filtering**: Filter orders by status (all, pending, processing, shipped, delivered, cancelled)
- **Pagination**: Handle large numbers of orders efficiently
- **Responsive Design**: Works on desktop and mobile devices

#### 2. Seller Notifications Component (`src/sellers/SellerNotifications.jsx`)

- **Notification Display**: Shows all seller notifications with read/unread status
- **Mark as Read**: Ability to mark notifications as read
- **Real-time Updates**: Automatic refresh of notification status
- **Type-based Styling**: Different colors and icons for different notification types

## Order Status Workflow

```
pending → processing → shipped → delivered
    ↓
cancelled (only from pending/processing)
```

### Status Actions Available:

1. **Pending Orders**: 
   - Accept (→ processing)
   - Cancel (→ cancelled)

2. **Processing Orders**:
   - Ship (→ shipped)  
   - Cancel (→ cancelled)

3. **Shipped Orders**:
   - Mark as Delivered (→ delivered)

4. **Delivered/Cancelled Orders**:
   - No further actions available

## How It Works

### When a Buyer Places an Order:

1. Order is created with status "pending"
2. System identifies all sellers whose products are in the order
3. Notifications are automatically sent to each seller
4. Sellers see the new order in their dashboard
5. Sellers can take action on the order

### Seller Workflow:

1. **Login** to seller dashboard
2. **Navigate** to Orders tab
3. **View** all orders containing their products
4. **Filter** orders by status if needed
5. **Take Actions** on orders:
   - Accept pending orders
   - Ship processing orders  
   - Mark shipped orders as delivered
   - Cancel orders when necessary
6. **Check Notifications** for new order alerts
7. **Track Statistics** and revenue

## Technical Details

### Authentication
- Uses session-based authentication
- Sellers must be logged in with `account_type: 'seller'`
- Proper authorization checks on all endpoints

### Database Queries
- Efficient joins between Order, OrderItem, and Product tables
- Only shows orders containing seller's products
- Calculates seller-specific subtotals (not full order totals)

### Frontend State Management
- Uses React hooks for state management
- Real-time updates when order statuses change
- Error handling with toast notifications

## Setup Instructions

### Backend Setup:

1. **Install Requirements**:
   ```bash
   cd Backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Run Database Migrations**:
   ```bash
   export FLASK_APP=run.py
   flask db upgrade
   ```

3. **Create Test Data**:
   ```bash
   python create_test_users.py
   python create_test_products.py
   ```

4. **Start Server**:
   ```bash
   python run.py
   ```

### Frontend Setup:

1. **Install Dependencies**:
   ```bash
   cd Frontend
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

## Testing the Functionality

### Test Scenario:

1. **Login as a seller** (`seller1@garissa.com` / `Seller123`)
2. **Navigate to seller dashboard** (`/seller/orders`)
3. **Create test orders** by logging in as a buyer and purchasing seller's products
4. **Check seller dashboard** to see new orders appear
5. **Update order statuses** using the action buttons
6. **Check notifications** for order alerts
7. **Verify statistics** update correctly

### Test User Credentials:

- **Seller 1**: `seller1@garissa.com` / `Seller123`
- **Seller 2**: `seller2@garissa.com` / `Seller123`  
- **Buyer 1**: `buyer1@garissa.com` / `Buyer123`
- **Buyer 2**: `buyer2@garissa.com` / `Buyer123`

## API Response Examples

### Get Seller Orders Response:
```json
{
  "orders": [
    {
      "id": 1,
      "order_number": "ORD-20241007-ABC123",
      "buyer": {
        "id": 3,
        "name": "John Buyer",
        "email": "buyer1@garissa.com"
      },
      "status": "pending",
      "seller_items": [
        {
          "id": 1,
          "product_name": "Samsung Galaxy S24",
          "quantity": 1,
          "price": 75000,
          "subtotal": 75000
        }
      ],
      "seller_subtotal": 75000,
      "created_at": "2024-10-07T10:30:00Z"
    }
  ],
  "total": 1,
  "pages": 1,
  "current_page": 1
}
```

### Order Statistics Response:
```json
{
  "stats": {
    "pending": 2,
    "processing": 1,
    "shipped": 0,
    "delivered": 3,
    "cancelled": 0,
    "total_orders": 6,
    "total_revenue": 225000.0
  }
}
```

## Security Considerations

- All endpoints require seller authentication
- Sellers can only see orders containing their products
- Order status updates are validated for logical progression
- Proper error handling and input validation
- CORS configuration for frontend-backend communication

## Future Enhancements

- Real-time WebSocket notifications
- Order dispute management
- Bulk order status updates
- Advanced filtering and search
- Export orders to CSV/PDF
- Order analytics and reporting
- Integration with shipping providers
- Automated order status updates

## Support

If you encounter any issues with the seller order management system:

1. Check the browser console for JavaScript errors
2. Check the Flask server logs for API errors
3. Verify user authentication and permissions
4. Ensure database migrations are up to date
5. Test API endpoints directly using curl or Postman
# Payment Integration Guide - How to Buy Subscription

## Overview
The subscription system now includes complete payment processing using both **Razorpay** (for Indian users) and **Stripe** (for international users).

## 🚀 Quick Setup

### 1. Install Payment Dependencies
```bash
cd backend
pip install razorpay stripe
```

### 2. Environment Variables Setup
Add these to your `.env` file:

```env
# Razorpay Configuration (for Indian payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Stripe Configuration (for international payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## 💳 Payment Flow

### Step 1: Get Available Plans
```javascript
GET /api/subscription-plans

Response:
{
  "plans": [
    {
      "id": "monthly",
      "name": "Premium Monthly",
      "price": {"inr": 299, "usd": 3.99},
      "features": ["Unlimited chat", "Unlimited itineraries", ...]
    },
    {
      "id": "yearly", 
      "name": "Premium Yearly",
      "price": {"inr": 2499, "usd": 29.99},
      "savings": "30%",
      "features": [...]
    }
  ]
}
```

### Step 2: Create Payment Order
```javascript
POST /api/create-payment-order
{
  "payment_method": "razorpay", // or "stripe"
  "plan": "monthly" // or "yearly"
}

// Razorpay Response:
{
  "payment_gateway": "razorpay",
  "order_id": "order_xyz123",
  "amount": 299,
  "currency": "INR",
  "key_id": "rzp_test_xyz"
}

// Stripe Response:
{
  "payment_gateway": "stripe",
  "session_id": "cs_test_xyz123",
  "checkout_url": "https://checkout.stripe.com/pay/cs_test_xyz123"
}
```

### Step 3: Process Payment

#### For Razorpay (Indian Users):
```html
<!-- Include Razorpay checkout script -->
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>

<script>
// Frontend Razorpay integration
const options = {
  "key": "rzp_test_xyz", // Your Razorpay Key ID
  "amount": 29900, // Amount in paise (299 INR)
  "currency": "INR",
  "name": "The Modern Chanakya",
  "description": "Premium Monthly Subscription",
  "order_id": "order_xyz123", // From create-payment-order API
  "handler": function (response) {
    // Verify payment on backend
    verifyPayment({
      payment_gateway: "razorpay",
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature
    });
  },
  "prefill": {
    "name": "User Name",
    "email": "user@example.com"
  },
  "theme": {
    "color": "#F37254"
  }
};

const rzp = new Razorpay(options);
rzp.open();
</script>
```

#### For Stripe (International Users):
```javascript
// Redirect to Stripe Checkout
window.location.href = checkoutUrl; // From create-payment-order API

// Or use Stripe Elements for embedded checkout
```

### Step 4: Verify Payment
```javascript
POST /api/verify-payment

// For Razorpay:
{
  "payment_gateway": "razorpay",
  "razorpay_order_id": "order_xyz123",
  "razorpay_payment_id": "pay_xyz123",
  "razorpay_signature": "signature_hash"
}

// For Stripe:
{
  "payment_gateway": "stripe",
  "session_id": "cs_test_xyz123"
}

// Success Response:
{
  "success": true,
  "message": "Payment verified and subscription upgraded successfully!",
  "plan": "monthly",
  "expiry_date": "2025-09-05T10:30:00Z"
}
```

## 🛡️ Security Features

### Payment Verification
- **Razorpay**: HMAC signature verification using webhook secret
- **Stripe**: Session verification with Stripe API
- **Database**: Secure payment record tracking
- **User Upgrade**: Automatic subscription activation

### Data Protection
- Payment credentials stored securely in environment variables
- Payment records tracked in separate collection
- User subscription status updated atomically
- Expiry dates calculated and stored

## 📱 Frontend Integration

### React Component Example:
```jsx
import { useState } from 'react';

function SubscriptionPlans() {
  const [loading, setLoading] = useState(false);
  
  const handleSubscribe = async (plan, paymentMethod) => {
    setLoading(true);
    
    try {
      // Step 1: Create payment order
      const orderResponse = await fetch('/api/create-payment-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          payment_method: paymentMethod,
          plan: plan
        })
      });
      
      const orderData = await orderResponse.json();
      
      if (paymentMethod === 'razorpay') {
        // Initialize Razorpay
        const options = {
          key: orderData.key_id,
          amount: orderData.amount * 100,
          currency: orderData.currency,
          name: "The Modern Chanakya",
          description: `Premium ${plan} Subscription`,
          order_id: orderData.order_id,
          handler: async (response) => {
            // Verify payment
            await verifyPayment({
              payment_gateway: 'razorpay',
              ...response
            });
          }
        };
        
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else if (paymentMethod === 'stripe') {
        // Redirect to Stripe
        window.location.href = orderData.checkout_url;
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const verifyPayment = async (paymentData) => {
    try {
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('Subscription activated successfully!');
        // Refresh user data
        window.location.reload();
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
    }
  };
  
  return (
    <div className="subscription-plans">
      <div className="plan-card">
        <h3>Premium Monthly</h3>
        <p>₹299/month</p>
        <button 
          onClick={() => handleSubscribe('monthly', 'razorpay')}
          disabled={loading}
        >
          Subscribe with Razorpay
        </button>
        <button 
          onClick={() => handleSubscribe('monthly', 'stripe')}
          disabled={loading}
        >
          Subscribe with Stripe
        </button>
      </div>
      
      <div className="plan-card">
        <h3>Premium Yearly</h3>
        <p>₹2,499/year</p>
        <span className="savings">Save 30%</span>
        <button 
          onClick={() => handleSubscribe('yearly', 'razorpay')}
          disabled={loading}
        >
          Subscribe with Razorpay
        </button>
        <button 
          onClick={() => handleSubscribe('yearly', 'stripe')}
          disabled={loading}
        >
          Subscribe with Stripe
        </button>
      </div>
    </div>
  );
}
```

## 🔧 Testing

### Test Payment Credentials

#### Razorpay Test Mode:
```
Key ID: rzp_test_your_key_id
Key Secret: your_test_key_secret

Test Cards:
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date
```

#### Stripe Test Mode:
```
Secret Key: sk_test_your_secret_key
Publishable Key: pk_test_your_publishable_key

Test Cards:
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002
- CVV: Any 3 digits
- Expiry: Any future date
```

## 📊 Payment Tracking

### Database Collections:

#### Payments Collection:
```javascript
{
  "_id": ObjectId,
  "user_email": "user@example.com",
  "payment_gateway": "razorpay", // or "stripe"
  "order_id": "order_xyz123", // Razorpay order ID
  "session_id": "cs_xyz123", // Stripe session ID
  "amount": 299,
  "currency": "INR",
  "plan": "monthly",
  "status": "completed", // created, completed, failed
  "created_at": DateTime,
  "completed_at": DateTime
}
```

#### Updated Users Collection:
```javascript
{
  // ... existing fields ...
  "subscription_plan": "monthly", // or "yearly"
  "subscription_start_date": DateTime,
  "subscription_expiry_date": DateTime,
  "has_premium_subscription": true
}
```

## 🎯 Complete Implementation

### API Endpoints:
- ✅ `GET /api/subscription-plans` - Available plans
- ✅ `POST /api/create-payment-order` - Initialize payment
- ✅ `POST /api/verify-payment` - Verify and activate subscription
- ✅ `GET /api/subscription-status` - Check current status

### Features:
- ✅ Multi-gateway support (Razorpay + Stripe)
- ✅ Secure payment verification
- ✅ Automatic subscription activation
- ✅ Payment tracking and history
- ✅ Expiry date management
- ✅ Test mode support

## 🚀 Go Live Checklist

1. **Setup Payment Accounts:**
   - Create Razorpay merchant account
   - Create Stripe merchant account
   - Get API keys and webhook secrets

2. **Configure Environment:**
   - Add production API keys to `.env`
   - Set webhook URLs in payment gateways
   - Configure success/cancel URLs

3. **Test Everything:**
   - Test both payment gateways
   - Verify subscription activation
   - Test payment failure scenarios
   - Verify webhook handling

4. **Deploy:**
   - Deploy backend with payment integration
   - Update frontend with payment buttons
   - Monitor payment transactions

Your subscription system is now complete with payment processing! 🎉

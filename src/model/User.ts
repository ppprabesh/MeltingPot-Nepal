import mongoose, { model, models } from 'mongoose';
import { Product } from './Product'; // Import from your existing Product model

// CartItem interface
export interface CartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
}

// User interface extending mongoose Document
export interface User extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  cart: CartItem[];
  addToCart: (productId: string, quantity: number) => Promise<any>;
  removeFromCart: (productId: string) => Promise<any>;
  updateCartItemQuantity: (productId: string, quantity: number) => Promise<any>;
  clearCart: () => Promise<any>;
  role: string;
}

// User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cart: [{
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    quantity: { 
      type: Number, 
      required: true, 
      min: 1, 
      default: 1 
    }
  }],
  addresses: [{
    street: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true }
  }],
  digitalWallet: {
    balance: { type: Number, default: 0 },
    transactions: [{
      amount: { type: Number, required: true },
      type: { 
        type: String, 
        enum: ['deposit', 'purchase'], 
        required: true 
      },
      date: { type: Date, default: Date.now }
    }]
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

// Methods for cart management
userSchema.methods.addToCart = function(productId: string, quantity: number = 1) {
  const existingCartItemIndex = this.cart.findIndex(
    (item: CartItem) => item.product.toString() === productId
  );

  if (existingCartItemIndex > -1) {
    // Update quantity if product already in cart
    this.cart[existingCartItemIndex].quantity += quantity;
  } else {
    // Add new item to cart
    this.cart.push({ product: productId, quantity });
  }

  return this.save();
};

userSchema.methods.removeFromCart = function(productId: string) {
  this.cart = this.cart.filter(
    (item: CartItem) => item.product.toString() !== productId
  );
  return this.save();
};

userSchema.methods.updateCartItemQuantity = function(productId: string, quantity: number) {
  const cartItemIndex = this.cart.findIndex(
    (item: CartItem) => item.product.toString() === productId
  );

  if (cartItemIndex > -1) {
    if (quantity > 0) {
      this.cart[cartItemIndex].quantity = quantity;
    } else {
      this.cart.splice(cartItemIndex, 1);
    }
  }

  return this.save();
};

userSchema.methods.clearCart = function() {
  this.cart = [];
  return this.save();
};

// Check if model already exists, then export it
export const User = models.User || model('User', userSchema);

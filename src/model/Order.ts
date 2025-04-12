import mongoose from "mongoose";

export interface Order {
  user: mongoose.Types.ObjectId;
  products: Array<{
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  paymentMethod: 'digitalWallet' | 'creditCard';
}

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  products: [{
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'shipped', 'delivered'], 
    default: 'pending' 
  },
  paymentMethod: { 
    type: String, 
    enum: ['digitalWallet', 'creditCard'], 
    required: true 
  }
}, { timestamps: true });

export const OrderModel = mongoose.model<Order>('Order', orderSchema);
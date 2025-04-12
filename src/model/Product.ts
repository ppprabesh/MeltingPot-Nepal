// File: src/models/Product.ts
import mongoose, { model, models } from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true},
  price: { type: Number , required: true },
  stock: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  type: { type: String, enum: ['Clothing', 'Accessories'], required: true },
  
  // Conditional fields for Clothing
  description: { type: String },
  size: { type: String },
  color: { type: String },
  material: { type: String },
  
  // Conditional fields for Accessories
  subType: { type: String, enum: ['Hammock', 'Bag'] },
  maxWeight: { type: Number },
  volume: { type: Number }
}, { 
  discriminators: true,
  timestamps: true 
});

export const Product = models.Product || model('Product', productSchema);

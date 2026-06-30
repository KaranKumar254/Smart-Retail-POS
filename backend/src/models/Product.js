import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    barcode: { type: String, required: true, unique: true, trim: true },
    category: {
      type: String,
      enum: ['Grocery', 'Beverages', 'Electronics', 'Fitness', 'Accessories', 'Home'],
      default: 'Grocery',
    },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    threshold: { type: Number, default: 15 },
    description: { type: String, default: '' },
    sold: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    warehouse: { type: String, default: 'Warehouse A' },
    store: { type: String, default: 'Central Flagship' },
  },
  { timestamps: true },
);

productSchema.index({ name: 'text', sku: 'text', barcode: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;



const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    sku: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: { type: String, default: 'Walk-in Customer' },
    items: { type: [orderItemSchema], required: true },
    itemsCount: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    gst: { type: Number, required: true, default: 0 },
    discount: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    payment: { type: String, enum: ['Cash', 'Card', 'UPI'], default: 'Cash' },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    store: { type: String, default: 'Central Flagship' },
  },
  { timestamps: true },
);

const Order = mongoose.model('Order', orderSchema);

export default Order;

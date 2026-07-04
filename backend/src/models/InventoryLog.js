import mongoose from 'mongoose';

const inventoryLogSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    warehouse: { type: String, default: 'Warehouse A' },
    store: { type: String, default: 'Central Flagship' },
    change: { type: Number, required: true }, // +ve = stock in, -ve = stock out
    reason: { type: String, default: 'Manual adjustment' },
    resultingStock: { type: Number, required: true },
  },
  { timestamps: true },
);

const InventoryLog = mongoose.model('InventoryLog', inventoryLogSchema);



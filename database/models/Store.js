import { Schema, model, Decimal128 } from 'mongoose';

const StoreSchema = new Schema({
  guildID: Decimal128,
  items: { type: Array, default: [] },
});

export default new model('Store', StoreSchema);

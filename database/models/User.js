import { Schema, model, Decimal128 } from 'mongoose';

const UserSchema = new Schema({
  userID: Decimal128,
  inventory: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default new model('User', UserSchema);

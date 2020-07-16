import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  userID: Number,
  inventory: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default new model('User', UserSchema);

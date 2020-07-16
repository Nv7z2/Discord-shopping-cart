import { Schema, model } from 'mongoose';

const StoreSchema = new Schema({
  guildID: Number,
  items: Array,
});

export default new model('Store', StoreSchema);

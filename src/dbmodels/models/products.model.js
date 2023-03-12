import { Schema, model } from "mongoose";

const productsCollection = "products";

const productsSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  thumbnails: [String],
  user: {
    type: String,
    required: true,
  },
  product: {
    type: String,
    required: true,
  },
});

export const productsModel = model(productsCollection, productsSchema);
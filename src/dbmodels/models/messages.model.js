import { Schema, model } from "mongoose";

const messagesCollection = "messages";

const messagesSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

export const messagesModel = model(messagesCollection, messagesSchema);
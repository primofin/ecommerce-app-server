import mongoose, { Document, Schema } from 'mongoose'
import { ProductDocument } from './Product'

export type UserDocument = Document & {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin: boolean;
  isBan: boolean;
  itemsInCart: ProductDocument[];
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  isAdmin: {
    type: Boolean,
  },
  isBan: {
    type: Boolean,
  },
  itemInCart: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  date: {
    type: Date,
    default: Date.now(),
  },
})

export default mongoose.model<UserDocument>('User', userSchema)

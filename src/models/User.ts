import mongoose, { Document, Schema } from 'mongoose'
import { ProductDocument } from './Product'

export type UserDocument = Document & {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  hash: string;
  salt: string;
  isAdmin: boolean;
  isBan: boolean;
  itemsInCart: ProductDocument[];
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  hash: {
    type: String,
  },
  salt: {
    type: String,
  },
  email: {
    type: String,
    required: true,
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

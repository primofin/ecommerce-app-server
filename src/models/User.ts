import mongoose, { Document, Schema } from 'mongoose'
import validator from 'validator'

import { ProductDocument } from './Product'

export type Google = {
  id: string;
  token: string;
  name: string;
}
export type UserDocument = Document & {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar: string;
  google: Google;
  isAdmin: boolean;
  isBan: boolean;
  itemsInCart: ProductDocument[];
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
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
    minlength: 6,
    maxlength: 255,
    validate: {
      validator: (email: string) => validator.isEmail(email),
      message: '{VALUE} is not a valid email',
    },
  },
  password: {
    type: String,
    minlength: 6,
    maxlength: 1024,
  },
  avatar: {
    type: String
  },
  google: {
    id: String,
    name: String,
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

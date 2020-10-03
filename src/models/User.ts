import mongoose, { Document } from 'mongoose'

export type UserDocument = Document & {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  hash: string;
  salt: string;
  isAdmin: boolean;
  isBan: boolean;
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
  date: {
    type: Date,
    default: Date.now(),
  },
})

export default mongoose.model<UserDocument>('User', userSchema)

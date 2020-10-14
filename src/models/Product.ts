import mongoose, { Document, Schema } from 'mongoose'

import { UserDocument } from './User'

export type ProductDocument = Document & {
  name: string;
  price: number;
  images: string[];
  description: string;
  category: string;
  variants: string[];
  // sizes: string[] | number[];
  size: string | number;
  orderBy: UserDocument | null;
}

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  variants: {
    type: [String],
  },
  // sizes: {
  //   type: mongoose.Schema.Types.Mixed,
  //   required: true,
  // },
  size: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  orderBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
})

export default mongoose.model<ProductDocument>('Product', productSchema)

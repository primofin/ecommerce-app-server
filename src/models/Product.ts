import mongoose, { Document } from 'mongoose'

export type ProductDocument = Document & {
  name: string;
  description: string;
  category: string;
  variants: string[];
  sizes: string[] & number[];
}

const productSchema = new mongoose.Schema({
  name: {
    type: String,
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
  sizes: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
})

export default mongoose.model<ProductDocument>('Product', productSchema)

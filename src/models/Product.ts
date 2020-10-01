import mongoose, { Document } from 'mongoose'

type VariantObject = {
  [key: string]: string;
}
export type ProductDocument = Document & {
  name: string;
  description: string;
  category: string;
  variants: VariantObject;
  sizes: string[] | number[];
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
  },
  variants: {
    type: mongoose.Schema.Types.Mixed,
  },
  sizes: {
    type: [String] || [Number],
  },
})

export default mongoose.model<ProductDocument>('Product', productSchema)

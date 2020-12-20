import { Schema, model, Model, Document } from 'mongoose';
import { BaseDocument, BaseModel } from './base';

export interface PostAttrs {
  title: string;
  url: string;
  content: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PostDocument extends BaseDocument, PostAttrs {}

export interface PostModel extends BaseModel<PostAttrs, PostDocument> {}

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true, unique: true, lowercase: true },
    content: { type: String, required: true },
    image: { type: String },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: Date,
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

PostSchema.statics.build = (attrs: PostAttrs) => new Post(attrs);

export const Post = model<PostDocument, PostModel>('Post', PostSchema);

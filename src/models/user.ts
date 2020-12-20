import { PostAttrs } from './post';
import { Schema, model, Model, Document } from 'mongoose';

export interface UserAttrs {
  name: string;
  email: string;
  password: string;
  username?: string;
  createdAt?: Date;
  posts?: PostAttrs[];
}

export interface UserDocument extends Document, UserAttrs {}

interface UserModel extends Model<UserDocument> {
  build(attrs: UserAttrs): UserDocument;
}

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
    posts: [
      {
        ref: 'Post',
        type: Schema.Types.ObjectId,
      },
    ],
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

UserSchema.statics.build = (attrs: UserAttrs) => new User(attrs);

export const User = model<UserDocument, UserModel>('User', UserSchema);

import { Model, Document } from 'mongoose';

export interface BaseAttrs {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BaseDocument extends Document, BaseAttrs {}

export interface BaseModel<T extends BaseAttrs, D extends BaseDocument>
  extends Model<D> {
  build(attrs: T): BaseDocument;
}

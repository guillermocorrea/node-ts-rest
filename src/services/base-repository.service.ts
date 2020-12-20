import { BaseAttrs, BaseDocument } from './../models/base';
import { BaseModel } from '../models/base';
import { IBaseRepositoryService } from './../interfaces/base-repository.service.interface';

export abstract class BaseRepositoryService<
  K,
  T extends BaseAttrs,
  D extends BaseDocument
> implements IBaseRepositoryService<K, T> {
  constructor(private model: BaseModel<T, D>) {}

  async getAll(): Promise<T[]> {
    return this.model.find({}) as any;
  }

  async getById(id: K): Promise<T> {
    return this.model.findById(id) as any;
  }

  async create(entity: T): Promise<T> {
    return this.model.create(entity as any) as any;
  }

  async update(id: K, entity: T): Promise<T> {
    entity.updatedAt = new Date();
    return this.model.findOneAndUpdate({ _id: id as any }, entity as any, {
      new: true,
      useFindAndModify: false,
      omitUndefined: true,
    }) as any;
  }

  async delete(id: K): Promise<void> {
    await this.model.deleteOne({ _id: id });
  }
}

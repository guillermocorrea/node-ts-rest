import { BaseAttrs } from './../models/base';
export interface IBaseRepositoryService<key, T extends BaseAttrs> {
  getAll: () => Promise<T[]>;
  getById: (id: key) => Promise<T>;
  create: (entity: T) => Promise<T>;
  update: (id: key, entity: T) => Promise<T>;
  delete: (id: key) => Promise<void>;
}

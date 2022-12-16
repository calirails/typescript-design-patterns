export interface Indexable {
  id: string;
}

export interface StorableEntity extends Indexable {
  createdAt: Date;
  updatedAt: Date;
}

export interface Indexable {
  id: string;
}

export interface StorableEntity extends Indexable {
  createdAt: Date;
  updatedAt: Date;
}

export interface Person {
  id: string;
  name: string;
  description: string;
}

export interface Engineer extends Person {
  project?: string;
  role: string;
  level: number;
  pay?: number;
}

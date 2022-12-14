import { ObservableDatabase } from "../database/engine";
import { Indexable } from "./../database/entities";
import { Person } from "../gang-of-four/models/schema";
import * as fs from "fs";

interface RecordHandler<T> {
  addRecord(item: T): void;
}

export function loadRecords<T>(fileName: string, handler: RecordHandler<T>) {
  const serializedRecords: T[] = JSON.parse(
    fs.readFileSync(fileName).toString()
  );
  serializedRecords.forEach((serializedInstance) =>
    handler.addRecord(serializedInstance)
  );
}

export class RecordAdapter<T extends Indexable> implements RecordHandler<T> {
  protected _name: string | undefined;
  protected _database: ObservableDatabase<T> | undefined;

  public name(name: string) {
    this._name = name;
    return this;
  }

  public database(database: ObservableDatabase<T>) {
    this._database = database;
    return this;
  }

  public addRecord(item: T): void {
    if (!this._database) {
      throw new Error("Database instance must be set via database property");
    }
    this._database.set(item);
  }
}

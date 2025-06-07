"use server";

import { MongoClient, Db } from 'mongodb';
import { config } from "@/util/envConfigLoader";

const uri = config.MONGO_URI;
const client = new MongoClient(uri);

let db: Db;

export async function connectDB(): Promise<Db> {
  if (!db) {
    await client.connect();
    db = client.db();
    console.log('✅ Połączono z MongoDB');
  }
  return db;
}
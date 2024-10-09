import { openDB } from 'idb';

const DB_NAME = 'NextShopDB';
const STORE_NAME = 'products';

async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    },
  });
}

export async function getProductFromCache(id) {
  const db = await initDB();
  return db.get(STORE_NAME, id);
}

export async function cacheProduct(product) {
  const db = await initDB();
  return db.put(STORE_NAME, product);
}

export async function clearProductCache() {
  const db = await initDB();
  return db.clear(STORE_NAME);
}
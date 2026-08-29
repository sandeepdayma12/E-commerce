const DB_NAME = "shopix_frontend";
const DB_VERSION = 1;
const STORE_NAME = "keyValue";

const isIndexedDbAvailable = () =>
  typeof window !== "undefined" && "indexedDB" in window;

const openDatabase = () =>
  new Promise((resolve, reject) => {
    if (!isIndexedDbAvailable()) {
      reject(new Error("IndexedDB is not available in this browser."));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const withStore = async (mode, callback) => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const request = callback(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
};

export const getCachedValue = async (key) => {
  try {
    const record = await withStore("readonly", (store) => store.get(key));
    return record?.value ?? null;
  } catch (error) {
    console.warn("IndexedDB read failed:", error);
    return null;
  }
};

export const setCachedValue = async (key, value) => {
  try {
    await withStore("readwrite", (store) =>
      store.put({
        key,
        value,
        updatedAt: Date.now(),
      })
    );
  } catch (error) {
    console.warn("IndexedDB write failed:", error);
  }
};

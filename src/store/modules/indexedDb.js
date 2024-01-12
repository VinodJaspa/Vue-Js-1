export default class IndexedDBService {
    constructor(dbName, storeName) {
      this.dbName = dbName;
      this.storeName = storeName;
      this.db = null;
    }
  
    async openDatabase() {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, 1);
  
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
        };
  
        request.onsuccess = () => {
          this.db = request.result;
          resolve();
        };
  
        request.onerror = () => {
          reject(new Error('Error opening database'));
        };
      });
    }
  
    async addData(data) {
      if (!this.db) {
        await this.openDatabase();
      }
  
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.add(data);
  
        request.onsuccess = () => {
          resolve(request.result);
        };
  
        request.onerror = () => {
          reject(new Error('Error adding data'));
        };
      });
    }
  
    async getData(id) {
      if (!this.db) {
        await this.openDatabase();
      }
  
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(id);
  
        request.onsuccess = () => {
          resolve(request.result);
        };
  
        request.onerror = () => {
          reject(new Error('Error getting data'));
        };
      });
    }
  
    async updateData(id, newData) {
      if (!this.db) {
        await this.openDatabase();
      }
  
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const getRequest = store.get(id);
  
        getRequest.onsuccess = () => {
          const existingData = getRequest.result;
  
          if (existingData) {
            const updatedData = { ...existingData, ...newData };
            const putRequest = store.put(updatedData);
  
            putRequest.onsuccess = () => {
              resolve();
            };
  
            putRequest.onerror = () => {
              reject(new Error('Error updating data'));
            };
          } else {
            reject(new Error('Data not found'));
          }
        };
  
        getRequest.onerror = () => {
          reject(new Error('Error getting data'));
        };
      });
    }
  
    async deleteData(id) {
      if (!this.db) {
        await this.openDatabase();
      }
  
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(id);
  
        request.onsuccess = () => {
          resolve();
        };
  
        request.onerror = () => {
          reject(new Error('Error deleting data'));
        };
      });
    }
  }
  
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
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(Number(id));
     
        request.onsuccess = () => {
          const rawResult = request.result;
          if (rawResult) {
     
            resolve(rawResult);
          } else {
            reject(new Error('Data not found'));
          }
        };
  
        request.onerror = () => {
          reject(new Error('Error getting data'));
          console.error('Error getting data:', event.target.error);
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
        const getRequest = store.get(Number(id));
    
        getRequest.onsuccess = () => {
          const existingData = getRequest.result;
    
          if (existingData) {
            // Use the existingData.id as the key when putting the newData
            const putRequest = store.put({ ...newData, id: existingData.id });
    
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
        const request = store.delete(Number(id));
  
        request.onsuccess = () => {
          resolve();
        };
  
        request.onerror = () => {
          reject(new Error('Error deleting data'));
        };
      });
    }
    async getAllData() {
      if (!this.db) {
        await this.openDatabase();
      }
  
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();
        request.onsuccess = () => {
          const rawResult = request.result;
          if (rawResult) {
            const formattedData = {
              data: {
                ...rawResult
              }
            };
            resolve(formattedData);
          } else {
            reject(new Error('Data not found'));
          }
        };
  
        request.onerror = () => {
          reject(new Error('Error getting all data'));
        };
      });
    }
    
// ... (previous code)

async searchData(query) {
  if (!this.db) {
    await this.openDatabase();
  }

  return new Promise((resolve, reject) => {
    const transaction = this.db.transaction([this.storeName], 'readonly');
    const store = transaction.objectStore(this.storeName);
console.log(query,"queryy");
    const lowercasedQuery = query.search.toLowerCase();

    const request = store.openCursor();

    const results = [];

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const item = cursor.value;

        // Perform case-insensitive search on the desired field
        const fieldValue = item.title.toLowerCase(); 
        if (fieldValue.includes(lowercasedQuery)) {
          
          results.push(item);
        }

        cursor.continue();
      } else {
        const formattedData = {
          data: {
            ...results
          }
      }
      resolve(formattedData);
    }
    };

    request.onerror = () => {
      reject(new Error('Error searching data'));
    };
  });
}


  }
  
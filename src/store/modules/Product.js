// import { GET_ALL_PRODUCTS } from "./Types";
import IndexedDBService from "./indexedDb";

// initial state
const state = () => ({
  products: [],
  productsPaginatedData: null,
  product: null,
  isLoading: false,
  isCreating: false,
  createdData: null,
  isUpdating: false,
  updatedData: null,
  isDeleting: false,
  deletedData: null,
});

// getters
const getters = {
  productList: (state) => state.products,
  productsPaginatedData: (state) => state.productsPaginatedData,
  product: (state) => state.product,
  isLoading: (state) => state.isLoading,
  isCreating: (state) => state.isCreating,
  isUpdating: (state) => state.isUpdating,
  createdData: (state) => state.createdData,
  updatedData: (state) => state.updatedData,

  isDeleting: (state) => state.isDeleting,
  deletedData: (state) => state.deletedData,
};
const dbName = "TestProducts";
const storeName = "productStore";

// actions
const actions = {
  async fetchAllProducts({ commit }, query = null) {
    let page = 1;
    let search = "";
    if (query !== null) {
      // eslint-disable-next-line no-unused-vars
      page = query?.page || 1;
      // eslint-disable-next-line no-unused-vars
      search = query?.search || "";
    }

    commit("setProductIsLoading", true);

    try {
      const dbService = new IndexedDBService(dbName, storeName);

      await dbService.openDatabase();

      // Fetch all products from IndexedDB
      const products = await dbService.getAllData();

      // Commit mutation to update the state with fetched products

      commit("setProducts", products);
      commit("setProductIsLoading", false);
    } catch (error) {
      console.error("Error fetching products from IndexedDB:", error);
      commit("setProductIsLoading", false);
    }
  },

  async fetchDetailProduct({ commit }, id) {
    console.log(id, "idd");
    commit("setProductIsLoading", true);

    try {
      const dbService = new IndexedDBService(dbName, storeName);

      await dbService.openDatabase();

      // Fetch a specific product from IndexedDB
      const product = await dbService.getData(id);

      // Commit mutation to update the state with the fetched product
      commit("setProductDetail", product);

      commit("setProductIsLoading", false);
      commit("setProductsPaginated", product);
    } catch (error) {
      console.error("Error fetching product from IndexedDB:", error);
      commit("setProductIsLoading", false);
    }
  },

  async storeProduct({ commit }, product) {
   
    commit("setProductIsCreating", true);

    try {
      // Save product in IndexedDB

      const dbService = new IndexedDBService(dbName, storeName);

      await dbService.openDatabase();
      await dbService.addData(product);

      // Commit mutation to indicate successful creation
      commit("saveNewProducts", product);
      commit("setProductIsCreating", false);
   
    } catch (error) {
      console.error("Error saving product to IndexedDB:", error);
      commit("setProductIsCreating", false);
    }
  },
  async updateProduct({ commit }, product) {

    commit("setProductIsUpdating", true);
  
    try {
      const dbService = new IndexedDBService(dbName, storeName);
  
      await dbService.openDatabase();
  
      // Convert product.id to a number
      const productId = Number(product.id);
  
      // Fetch the existing product from IndexedDB
      const existingProduct = await dbService.getData(productId);
  
      if (existingProduct) {
      
  
        // Update the product in IndexedDB
        await dbService.updateData(productId, product);
  
        // Commit mutation to indicate successful update
        commit("saveUpdatedProduct", product);
      } else {
        console.error("Product not found in IndexedDB");
      }
  
      commit("setProductIsUpdating", false);
    } catch (error) {
      console.error("Error updating product in IndexedDB:", error);
      commit("setProductIsUpdating", false);
    }
  },
  

  async deleteProduct({ commit }, id) {
    commit("setProductIsDeleting", true);

    try {
      const dbService = new IndexedDBService(dbName, storeName);

      await dbService.openDatabase();

      // Fetch the existing product from IndexedDB
      const existingProduct = await dbService.getData(Number(id));

      if (existingProduct) {
        // Delete the product from IndexedDB
        await dbService.deleteData(id);
        // Fetch all products again after deletion
      const updatedProducts = await dbService.getAllData();

      // Commit mutation to update the state with the new products
      commit("setProducts", updatedProducts);
      commit("setDeleteProduct", id);
        // Commit mutation to indicate successful deletion
        commit("setDeleteProduct", id);
      } else {
        console.error("Product not found in IndexedDB");
      }

     
    } catch (error) {
      console.error("Error deleting product in IndexedDB:", error);
      commit("setProductIsDeleting", false);
    }
  },
  async searchProducts({ commit }, query) {
    commit("setProductIsLoading", true);

    try {
      const dbService = new IndexedDBService(dbName, storeName);

      await dbService.openDatabase();

      // Fetch products based on search query from IndexedDB
      const products = await dbService.searchData(query);
     

      // Commit mutation to update the state with fetched products
      commit("setProducts", products);

      commit("setProductIsLoading", false);
    } catch (error) {
      console.error("Error searching products in IndexedDB:", error);
      commit("setProductIsLoading", false);
    }
  },
   updateProductInput({ commit }, e) {
    commit('setProductDetailInput', e);
   },
  
};

// mutations
// mutations
const mutations = {
  setProducts: (state, products) => {
    state.products = products;
  },
  

  setProductsPaginated: (state, productsPaginatedData) => {
    state.productsPaginatedData = productsPaginatedData;
  },

  setProductDetail: (state, product) => {
    state.product = product;
  },

  setProductDetailInput: (state, e) => {
    let product = state.product;
    product[e.target.name] = e.target.value;
    state.product = product;
  },

  saveNewProducts: (state, product) => {

    if(state.products.length > 0){
      state.products.data.unshift(product);
    }
    // Add the new product to the beginning of the array
    state.createdData = product;
  },

  saveUpdatedProduct: (state, product) => {
   

    state.updatedData = product;
  },

  setDeleteProduct: () => {
   
  },
  setProductIsLoading(state, isLoading) {
    state.isLoading = isLoading;
  },

  setProductIsCreating(state, isCreating) {
    state.isCreating = isCreating;
  },

  setProductIsUpdating(state, isUpdating) {
    state.isUpdating = isUpdating;
  },

  setProductIsDeleting(state, isDeleting) {
    state.isDeleting = isDeleting;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

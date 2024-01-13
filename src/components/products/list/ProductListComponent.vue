<template>
  <div class="container">
    <div class="row justify-content-center mt-2 mb-2">
      <div class="col-8">
        <h4 class="text-left mb-2">
          All Products
        </h4>
      </div>
      <div class="col-4">
        <div class="input-group">
          <input
            v-model="query.search"
            type="search" 
            class="form-control rounded"
            placeholder="Search result by product name"
        
            aria-label="Search"
          
            aria-describedby="search-addon"
          >
        </div>
      </div>
    </div>
    <div>
      <div  v-if="!isLoading">
        <div class="row border-bottom border-top p-2 bg-light">
          <div class="col-1">Sl</div>
          <div class="col-3">Product Name</div>
          <div class="col-2">Product Price</div>
          <div class="col-3">Uploaded By</div>
          <div class="col-2">Actions</div>
        </div>

        <div v-for="(item, index) in productList.data" :key="item.id">
          <product-detail :index="index" :product="item" />
        </div>
      </div>

      <div v-if="isLoading" class="text-center mt-5 mb-5">
        Loading Products...
        <div class="spinner-grow" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>

    <!-- Insert Pagination Part -->
    <div
      v-if="productsPaginatedData !== null"
      class="vertical-center mt-2 mb-5"
    >
      <v-pagination
        v-model="query.page"
        :pages="productsPaginatedData.pagination?.total_pages"
        :range-size="2"
        active-color="#DCEDFF"
        @update:modelValue="getResults"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ProductDetail from "../list/ProductDetail";
import VPagination from "@hennge/vue3-pagination";

export default {
  data() {
    return {
      query: {
        page: 1,
        search: "",
      },
    };
  },
  components: {
    ProductDetail,
    VPagination,
  },
  computed: {
    ...mapGetters(["productList", "productsPaginatedData", "isLoading"]),
  },
  watch: {
    'query.search'() {
      // Trigger searchProducts when query.search changes
      this.searchProducts(this.query);
    },
  },
  created() {
    // Initial fetch on component creation
    this.fetchAllProducts(this.query);
  },

  methods: {
    ...mapActions(["fetchAllProducts","searchProducts"]),

    async getResults() {
      await this.fetchAllProducts(this.query);
    },

   

  },


};
</script>

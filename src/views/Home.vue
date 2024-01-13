<template>
  <div class="home">
    <div class="p-4">
      <div class="row ">
        <div class="col-md-2 m-1">
          <router-link to="/products" class="btn btn-primary  dashboard-widget">
            All Products
            <br>
            <span v-if="productsPaginatedData !== null" class="badge badge-info">
              {{ productsPaginatedData.pagination?.total }}
            </span>
          </router-link>
        </div>
        <div class="col-md-2 d-flex justify-content-end m-1">
          <router-link to="/products/create" class="btn btn-primary  dashboard-widget d-flex">
            <span class="d-inline-block text-truncate mr-2">Create New Product</span>
            <i class="fa fa-plus-circle d-inline-block m-1" />
          </router-link>
        </div>

      </div>
    </div>
    <div>
      <product-list-component />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ProductListComponent from "../components/products/list/ProductListComponent.vue";

export default {
  name: "Home",

  components: { ProductListComponent },

  computed: { ...mapGetters(["productsPaginatedData"]) },

  created() {
    this.fetchAllProducts(1);
  },

  methods: {
    ...mapActions(["fetchAllProducts"]),
  },
};
</script>

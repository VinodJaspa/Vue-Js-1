<template>
  <div class="row border-1 p-2">
    <div class="col-1 text-left">
      {{ index + 1 }}
    </div>
    <div class="col-3">
      {{ product.title }}
    </div>
    <div class="col-2">
      <strong class="text-danger">{{ product.price }} $</strong>
    </div>
    <div class="col-3">
      <span class="">{{ product.description }}</span>
    </div>
    <div class="col-2">
      <router-link
        :to="{ name: 'ProductEdit', params: { id: product.id } }"
        class="btn btn-primary mr-2"
        title="Edit Product"
      >
        <i class="fa fa-pencil" />
      </router-link>
      <button
        class="btn btn-danger mx-2"
        title="Delete Product"
        @click="deleteProductModal(product.id)"
      >
        <i class="fa fa-trash" />
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ProductDetail",
  props: {
    product: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
      default: 0,
    },
  },

  computed: { ...mapGetters(["isDeleting", "deletedData"]) },

  methods: {
    ...mapActions(["deleteProduct", "fetchAllProducts"]),
    deleteProductModal(id) {
      this.$swal
        .fire({
          text: "Are you sure to delete the product ?",
          icon: "error",
          cancelButtonText: "Cancel",
          confirmButtonText: "Yes, Confirm Delete",
          showCancelButton: true,
        })
        .then((result) => {
          if (result["isConfirmed"]) {
            // Put delete logic
            this.deleteProduct(id);
            this.fetchAllProducts({
              page: 1,
              search: ''
            });
            this.$swal.fire({
              text: "Success, Product has been deleted.",
              icon: "success",
              position: 'top-end',
              timer: 1000,
            });
          }
        });
    },
  },
};
</script>

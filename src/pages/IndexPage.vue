<template>
  <q-page class="q-pa-md">
    <q-item-label header>Preview</q-item-label>
    <div class="row q-gutter-y-md">
      <div class="col-xs-12 col-sm-12 col-md-12">
        <q-input filled outlined v-model="props.data" label="Nama Customer" class="full-width" :dense="dense" readonly />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12">
        <q-input filled outlined v-model="text" label="Alamat" class="full-width" :dense="dense" readonly />
      </div>
      <div class="col-xs-6 col-sm-6 col-md-4">
        <q-input filled outlined v-model="text" label="Invoice Number" class="full-width" :dense="dense" readonly />
      </div>
      <div class="col-xs-6 col-sm-6 col-md-4 q-ma-md">
        <q-input type="date" filled outlined v-model="text" label="Invoice Date" class="full-width" :dense="dense"
          readonly />
      </div>
      <div class="col-xs-6 col-sm-6 col-md-4">
        <q-input filled outlined v-model="text" label="Cost" class="full-width" :dense="dense" readonly />
      </div>
      <div class="col-xs-6 col-sm-6 col-md-4 q-ma-md">
        <q-input filled outlined v-model="text" label="Tax" class="full-width" :dense="dense" readonly />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12">
        <q-input filled outlined v-model="text" label="Terbilang" class="full-width" :dense="dense" readonly />
      </div>
      <div class="row justify-end">
      <q-btn
        type="submit"
        :loading="submitting"
        label="Generate Document"
        class="q-mt-md"
        color="teal"
      >
        <template v-slot:loading>
          <q-spinner-facebook />
        </template>
      </q-btn>
    </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  data: Object
})

let customer_name = ref(props.data.name);
</script>

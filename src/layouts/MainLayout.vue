<template>
  <q-layout view="hHh lpR fFf">

    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-bar>
        <q-icon name="laptop_chromebook" />
        <div>ASL Accounting</div>

        <q-space />

        <q-btn dense flat icon="close" @click="Logout()" />
      </q-bar>
      <div class="q-pa-sm q-pl-md row items-center">
        <div class="cursor-pointer non-selectable">
          File
          <q-menu>
            <q-list dense style="min-width: 100px">
              <q-item clickable v-close-popup>
                <q-item-section>Open...</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable @click="Logout()">
                <q-item-section>Quit</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>

        <div class="q-ml-md cursor-pointer non-selectable">
          Master Data
          <q-menu auto-close>
            <q-list dense style="min-width: 100px">
              <q-item @click="modal_customer = true, btn_customer = 'Tambah Customer'" clickable>
                <q-item-section>Customer</q-item-section>
              </q-item>
              <q-item @click="modal_user = true, btn_user = 'Tambah User'" clickable>
                <q-item-section>User</q-item-section>
              </q-item>
              <q-item @click="modal_keterangan = true" clickable>
                <q-item-section>Keterangan</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
          <q-toggle
            color="green"
            side="right"
            @click="SwitchMode()"
            dark
            :label="(dark_mode) ? 'Dark Mode Active' : 'Light Mode Active'"
            v-model="dark_mode"
          />
        </div>
      </div>
      <q-toolbar>
          <q-btn flat @click="leftDrawerOpen = !leftDrawerOpen" round dense icon="menu" />
          <q-toolbar-title>Sidebar</q-toolbar-title>
          <q-btn flat @click="rightDrawerOpen = !rightDrawerOpen" round dense icon="menu" />
        </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered
    :breakpoint="500"
    >

      <!-- drawer content -->
      <q-list bordered separator>
        <q-item header>
        <q-item-section>
          <q-item-label>Template</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-btn
            round
            size="sm"
            unelevated
            color="orange"
            icon="chevron_left"
            @click="leftDrawerOpen = false"/>
          </q-item-section>
      </q-item>
      <q-item v-for="template in data_template" @click="SelectDataTemplate(template)" clickable v-ripple>
        <q-item-section avatar top>
            <q-avatar icon="note" color="primary" text-color="white" />
          </q-item-section>
        <q-item-section>
          <q-item-label caption>Gunakan</q-item-label>
          <q-item-label>{{ template.document }}</q-item-label>
        </q-item-section>

        <q-item-section v-if="template.is_active == 1" side>
            <q-icon name="check_circle" color="green" />
            <q-tooltip>
              Active
            </q-tooltip>
          </q-item-section>
      </q-item>

    </q-list>

    </q-drawer>


    <q-page-container>
      <q-page class="q-pa-md">
        <q-item-label header>Buat Invoice</q-item-label>
        <div class="row q-gutter-y-md">
          <div class="col-xs-12 col-sm-12 col-md-12">
            <q-select filled v-model="customer_name" :options="data_customer" emit-value @update:model-value="ChangeCustomer()" label="Pilih Customer">
              <template v-slot:append>
                <q-btn round dense flat icon="add"
                  @click="modal_customer = true, customer_name = '', customer_address = ''" />
              </template>
            </q-select>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12">
            <q-input filled outlined v-model="customer_address" label="Alamat" class="full-width" />
          </div>
          <div class="col-xs-6 col-sm-6 col-md-6 q-mr-2">
            <q-input filled outlined v-model="invoice_number" label="No. Invoice" class="full-width" />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12">
            <q-input
            filled
            type="textarea"
            v-model="invoice_description"
            label="Pilih Keterangan">
            <template v-slot:append>
                <q-btn round dense flat icon="add" @click="modal_pilih_keterangan = true"/>
            </template>
            </q-input>
          </div>
          <div class="col-xs-6 col-sm-6 col-md-6">
            <q-input type="date" filled outlined v-model="invoice_date" label="Tgl. Invoice" class="full-width" />
          </div>
          <div class="col-xs-6 col-sm-6 col-md-9">
            <q-input filled outlined v-model.number="cost" v-bind="money" label="Biaya" class="full-width">
            <template v-slot:append>
              <q-badge outline color="primary" :label="formatted_cost" />
            </template>
            </q-input>
          </div>
          <div class="col-xs-6 col-sm-6 col-md-3">
            <q-input filled outlined type="number" v-model.number="percentage_ppn" label="Persentase Pajak" class="full-width" >
            <template v-slot:append>
              <q-icon name="percent" />
            </template>
            </q-input>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12">
            <q-input filled outlined v-model.number="tax" v-bind="money" label="Pajak dalam rupiah" class="full-width">
              <template v-slot:append>
                <q-badge outline color="primary" :label="formatted_tax" />
              </template>
            </q-input>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12">
            <q-input filled outlined v-model.number="total" v-bind="money" label="Total (Biaya + Pajak)" class="full-width">
              <template v-slot:append>
                <q-badge outline color="primary" :label="formatted_total" />
              </template>
            </q-input>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12">
            <q-input filled outlined v-model="terbilang" label="Terbilang" class="full-width" />
          </div>
          <div class="row justify-end">
            <q-btn @click="GenerateInvoice()" type="submit" :loading="submitting" :label="btn_generate"
              class="q-mt-md" color="teal">
              <template v-slot:loading>
                <q-spinner-facebook />
              </template>
            </q-btn>
          </div>
        </div>
      </q-page>
      <!-- <router-view :data="data_customer" /> -->
    </q-page-container>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <!-- drawer content -->
      <q-list bordered separator>
        <q-item header>
        <q-item-section side>
          <q-btn
            round
            size="sm"
            unelevated
            color="orange"
            icon="chevron_right"
            @click="rightDrawerOpen = false"/>
          </q-item-section>
        <q-item-section side class="text-right">
          <q-item-label>Riwayat Invoice</q-item-label>
        </q-item-section>

      </q-item>
        <q-item clickable v-ripple v-for="transaction in data_transaction"
          @click="GetDetailTransaction(transaction), modal_document != modal_document">
          <q-item-section avatar top>
            <q-avatar icon="description" color="primary" text-color="white" />
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">{{ transaction.invoice_number }}</q-item-label>
            <q-item-label caption lines="1">
              <span class="text-weight-bold">{{ transaction.customer_name }}</span>
            </q-item-label>
            <q-item-label caption lines="1">
              <span class="text-weight-100">{{ timeAgo(transaction.created_at) }}</span>
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon v-if="transaction.is_opened == 1" name="circle" color="green" />
            <q-icon v-else name="circle" color="gray" />
            <q-tooltip>
              {{ (transaction.is_opened == 1) ? 'Opened' : 'Not opened' }}
            </q-tooltip>
          </q-item-section>
        </q-item>

        <q-separator inset="item" />

      </q-list>


    </q-drawer>

  </q-layout>

  <q-dialog v-model="modal_document">
    <q-card style="width: 900px; max-width: 90vw;">
      <q-bar class="bg-primary text-white">
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>
      <div class="row">
        <div class="col-8">
          <q-card-section>
            <div class="text-h6">Invoice Detail</div>
            <div class="text-h7">{{ selected_transaction.customer_name }}</div>
          </q-card-section>
          <q-card-section>
            <div>
              <q-list bordered separator>
                <q-item clickable v-ripple>
                  <q-item-section>
                    <q-item-label caption>No. Invoice</q-item-label>
                    <q-item-label>{{ selected_transaction.invoice_number }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                  <q-item-section>
                    <q-item-label caption>Keterangan</q-item-label>
                    <q-item-label>{{ selected_transaction.description }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                  <q-item-section>
                    <q-item-label caption>Biaya</q-item-label>
                    <q-item-label>{{ FormatCurrency(selected_transaction.cost) }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                  <q-item-section>
                    <q-item-label caption>Pajak</q-item-label>
                    <q-item-label>{{ selected_transaction.percentage_ppn + '% ' + FormatCurrency(selected_transaction.tax) }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                  <q-item-section>
                    <q-item-label caption>Total</q-item-label>
                    <q-item-label>{{ FormatCurrency(selected_transaction.total) }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                  <q-item-section>
                    <q-item-label caption>Dibuat pada: </q-item-label>
                    <q-item-label>{{ format(selected_transaction.created_at, 'dddd, MMM yyyy') }} -- {{
                      timeAgo(selected_transaction.created_at) }}</q-item-label>
                  </q-item-section>
                </q-item>

              </q-list>
            </div>
          </q-card-section>

        </div>
        <div class="col">
          <q-card-section>
            <div class="text-h6">Riwayat Revisi</div>
            <div class="text-h7">{{ data_revision.length }}x revisi</div>
          </q-card-section>
          <q-card-section>
            <q-infinite-scroll :offset="250">
              <q-list bordered class="rounded-borders">
                <q-item clickable v-ripple>
                  <q-item-section avatar top>
                    <q-avatar icon="person" color="primary" text-color="white" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label lines="1">Dibuat oleh {{ invoice_dibuat_oleh }}</q-item-label>
                    <q-item-label caption lines="2">
                      {{ timeAgo(data_revision[data_revision.length - 1]) }}
                    </q-item-label>
                  </q-item-section>

                </q-item>
                <q-item clickable v-ripple v-for="revision in data_revision">
                  <q-item-section avatar top>
                    <q-avatar icon="person" color="green" text-color="white" />
                  </q-item-section>
                  <q-separator />
                  <q-item-section>
                    <q-item-label lines="1">{{ revision.employee_username }}</q-item-label>
                    <q-item-label caption lines="1">{{ revision.revision }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side top>
                    {{ timeAgo(revision.updated_at) }}
                  </q-item-section>
                </q-item>

                <q-separator inset="item" />

              </q-list>
              <template v-slot:loading>
                <div class="row justify-center q-my-md">
                  <q-spinner-dots color="primary" size="40px" />
                </div>
              </template>
            </q-infinite-scroll>
          </q-card-section>

        </div>
      </div>

      <div>
        <q-separator />
        <q-card-actions align="right">
          <q-btn color="blue-10" icon="folder_open"
            :label="selected_transaction.is_opened == 1 ? 'Re Download' : 'Download'" @click="OpenDocument()" />
          <q-btn color="orange-10" icon="edit" label="Edit" v-close-popup @click="SelectDataTransaction(), mode_buat = 'edit'" />
        </q-card-actions>
      </div>

    </q-card>

  </q-dialog>

  <q-dialog v-model="modal_user">
    <q-card style="width: 900px; max-width: 90vw;">
      <q-bar class="bg-primary text-white">
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>
      <div class="row">
        <div class="col-8">
          <q-card-section>
            <div class="text-h6">{{ data_employee.length }} Users</div>
            <div class="text-h7">Klik untuk merubah data</div>
          </q-card-section>
          <q-card-section>
            <q-list bordered>
              <q-item v-for="employee in data_employee" @click="SelectDataEmployee(employee)"  class="q-my-sm" clickable v-ripple>
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white">
                    {{ employee.fullname[0] }}
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ employee.fullname }}</q-item-label>
                  <q-item-label caption lines="1">{{ employee.username }}</q-item-label>
                </q-item-section>

                <q-item-section v-if="level_active_user == 'admin'" side @click="modal_confirm_delete_user = true">
                  <q-icon name="delete" color="red" />
                </q-item-section>
              </q-item>

            </q-list>
          </q-card-section>

        </div>
        <div class="col">
          <q-card-section>
            <div class="text-h6">Aksi</div>
            <div class="text-h7">Buat baru atau ubah</div>
          </q-card-section>
          <q-card-section>
            <div>
              <div class="q-gutter-y-md column">
                <q-input outlined square v-model="fullname" label="Fullname" class="q-mb-sm" />
              </div>
              <div class="q-gutter-y-md column">
                <q-input outlined square v-model="username" label="Username" class="q-mb-sm" />
              </div>
              <div class="q-gutter-y-md column">
                <q-input outlined square v-model="password" type="password" label="Password" class="q-mb-sm" />
              </div>
            </div>
          </q-card-section>

        </div>
      </div>

      <div>
        <q-separator />
        <q-card-actions align="right">
          <q-btn color="blue-10" icon="save" :label="btn_user" @click="HandleDataEmployee()" />
        </q-card-actions>
      </div>

    </q-card>

  </q-dialog>

  <q-dialog v-model="modal_customer">
    <q-card style="width: 900px; max-width: 90vw;">
      <q-bar class="bg-primary text-white">
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>
      <div class="row">
        <div class="col-8">
          <q-card-section>
            <div class="text-h6">{{ data_customer_original.length }} Customers</div>
            <div class="text-h7">Klik untuk mengubah</div>
          </q-card-section>
          <q-card-section>
            <q-list bordered>
              <q-item v-for="customer in data_customer_original" @click="SelectDataCustomer(customer)" class="q-my-sm" clickable v-ripple>
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white">
                    {{ customer.customer_name[0] }}
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ customer.customer_name }}</q-item-label>
                  <q-item-label caption lines="1">{{ customer.customer_address }}</q-item-label>
                </q-item-section>

                <q-item-section v-if="level_active_user == 'admin'" side @click="modal_confirm_delete_customer = true">
                  <q-icon name="delete" color="red" />
                </q-item-section>
              </q-item>

            </q-list>
          </q-card-section>

        </div>
        <div class="col">
          <q-card-section>
            <div class="text-h6">Aksi</div>
            <div class="text-h7">Buat baru atau ubah</div>
          </q-card-section>
          <q-card-section>
            <div>
              <div class="q-gutter-y-md column">
                <q-input outlined square v-model="customer_name" label="Nama Customer" class="q-mb-sm" />
              </div>
              <div class="q-gutter-y-md column">
                <q-input outlined square v-model="customer_address" label="Alamat Customer" class="q-mb-sm" />
              </div>
            </div>
          </q-card-section>

        </div>
      </div>

      <div>
        <q-separator />
        <q-card-actions align="right">
          <q-btn color="blue-10" icon="save" :label="btn_customer" @click="HandleDataCustomer()" />
        </q-card-actions>
      </div>

    </q-card>

  </q-dialog>

  <q-dialog v-model="modal_keterangan">
    <q-card style="width: 900px; max-width: 90vw;">
      <q-bar class="bg-primary text-white">
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>
      <div class="row">
        <div class="col-8">
          <q-card-section>
            <div class="text-h6">Kelola Keterangan</div>
            <div class="text-h7">Klik untuk mengubah</div>
          </q-card-section>
          <q-card-section>
            <q-list bordered>
              <q-item v-for="(desc, index) in data_customer_desc" @click="SelectDataKeterangan(desc)" class="q-my-sm" clickable v-ripple>
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white">
                    {{ index + 1 }}
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{desc }}</q-item-label>
                </q-item-section>

                <q-item-section v-if="level_active_user == 'admin'" side @click="modal_confirm_delete_keterangan = true">
                  <q-icon name="delete" color="red" />
                </q-item-section>
              </q-item>

            </q-list>
          </q-card-section>

        </div>
        <div class="col">
          <q-card-section>
            <div class="text-h6">Aksi</div>
            <div class="text-h7">Buat baru atau ubah</div>
          </q-card-section>
          <q-card-section>
            <div>
              <div class="q-gutter-y-md column">
                <q-input type="textarea" outlined square v-model="selected_keterangan" label="Keterangan Invoice" class="q-mb-sm" />
              </div>
            </div>
          </q-card-section>

        </div>
      </div>

      <div>
        <q-separator />
        <q-card-actions align="right">
          <q-btn color="blue-10" icon="save" label="Simpan" @click="InsertDataKeterangan()" />
        </q-card-actions>
      </div>

    </q-card>

  </q-dialog>

  <q-dialog v-model="modal_pilih_keterangan" persistent>
    <q-card>
      <q-bar class="bg-primary text-white">
      Pilih Keterangan
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section class="row items-center">
        <q-list bordered separator padding color="dark">
          <q-item v-for="(keterangan, index) in data_customer_desc" clickable v-ripple @click="SelectDataKeterangan(keterangan)">
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white">
                {{ index + 1 }}
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>
                {{ keterangan }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn flat label="Hapus" color="red" @click="DeleteDataKeterangan()" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="modal_confirm_delete_user" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="person" color="red" text-color="white" />
        <span class="q-ml-sm">Anda yakin ingin menghapus user {{ selected_employee.fullname }}?</span>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn flat label="Hapus" color="red" @click="DeleteDataEmployee()" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="modal_confirm_delete_customer" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="person" color="red" text-color="white" />
        <span class="q-ml-sm">Anda yakin ingin menghapus customer {{ selected_customer.customer_name }}?</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn flat label="Hapus" color="red" @click="DeleteDataCustomer()" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="modal_confirm_delete_keterangan" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="person" color="red" text-color="white" />
        <span class="q-ml-sm">Anda yakin ingin menghapus keterangan {{ invoice_description }}?</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn flat label="Hapus" color="red" @click="DeleteDataKeterangan()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useQuasar, Cookies } from 'quasar'
import { ref } from 'vue'
import axios from 'axios'
import moment from 'moment'
import toRupiah from '@develoka/angka-rupiah-js';
import { CUSTOMER, CUSTOMER_DESC, TEMPLATE, EMPLOYEE, TEMPLATE_ACTIVE, TRANSACTION, TRANSACTION_INVOICE, TRANSACTION_OPEN, REVISION, DOCUMENT } from '../constants/constant.global';
import { terbilang as FuncTerbilang } from '../utils/terbilang.util';
import { GetCookie, RemoveCookie } from '../utils/cookie.util';
import { DOCUMENT_ROOT } from '../constants/constant.global';
import money from 'v-money';

export default {
  data() {
    return {
      data_revision: [],
      data_transaction: [],
      data_customer_desc: [],
      data_active_user: [],
      level_active_user: '',
      data_employee: [],
      data_template: [],
      data_customer: [],
      data_customer_original: [],
      selected_transaction: [],
      selected_employee: [],
      selected_customer: [],
      selected_template: [],
      selected_keterangan: '',
      new_data_revision: [],
      filter_nama_usaha: [],
      latest_invoice: '',
      customer: ref(''),
      invoice_dibuat_oleh: ref(''),
      invoice_description: ref(''),
      invoice_number: ref(''),
      invoice_date: new Date().toISOString().substr(0, 10),
      preview_document: ref(''),
      doc_type: 'office',
      cost: ref(0),
      formatted_cost: ref(0),
      tax: ref(0),
      formatted_tax: ref(0),
      total: ref(0),
      formatted_total: ref(0),
      percentage_ppn: ref(1),
      terbilang: ref(FuncTerbilang(1000)),
      modal_customer: ref(false),
      modal_document: ref(false),
      modal_user: ref(false),
      modal_customer: ref(false),
      modal_keterangan: ref(false),
      modal_pilih_keterangan: ref(false),
      modal_confirm_delete_user: ref(false),
      modal_confirm_delete_customer: ref(false),
      modal_confirm_delete_keterangan: ref(false),
      maximizedToggle: ref(false),
      id_usaha: '',
      customer_name: '',
      customer_address: '',
      customer_phone: '',
      customer_email: '',
      fullname: ref(''),
      username: ref(''),
      password: ref(''),
      message_box: ref(false),
      msg_title: '',
      msg_info: '',
      msg_class: 'row items-center no-wrap bg-red',
      kelas: '',
      level: '',
      editor: (GetCookie('user')) ? GetCookie('user') : 'admin',
      btn_simpan: 'Simpan',
      btn_generate: 'Buat Invoice',
      btn_user: 'Tambah User',
      btn_customer: 'Tambah Customer',
      mode_buat: 'add',
      user_active: '',
      submitting: false,
      dark_mode: ref(false),
      money: {
        decimal: ',',
        thousands: '.',
        prefix: 'Rp. ',
        suffix: '',
        precision: 2,
        masked: true
      }
    }
  },
  setup() {
    const $q = useQuasar();
    const leftDrawerOpen = ref(false);
    const rightDrawerOpen = ref(false);


    return {
      FuncTerbilang,
      leftDrawerOpen,
      rightDrawerOpen,

      timeAgo(datetime) {
        return moment(datetime).fromNow()
      },
      SwitchMode() {
        this.dark_mode = !this.dark_mode;
        $q.dark.set(this.dark_mode);
      },

      format(datetime, format) {
        return moment(datetime).format(format)
      },

      async GetDataEmployee() {
        this.data_employee = [];
        await axios.get(EMPLOYEE)
          .then(response => {
            if (response.status == 200) {
              if (this.level_active_user == 'user') {
                this.data_employee = response.data.data.filter((user) => {
                  return user.level == 'user';
                })
              }
              else this.data_employee = response.data.data;
            }
          }).catch(err => {
            this.showNotif('negative', 'Terjadi kesalahan. Error: ' + err)
          })
      },
      async GetDataCustomer() {
        this.data_customer = [];
        await axios.get(CUSTOMER)
          .then(response => {
            this.data_customer_original = response.data.data;
            response.data.data.forEach(customer => {
              let cust = {
                label: customer.customer_name,
                value: customer.customer_name,
                address: customer.customer_address,
                phone: customer.customer_phone,
                email: customer.customer_email
              }
              this.data_customer.push(cust);

            })
          }).catch(err => {
            this.showNotif('negative', 'Terjadi kesalahan. Error: ' + err)
          })
      },
      async GetDataCustomerDescription() {
        this.data_customer_desc = [];
        await axios.get(CUSTOMER_DESC)
          .then(response => {
            if (response.status == 200) {
              response.data.data.forEach(row => {
                this.data_customer_desc.push(row.customer_desc);
              })
            }
          }).catch(err => {
            this.showNotif('negative', 'Terjadi kesalahan. Error: ' + err)
          })
      },
      async GetDataTemplate() {
        this.data_template = [];
        await axios.get(TEMPLATE)
          .then(response => {
            if (response.status == 200) {
              this.data_template = response.data.data;
              this.data_template.forEach(template => {
                if (template.is_active == 1) this.selected_template = template;
              })
            }
          }).catch(err => {
            this.showNotif('negative', 'Terjadi kesalahan. Error: ' + err)
          })
      },
      async GetDataRevision(id) {
        await axios.get(REVISION + '?id=' + id)
          .then(response => {
            let len = response.data.data.length - 1;
            this.data_revision = response.data.data
            if (len >= 0) this.invoice_dibuat_oleh = this.data_revision[len].employee_username;
            else this.invoice_dibuat_oleh = this.selected_transaction.employee_username;
          }).catch(err => {
            this.showNotif('negative', 'Terjadi kesalahan. Error: ' + err)
          })
      },
      async GetDataTransaction() {
        await axios.get(TRANSACTION)
          .then(response => {
            this.data_transaction = response.data.data
          }).catch(err => {
            this.showNotif('negative', 'Terjadi kesalahan. Error: ' + err)
          })
      },
      async GetLatestInvoiceTransaction() {
        await axios.get(TRANSACTION_INVOICE)
          .then(response => {
            this.latest_invoice = response.data.data;
            this.invoice_number = this.latest_invoice;
          }).catch(err => {
            this.showNotif('negative', 'Terjadi kesalahan. Error: ' + err)
          })
      },
      SetCustomer(val) {
        invoice_description.value = val;

      },

      showNotif(type, message) {
        const position = 'top-right';

        $q.notify({
          type: type,
          message: message,
          position,
        })
      }
    }
  },
  methods: {
    HasLogin() {
      this.user_active = GetCookie('user');

      if (this.user_active == null) {
        this.$router.push('/login');
        this.showNotif('negative', 'Anda harus login dulu.')
        return false;
      }
      return true;
    },
    async OpenDocument() {
      this.UpdateOpenedDataDocument(this.selected_transaction.id);
      let path = DOCUMENT_ROOT + this.selected_transaction.document;;
      window.open(path)
    },
    async SelectDataCustomer(customer) {
      this.selected_customer = customer;
      this.customer_name = customer.customer_name;
      this.customer_address = customer.customer_address;
      this.btn_customer = 'Edit Customer'
    },
    async SelectDataKeterangan(keterangan) {
      this.selected_keterangan = keterangan;
      this.invoice_description = keterangan;
      this.modal_pilih_keterangan = false;
    },
    async HandleDataCustomer() {
      if (this.btn_customer == 'Edit Customer') this.UpdateDataCustomer();
      else {
        this.InsertDataCustomer();
      }
    },
    async InsertDataKeterangan() {
      try {
        if (!this.HasLogin()) return;
        if (this.selected_keterangan == '') this.showNotif('warning', 'Keterangan Invoice Tidak Boleh Kosong')
        else {
          const payload = {
            customer_description: this.selected_keterangan,
          }
          await axios.post(CUSTOMER_DESC, payload, {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              }
            }).then(response => {
              if (response.status == 200) {
                this.selected_keterangan = '';
                this.GetDataCustomerDescription();
                this.showNotif('positive', 'Data keterangan berhasil disimpan.');
              }
            }).catch(error => {
              this.showNotif('negative', 'Data keterangan gagal disimpan. Pesan: ' + error.response.data.message)
          })
        }
      }
      catch (err) {
        this.showNotif('negative', 'Data customer gagal disimpan. Error: ' + err)
      }
    },
    async InsertDataCustomer() {
      try {
        if (!this.HasLogin()) return;
        if (this.customer_name == '') this.showNotif('warning', 'Nama Customer Tidak Boleh Kosong')
        else if (this.customer_address == '') this.showNotif('warning', 'Alamat Customer Tidak Boleh Kosong')
        else {
          const payload = {
            customer_name: this.customer_name,
            customer_address: this.customer_address,
            customer_phone: this.customer_phone,
            customer_email: this.customer_email
          }
          if (this.btn_simpan == 'Simpan') {
            await axios.post(CUSTOMER, payload, {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              }
            }).then(response => {
              if (response.status == 200) {
                this.GetDataCustomer();
                this.showNotif('positive', 'Data customer berhasil disimpan.');
              }
            }).catch(error => {
              this.showNotif('negative', 'Data customer gagal disimpan. Pesan: ' + error.response.data.message)
            })
          }
          else {
            this.new_data_revision = payload;
            this.showNotif('positive', 'Data customer berhasil disimpan.')
          }
        }
      }
      catch (err) {
        this.showNotif('negative', 'Data customer gagal disimpan. Error: ' + err)
      }
    },
    async UpdateDataCustomer() {
      try {
        if (!this.HasLogin()) return;
        if (this.customer_name == '') this.showNotif('warning', 'Nama Customer Tidak Boleh Kosong')
        else if (this.customer_address == '') this.showNotif('warning', 'Alamat Customer Tidak Boleh Kosong')
        else {
          const payload = {
            id: this.selected_customer.id,
            customer_name: this.customer_name,
            customer_address: this.customer_address,
            customer_phone: this.customer_phone,
            customer_email: this.customer_email
          }
          if (this.btn_simpan == 'Simpan') {
            await axios.put(CUSTOMER, payload, {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              }
            }).then(response => {
              if (response.status == 200) {
                this.GetDataCustomer();
                this.showNotif('positive', 'Data customer berhasil disimpan.');
              }
            }).catch(error => {
              this.showNotif('negative', 'Data customer gagal disimpan. Pesan: ' + error.response.data.message)
            })
          }
          else {
            this.new_data_revision = payload;
            this.showNotif('positive', 'Data customer berhasil disimpan.')
          }
        }
      }
      catch (err) {
        this.showNotif('negative', 'Data customer gagal disimpan. Error: ' + err)
      }
    },
    async DeleteDataCustomer() {
      try {
        if (!this.HasLogin()) return;
        if (this.selected_customer.id == '') this.showNotif('warning', 'Pilih customer yang mau dihapus')
        else {
          const payload = {
            id: this.selected_customer.id,
          }
          await axios.delete(CUSTOMER + '?id=' + this.selected_customer.id, {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              }
            }).then(response => {
              if (response.status == 200) {
                this.GetDataCustomer();
                this.showNotif('positive', 'Data user berhasil disimpan.');
                this.modal_confirm_delete_customer = false;
              }
            }).catch(error => {
              this.showNotif('negative', 'Data user gagal disimpan. Pesan: ' + error.response.data.message)
            })
        }
      }
      catch (err) {
        this.showNotif('negative', 'Data customer gagal disimpan. Error: ' + err)
      }
    },
    async DeleteDataKeterangan() {
      try {
        if (!this.HasLogin()) return;
        if (this.selected_keterangan == '') this.showNotif('warning', 'Pilih keterangan yang mau dihapus')
        else {
          await axios.delete(CUSTOMER_DESC + '?ket=' + this.selected_keterangan, {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              }
            }).then(response => {
              if (response.status == 200) {
                this.GetDataCustomerDescription();
                this.showNotif('positive', 'Data keterangan berhasil disimpan.');
                this.modal_confirm_delete_keterangan = false;
              }
            }).catch(error => {
              this.showNotif('negative', 'Data keterangan gagal disimpan. Pesan: ' + error.response.data.message)
            })
        }
      }
      catch (err) {
        this.showNotif('negative', 'Data keterangan gagal disimpan. Error: ' + err)
      }
    },
    async HandleDataEmployee() {
      if (this.btn_user == 'Edit User') this.UpdateDataEmployee();
      else {
        this.InsertDataEmployee();
      }
    },
    async InsertDataEmployee() {
      try {
        if (!this.HasLogin()) return;
        if (this.fullname == '') this.showNotif('warning', 'Nama User Tidak Boleh Kosong')
        else if (this.username == '') this.showNotif('warning', 'Username Tidak Boleh Kosong')
        else if (this.password == '') this.showNotif('warning', 'Password Tidak Boleh Kosong')
        else {
          const payload = {
            fullname: this.fullname,
            username: this.username,
            password: this.password
          }
          if (this.btn_simpan == 'Simpan') {
            await axios.post(EMPLOYEE, payload, {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              }
            }).then(response => {
              if (response.status == 200) {
                this.GetDataEmployee();
                this.showNotif('positive', 'Data user berhasil disimpan.');
                // this.modal_customer = false;
              }
            }).catch(error => {
              this.showNotif('negative', 'Data user gagal disimpan. Pesan: ' + error.response.data.message)
            })
          }
          else {
            this.new_data_revision = payload;
            this.showNotif('positive', 'Data customer berhasil disimpan.')
          }
        }
      }
      catch (err) {
        this.showNotif('negative', 'Data customer gagal disimpan. Error: ' + err)
      }
    },
    async UpdateDataEmployee() {
      try {
        if (!this.HasLogin()) return;
        if (this.fullname == '') this.showNotif('warning', 'Nama User Tidak Boleh Kosong')
        else if (this.username == '') this.showNotif('warning', 'Username Tidak Boleh Kosong')
        else if (this.password == '') this.showNotif('warning', 'Password Tidak Boleh Kosong')
        else {
          const payload = {
            id: this.selected_employee.id,
            fullname: this.fullname,
            username: this.username,
            password: this.password
          }
          if (this.btn_simpan == 'Simpan') {
            await axios.put(EMPLOYEE, payload, {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              }
            }).then(response => {
              if (response.status == 200) {
                this.GetDataEmployee();
                this.showNotif('positive', 'Data user berhasil disimpan.');
                this.modal_customer = false;
              }
            }).catch(error => {
              this.showNotif('negative', 'Data user gagal disimpan. Pesan: ' + error.response.data.message)
            })
          }
          else {
            this.new_data_revision = payload;
            this.showNotif('positive', 'Data customer berhasil disimpan.')
          }
        }
      }
      catch (err) {
        this.showNotif('negative', 'Data customer gagal disimpan. Error: ' + err)
      }
    },
    async DeleteDataEmployee() {
      try {
        if (!this.HasLogin()) return;
        if (this.selected_employee.id == '') this.showNotif('warning', 'Pilih user yang mau dihapus')
        else {
          await axios.delete(EMPLOYEE + '?id=' + this.selected_employee.id, {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              }
            }).then(response => {
              if (response.status == 200) {
                this.GetDataEmployee();
                this.showNotif('positive', 'Data user berhasil disimpan.');
                this.modal_confirm_delete_user = false;
              }
            }).catch(error => {
              this.showNotif('negative', 'Data user gagal disimpan. Pesan: ' + error.response.data.message)
            })
        }
      }
      catch (err) {
        this.showNotif('negative', 'Data customer gagal disimpan. Error: ' + err)
      }
    },
    async GenerateInvoice() {
      if (this.mode_buat == 'add') this.InsertDataInvoice();
      else {
        this.InsertDataInvoice();
        this.InsertDataRevision();
      }
    },
    async InsertDataInvoice() {
      if (!this.HasLogin()) return;
      if (this.customer_name == '') this.showNotif('warning', 'Nama Customer Tidak Boleh Kosong')
      else if (this.customer_address == '') this.showNotif('warning', 'Alamat Customer Tidak Boleh Kosong')
      else if (this.invoice_description == '') this.showNotif('warning', 'Keterangan Invoice Tidak Boleh Kosong')
      else if (this.invoice_number == '') this.showNotif('warning', 'No. Invoice Tidak Boleh Kosong')
      else if (this.invoice_date == '') this.showNotif('warning', 'Tgl. Invoice Tidak Boleh Kosong')
      else if (this.cost == '') this.showNotif('warning', 'Biaya Tidak Boleh Kosong')
      else if (this.tax == '') this.showNotif('warning', 'Tax Tidak Boleh Kosong')
      else if (this.total == '') this.showNotif('warning', 'Total Tidak Boleh Kosong')
      else if (this.selected_template.document == '') this.showNotif('warning', 'Dokumen Tidak Boleh Kosong')
      else {
        let payload = {
        customer_name: this.customer_name,
        customer_address: this.customer_address,
        invoice_description: this.invoice_description,
        invoice_number: this.invoice_number,
        invoice_date: this.invoice_date,
        cost: this.cost,
        tax: this.tax,
        percentage_ppn: this.percentage_ppn,
        total: this.total,
        terbilang: this.terbilang,
        editor: this.user_active,
        template: this.selected_template.document
      }
      await axios.post(DOCUMENT, payload, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      }).then(response => {
        this.showNotif('positive', 'Invoice berhasil dibuat.');
        this.GetDataTransaction();
        this.mode_buat = 'add';
      }).catch(error => {
        this.showNotif('negative', 'Invoice gagal dibuat. Error: ' + error)
      })
    }
    },
    async InsertDataRevision() {
      if (!this.HasLogin()) return;
      if (this.selected_transaction.id == '') this.showNotif('warning', 'Pilih invoice yang mau direvisi')
      else {
        let payload = {
        transaction_id: this.selected_transaction.id,
        revision_date: moment().format('yyyy-MM-DD'),
        document: this.selected_transaction.document,
        editor: this.user_active,
      }
      await axios.post(REVISION, payload, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      }).then(response => {
        this.showNotif('positive', 'Invoice berhasil dibuat.');
        this.GetDataTransaction();
        this.mode_buat = 'add';
      }).catch(error => {
        this.showNotif('negative', 'Invoice gagal dibuat. Error: ' + error)
      })
    }
    },
    async UpdateOpenedDataDocument() {
      let payload = {
        id: this.selected_transaction.id,
        is_opened: 1
      }
      await axios.put(TRANSACTION_OPEN, payload, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      }).then(response => {
        this.showNotif('positive', 'File downloaded.');
        this.GetDataTransaction();
      }).catch(error => {
        this.showNotif('negative', 'Data customer gagal disimpan. Error: ' + error)
      })
    },
    async SetActiveTemplate() {
      let payload = {
        id: this.selected_template.id,
        is_active: 1
      }
      await axios.put(TEMPLATE_ACTIVE, payload, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      }).then(response => {
        this.GetDataTemplate();
      }).catch(error => {
        this.showNotif('negative', 'Gagal. Error: ' + error)
      })
    },
    async SelectDataTransaction() {
      if (!this.HasLogin()) return;
      this.customer_name = this.selected_transaction.customer_name;
      this.customer_address = this.selected_transaction.customer_address;
      this.invoice_description = this.selected_transaction.description;
      this.invoice_date = moment(this.selected_transaction.invoice_date).format('yyyy-MM-DD');
      this.invoice_number = this.selected_transaction.invoice_number;
      this.cost = parseInt(this.selected_transaction.cost);
      this.tax = this.selected_transaction.tax;
      this.percentage_ppn = this.selected_transaction.percentage_ppn;
      this.total = this.selected_transaction.total;
      this.GetLatestInvoiceTransaction();
    },
    async SelectDataTemplate(template) {
      if (!this.HasLogin()) return;
      this.selected_template = template;
      this.SetActiveTemplate();
    },
    async SelectDataEmployee(employee) {
      this.selected_employee = employee;
      this.fullname = employee.fullname;
      this.username = employee.username;
      this.password = employee.password;
      this.btn_user = 'Edit User'
    },
    async GetDetailTransaction(transaction) {
      if (!this.HasLogin()) return;
      this.selected_transaction = transaction;
      this.modal_document = true;
      this.preview_document = transaction.document;
      this.GetDataRevision(transaction.id);

    },
    ChangeCustomer() {
      this.data_customer.forEach(customer => {
        if (customer.value == this.customer_name) this.customer_address = customer.address;
      })
    },
    Logout() {
      RemoveCookie("user");
      RemoveCookie("level");
      this.$router.push('/login');
    },
    FormatCurrency(val) {
      return toRupiah(val, { dot: ',', floatingPoint: 0 });
    }
  },
  computed: {
    CalculateCost() {
      this.formatted_cost = cost;
    },
  },
  watch: {
    cost() {
      this.formatted_cost = toRupiah(this.cost, { dot: ',', floatingPoint: 0 });
      this.tax = Math.round(this.cost * this.percentage_ppn / 100);
      this.formatted_tax = toRupiah(this.tax, { dot: ',', floatingPoint: 0 });
      this.total = parseInt(this.cost) + parseInt(this.tax);
      this.formatted_total = toRupiah(this.total, { dot: ',', floatingPoint: 0 });
      this.terbilang = FuncTerbilang(this.total) + ' Rupiah';
    },
    customer_name() {

    },
    percentage_ppn() {
      this.tax = Math.round(this.cost * this.percentage_ppn / 100);
      this.formatted_tax = toRupiah(this.tax, { dot: ',', floatingPoint: 0 });
      this.total = parseInt(this.cost) + parseInt(this.tax);
      this.formatted_total = toRupiah(this.total, { dot: ',', floatingPoint: 0 });
      this.terbilang = FuncTerbilang(this.total) + ' Rupiah';
    },
  },

  mounted() {
    this.GetDataCustomer()
    this.GetDataTemplate()
    this.GetDataEmployee()
    this.GetDataTransaction()
    this.GetLatestInvoiceTransaction()
    this.HasLogin();
    this.level_active_user = atob(GetCookie('level'));
    this.GetDataCustomerDescription();
  }
}
</script>

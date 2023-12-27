<template>
  <q-layout style="background-color: black;" view="hHh lpR fFf" class="flex items-center justify-center">
    <div class="q-pa-md row items-center q-gutter-md">
      <q-card class="my-card" flat bordered  style="width: 500px;">
        <q-img src="/src/assets/banner.jpg">
          <div class="absolute-bottom text-body1 text-center">
          PT. ADJIE SARANA LOGISTIK
        </div>
        </q-img>

        <q-card-section class="q-pa-md items-center justify-center">
          <div class="q-mt-md">
            <div class="q-gutter-y-md column">
              <q-input outlined square v-model="username" label="Username" class="q-mb-sm" />
            </div>
            <div class="q-gutter-y-md column">
              <q-input outlined square v-model="password" label="Password" class="q-mb-sm" />
            </div>
          </div>
        </q-card-section>

        <q-card-actions>
          <q-btn color="primary" icon="person" @click="LoginCustomer()" label="Login" />

          <q-space />
        </q-card-actions>
      </q-card>
    </div>
  </q-layout>
</template>

<script>
import { useQuasar, Cookies } from 'quasar'
import { ref } from 'vue'
import axios from 'axios'
import moment from 'moment'
import { EMPLOYEE_LOGIN } from '../constants/constant.global';
import { SetCookie } from '../utils/cookie.util';
import { DOCUMENT_ROOT } from '../constants/constant.global';

export default {
  data() {
    return {
      customer_email: '',
      fullname: ref(''),
      username: ref(''),
      password: ref(''),
      message_box: ref(false),
      msg_title: '',
      msg_info: '',
      msg_class: 'row items-center no-wrap bg-red',
    };
  },
  setup() {
    const $q = useQuasar();
    const leftDrawerOpen = ref(false);
    const rightDrawerOpen = ref(false);
    $q.dark.set(false);

    return {

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
    async LoginCustomer() {
      try {
        if (this.username == '') this.showNotif('warning', 'Username Tidak Boleh Kosong')
        else if (this.password == '') this.showNotif('warning', 'Password Tidak Boleh Kosong')
        else {
          const payload = {
            username: this.username,
            password: this.password,
          }
          await axios.post(EMPLOYEE_LOGIN, payload, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            }
          }).then(response => {
            if (response.data.data.length > 0) {
              let username = response.data.data[0].username;
              let level = response.data.data[0].level;
              SetCookie("user", username);
              SetCookie("level", btoa(level));
              this.$router.push('/');
              this.showNotif('positive', 'Login berhasil.');
            }
            else this.showNotif('negative', 'Username & password salah.');
          }).catch(error => {
            this.showNotif('negative', 'Data customer gagal disimpan. Pesan: ' + error.response.data.message)
          })
        }
      }
      catch (err) {
        this.showNotif('negative', 'Data customer gagal disimpan. Error: ' + err)
      }
    }

  }

}
</script>

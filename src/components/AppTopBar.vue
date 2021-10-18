<template>
  <div class="layout-topbar">
    <router-link to="/" class="layout-topbar-logo">
      <!-- <img alt="Logo" src="images/logo-dark.svg" /> -->
      <span>LucyApp Admin</span>

      <Dialog
        v-model:visible="showLoginModal"
      >
        <template #header>
          <h3>Login</h3>
        </template>

        <div class="p-inputgroup login-input">
            <span class="p-float-label">
              <InputText v-model="user.email" />
              <label for="email">Email</label>
            </span>
            
        </div>
        <div class="p-inputgroup login-input">
          <span class="p-float-label">
            <Password v-model="user.password" :feedback="false" toggleMask="true" />
            <label for="password">Senha</label>
          </span>
        </div>


        <template #footer>
          <Button label="Cancelar" icon="pi pi-times" class="p-button-text"/>
          <Button @click="login" label="Entrar" icon="pi pi-check" autofocus />
        </template>
      </Dialog>
    </router-link>

    <button
      class="p-link layout-topbar-menu-button layout-topbar-button"
      v-styleclass="{
        selector: '@next',
        enterClass: 'hidden',
        enterActiveClass: 'scalein',
        leaveToClass: 'hidden',
        leaveActiveClass: 'fadeout',
        hideOnOutsideClick: true
      }"
    >
      <i class="pi pi-ellipsis-v"></i>
    </button>
    <ul class="layout-topbar-menu hidden lg:flex origin-top">
      <li>
        <button v-if="!isAuthenticated" @click="openLoginModal" class="p-link layout-topbar-button">
          <!-- <i class="pi pi-sign-in"></i> -->
          <p>Login</p>
        </button>
      </li>
      <li>
        <button v-if="isAuthenticated" @click="logout" class="p-link layout-topbar-button">
          <i class="pi pi-sign-out"></i>
          <span>Logout</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import http from '@/utils/http-common';

// TODO: move to env
// const USER_KEY = 'authenticated_user'

export default {
  name: "AppTopBar",
  setup() {
    const store = useStore();
    const stateUser = computed(() => store.state.user);
    const isAuthenticated = computed(() => store.state.isAuthenticated)
    const dispatchLogin = (user) => store.dispatch('login', user)
    const dispatchLogoff = () => store.dispatch('logoff')

    return {
      store,
      stateUser,
      dispatchLogin,
      dispatchLogoff,
      isAuthenticated
    }
  },
  data() {
    return {
      showLoginModal: false,
      user: {
        email: '',
        password: '',
      },
    }
  },
  methods: {
    onMenuToggle(event) {
      this.$emit("menu-toggle", event);
    },
    onTopbarMenuToggle(event) {
      this.$emit("topbar-menu-toggle", event);
    },
    openLoginModal() {
      this.showLoginModal = true;
    },
    async login() {
      const { email, password } = this.user;

      const result = await http.post('/users/login', {
        email,
        password
      })

      this.dispatchLogin(result.data)
      this.showLoginModal = false;
    },
    logout() {
      this.dispatchLogoff()
    }
  }
};
</script>

<style type="text/css">
  .login-input {
    margin-top: 25px;
    margin-bottom: 20px;
  }
</style>
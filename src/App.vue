<template>
  <div>Must login</div>
  <div
    :class="containerClass"
    @click="onWrapperClick"
  >
    <AppTopBar @menu-toggle="onMenuToggle" />

    <div
      class="layout-sidebar"
      @click="onSidebarClick"
    >
      <AppMenu
        :model="menu"
        @menuitem-click="onMenuItemClick"
      />
    </div>

		<AppConfig v-show="false" :layoutMode="layoutMode" :layoutColorMode="layoutColorMode" @layout-change="onLayoutChange" @layout-color-change="onLayoutColorChange" />
    <div class="layout-main-container">
        <div class="layout-main">
            <router-view />
        </div>
    </div>
  </div>
</template>

<script>
import AppTopBar from "./components/AppTopBar.vue";
import AppConfig from "./components/AppConfig.vue"
import AppMenu from "./components/AppMenu.vue";

export default {
  data() {
    return {
      layoutMode: "static",
      layoutColorMode: "light",
      staticMenuInactive: false,
      overlayMenuActive: false,
      mobileMenuActive: false,
      menu: [
        {
          label: "Home",
          items: [{ label: "Dashboard", icon: "pi pi-fw pi-home", to: "/" }]
        },
        {
          label: "Conteúdo",
          items: [
            { label: "Fases", to: "/levels" },
            { label: "Etapas", to: "/stages" },
            { label: "Aulas", to: "/lectures" },
            { label: "Exercícios", to: "/exercises" }
          ]
        }
      ]
    };
  },
  components: { 'AppTopBar': AppTopBar, 'AppMenu': AppMenu, 'AppConfig': AppConfig },
  methods: {
    onWrapperClick() {
      if (!this.menuClick) {
        this.overlayMenuActive = false;
        this.mobileMenuActive = false;
      }
      this.menuClick = false;
    },
    onMenuToggle() {
      this.menuClick = true;
      if (this.isDesktop()) {
        if (this.layoutMode === "overlay") {
          if (this.mobileMenuActive === true) {
            this.overlayMenuActive = true;
          }
          this.overlayMenuActive = !this.overlayMenuActive;
          this.mobileMenuActive = false;
        } else if (this.layoutMode === "static") {
          this.staticMenuInactive = !this.staticMenuInactive;
        }
      } else {
        this.mobileMenuActive = !this.mobileMenuActive;
      }
      event.preventDefault();
    },
    onSidebarClick() {
      this.menuClick = true;
    },
    onMenuItemClick(event) {
      if (event.item && !event.item.items) {
        this.overlayMenuActive = false;
        this.mobileMenuActive = false;
      }
    },
		onLayoutChange(layoutMode) {
			this.layoutMode = layoutMode;
		},
		onLayoutColorChange(layoutColorMode) {
			this.layoutColorMode = layoutColorMode;
		},
  },
  computed: {
    containerClass() {
      return [
        "layout-wrapper",
        {
          "layout-static": true,
          "layout-static-sidebar-inactive": false,
          "layout-overlay-sidebar-active": true,
          "layout-mobile-sidebar-active": true,
          "p-input-filled": false,
          "p-ripple-disabled": false,
          "layout-theme-light": false
        }
      ];
    }
  }
};
</script>

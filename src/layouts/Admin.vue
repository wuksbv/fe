<template>
<div>
  <v-app-bar app light>
  <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
  <v-avatar :tile="true">
    <img :src="require('@/assets/logo.png')" alt="logo">
  </v-avatar>
  <v-toolbar-title>Header text</v-toolbar-title>
</v-app-bar>

  <va-layout>
    

    <va-app-bar
      slot="app-bar"
      :header-menu="headerMenu"
      :profile-menu="profileMenu"
      dense
      dark
      @toggle="
        $vuetify.breakpoint.lgAndUp ? (mini = !mini) : (drawer = !drawer)
      "
      style="background-color: #193D53 !important"
    ></va-app-bar>
    <va-sidebar
      slot="sidebar"
      :menu="sidebarMenu"
      v-model="drawer"
      :mini-variant="mini"
      color="#193D53"
    ></va-sidebar>
    <!--<va-breadcrumbs slot="header" style="background-color: #3588C1 !important;"></va-breadcrumbs>-->
    <va-aside slot="aside"></va-aside>
    <va-footer slot="footer" :menu="footerMenu" style="background-color: #3588C1 !important; color: #fff !important">
      &copy; 2021,
      <v-icon size="18"> mdi-xml </v-icon>
      with
      <v-icon size="18" style="color: red"> mdi-heart </v-icon>
      by
      <a href="#">WUKS</a> the Perfect Match.
    </va-footer>
  </va-layout>
  </div>
</template>

<script>
import nav from "../_nav";

export default {
  name: "App",
  data() {
    return {
      drawer: null,
      mini: false,
      headerMenu: [
        {
          link: "/",
          text: this.$t("menu.dashboard"),
        },
      ],
      footerMenu: [
        {
          href: "#",
          text: "About Us",
        },
        {
          href: "#",
          text: "Blog",
        },
        {
          href: "#",
          text: "License",
        },
      ],
      profileMenu: [],
      sidebarMenu: nav(this.$i18n, this.$admin),
    };
  },
};
</script>
<style scoped>

.v-list-item--link::before, .v-breadcrumbs{
  color: #fff !important;
}
</style>
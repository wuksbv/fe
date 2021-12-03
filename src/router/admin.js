import Vue from "vue";
import AdminLayout from "@/layouts/Admin";
import Dashboard from "@/views/Dashboard";
import Calendar from "@/views/Calendar";
import Calendar2 from "@/views/Calendar2";
import Notes from "@/views/Notes";
import Error from "@/views/Error";
import i18n from "@/i18n";

/**
 * Error component
 */
Vue.component("Error", Error);



export default {
  path: "",
  component: AdminLayout,
  meta: {
    title: i18n.t("routes.home"),
  },
  children: [
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
      meta: {
        title: i18n.t("routes.dashboard"),
      },
    },
    {
      path: "/calendar",
      name: "calendar",
      component: Calendar,
      meta: {
        title: i18n.t("routes.calendar"),
      },
    },
    {
      path: "/calendar2",
      name: "calendar2",
      component: Calendar2,
      meta: {
        title: i18n.t("routes.calendar"),
      },
    },
    {
      path: "/notes",
      name: "notes",
      component: Notes,
      meta: {
        title: i18n.t("routes.notes"),
      },
    },
    {
      path: "*",
      component: Error,
      meta: {
        title: i18n.t("routes.not_found"),
      },
    },
  ],
};

/* eslint-disable no-unused-vars */

export default (i18n, admin) => [
  {
    icon: "mdi-view-dashboard",
    text: i18n.t("menu.dashboard"),
    link: "/",
  },
  {
    icon: "mdi-calendar",
    text: i18n.t("menu.calendar"),
    link: "/calendar",
  },
  { divider: true },
  admin.getResourceLink("users"),
  admin.getResourceLink("reviews"),
];

import Dashboard from "views/Dashboard.jsx";
import UserProfile from "views/UserProfile.jsx";
import Inventario from "views/Inventario.jsx";
import Eventos from "views/Eventos.jsx";
import Vitrinas from "views/Vitrinas.jsx";
import ControlAcceso from "views/ControlAcceso.jsx";
import Notifications from "views/Notifications.jsx";
import Upgrade from "views/Upgrade.jsx";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard,
    layout: "/admin"
  },
  // {
  //   path: "/user",
  //   name: "User Profile",
  //   icon: "pe-7s-user",
  //   component: UserProfile,
  //   layout: "/admin"
  // },
  {
    path: "/inventario",
    name: "Inventario",
    icon: "pe-7s-safe",
    component: Inventario,
    layout: "/admin"
  },
  {
    path: "/eventos",
    name: "Eventos",
    icon: "pe-7s-news-paper",
    component: Eventos,
    layout: "/admin"
  },
  {
    path: "/vitrinas",
    name: "Vitrinas",
    icon: "pe-7s-key",
    component: Vitrinas,
    layout: "/admin"
  },
  {
    path: "/ControlAcceso",
    name: "Control de Acceso",
    icon: "pe-7s-lock",
    component: ControlAcceso,
    layout: "/admin"
  },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   icon: "pe-7s-bell",
  //   component: Notifications,
  //   layout: "/admin"
  // },
];

export default dashboardRoutes;

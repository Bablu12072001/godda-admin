/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
// import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import MediaGallery from "layouts/MediaGallery";
import PressGallery from "layouts/PressGallery";
import NewsEventTable from "layouts/NewsAndEvent";
import Blogs from "layouts/BlogPage";
import VideoForm from "layouts/MediaGallery/VideoGallery/VideoAddForm";
import AddNewsForm from "layouts/NewsAndEvent/AddNewsForm";
import AddBlogForm from "layouts/BlogPage/AddBlogForm";
import TrainingVideo from "layouts/TrainingVideo";
import PhotoUpload from "layouts/PhotoUpload";

import Circular from "layouts/Circular";
import AddForm from "layouts/Circular/AddForm";
import AddFormLeadr from "layouts/billing/AddForm";

import PollList from "layouts/Voting/PollList";

import EmployeeTables from "layouts/employees";
import AllMember from "layouts/AllMember";
import EnquiriesTables from "layouts/enquiries";
import EmployeeAdd from "layouts/employees/data/employeeAdd";
import OfficeAdd from "layouts/enquiries/data/officeAdd";
import PresidentMessage from "layouts/presidentMessage";
import AboutUsData from "layouts/about-us";
import ContactsTables from "layouts/contacts";
import ScrollImages from "layouts/scroll-image";
// @mui icons
import Icon from "@mui/material/Icon";
import ViewVoters from "layouts/Voting/ViewVoters";
import AddPoll from "layouts/Voting/AddPoll";
import AddScrollImages from "layouts/scroll-image/data/addScrollImages";
import { useRouter } from "hooks";
import { jwtDecode } from "jwt-decode";
import MissionVision from "layouts/missionVision";
import WeeklyNotices from "layouts/Weekly-Notices";
import WeeklyNoticeAdd from "layouts/Weekly-Notices/data/WeeklyNoticeAdd";
import Affilationadd from "layouts/Affiliation/data/Affiliation-add";
import Affiliation from "layouts/Affiliation";
// import Auth from "./Auth";

let routes = [];
// let {token,decoded} = Auth();
// localStorage.removeItem("loginToken");

const token = localStorage.getItem("loginToken");
// const router = useRouter();

// const decoded = null;
if (!token) {
  // router.push("/");
  // navigate("/login", { replace: true });
  // return { token: null, decoded: null };
  // return;
  // window.location.href="/";
}

try {
  // console.log("Under Authentication Comp");
  var decoded = jwtDecode(token);
  // console.log("Decode Token: ", decoded);
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Token is expired
    localStorage.removeItem("loginToken");
    // navigate("/login", { replace: true });
    // router.push("/")
  }
  // console.log('DecodedData=', decoded);
  // return { token, decoded };
} catch (error) {
  // console.error("Error decoding token:", error);
  localStorage.removeItem("loginToken");
  // navigate("/login", { replace: true });
  // router.push("/");
  // return { token: null, decoded: null };
}

console.log("Token in Routes: ", token);
console.log("Decoded Token in Routes: ", decoded);

// if(decoded?.role==="admin"){

// }

// const routes = [
if (decoded?.role === "admin") {
  routes = [
    {
      type: "collapse",
      name: "Dashboard",
      key: "dashboard",
      icon: <Icon fontSize="small">dashboard</Icon>,
      route: "/dashboard",
      component: <Dashboard />,
    },

    //media Gallery

    {
      type: "collapse",
      name: "Media Gallery",
      key: "media-gallery",
      icon: <Icon fontSize="small">collections</Icon>,
      route: "/media-gallery",
      component: <MediaGallery />,
    },

    //press gallery

    {
      type: "collapse",
      name: "Press Gallery",
      key: "press-gallery",
      icon: <Icon fontSize="small">collections</Icon>,
      route: "/press-gallery",
      component: <PressGallery />,
    },

    //blog
    {
      type: "collapse",
      name: "All Members ",
      key: "allMember",
      icon: <Icon fontSize="small">table_view</Icon>,
      // icon: <Icon fontSize="small">AccountGroup</Icon>,
      route: "/allMember",
      component: <AllMember />,
    },
    {
      type: "collapse",
      name: "Verified Members",
      key: "members",
      icon: <Icon fontSize="small">table_view</Icon>,
      // icon: <Icon fontSize="small">AccountGroup</Icon>,
      route: "/members",
      component: <EmployeeTables />,
    },

    //news event

    {
      type: "collapse",
      name: "News Events",
      key: "news-event",
      icon: <Icon fontSize="small">newspaper</Icon>,
      route: "/news-event",
      component: <NewsEventTable />,
    },
    {
      type: "collapse",
      name: "Blogs",
      key: "blogs",
      icon: <Icon fontSize="small">newspaper</Icon>,
      route: "/blogs",
      component: <Blogs />,
    },

    {
      type: "collapse",
      name: "Training Videos",
      key: "training",
      icon: <Icon fontSize="small">newspaper</Icon>,
      route: "/training",
      component: <TrainingVideo />,
    },

    // Affiliation

    {
      type: "collapse",
      name: "Affiliation",
      key: "affiliation",
      icon: <Icon fontSize="small">newspaper</Icon>,
      route: "/Affiliation",
      component: <Affiliation />,
    },

    {
      // type: "collapse",
      // name: "Employees",
      key: "affilation-add",
      // icon: <Icon fontSize="small">table_view</Icon>,
      // icon: <Icon fontSize="small">AccountGroup</Icon>,
      route: "/affilation-add",
      component: <Affilationadd />,
    },

    //video from

    {
      route: "/video-form",
      component: <VideoForm />,
    },

    {
      route: "/news-form",
      component: <AddNewsForm />,
    },
    {
      route: "/new-blog",
      component: <AddBlogForm />,
    },
    {
      route: "/photo-upload",
      component: <PhotoUpload />,
    },

    // {
    //   type: "collapse",
    //   name: "Tables",
    //   key: "tables",
    //   icon: <Icon fontSize="small">table_view</Icon>,
    //   route: "/tables",
    //   component: <Tables />,
    // },
    // {
    //   type: "collapse",
    //   name: "Billing",
    //   key: "billing",
    //   icon: <Icon fontSize="small">receipt_long</Icon>,
    //   route: "/billing",
    //   component: <Billing />,
    // },
    // {
    //   type: "collapse",
    //   name: "RTL",
    //   key: "rtl",
    //   icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
    //   route: "/rtl",
    //   component: <RTL />,
    // },
    // {
    //   type: "collapse",
    //   name: "Notifications",
    //   key: "notifications",
    //   icon: <Icon fontSize="small">notifications</Icon>,
    //   route: "/notifications",
    //   component: <Notifications />,
    // },
    // {
    //   type: "collapse",
    //   name: "Profile",
    //   key: "profile",
    // {
    //   type: "collapse",
    //   name: "Tables",
    //   key: "tables",
    //   icon: <Icon fontSize="small">table_view</Icon>,
    //   route: "/tables",
    //   component: <Tables />,
    // },
    {
      type: "collapse",
      name: "LeaderShip Team",
      key: "leaderShipTeam",
      icon: <Icon fontSize="small">receipt_long</Icon>,
      route: "/leaderShipTeam",
      component: <Billing />,
    },
    // {
    //   type: "collapse",
    //   name: "RTL",
    //   key: "rtl",
    //   icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
    //   route: "/rtl",
    //   component: <RTL />,
    // },
    // {
    //   type: "collapse",
    //   name: "Notifications",
    //   key: "notifications",
    //   icon: <Icon fontSize="small">notifications</Icon>,
    //   route: "/notifications",
    //   component: <Notifications />,
    // },
    // {
    //   type: "collapse",
    //   name: "Profile",
    //   key: "profile",
    //   icon: <Icon fontSize="small">person</Icon>,
    //   route: "/profile",
    //   component: <Profile />,
    //  },
    {
      type: "collapse",
      name: "Circulars",
      key: "cirular",
      icon: <Icon fontSize="small">person</Icon>,
      route: "/circular",
      component: <Circular />,
    },

    {
      type: "collapse",
      name: "Office's",
      key: "office's",
      icon: <Icon fontSize="small">table_view</Icon>,
      // icon: <Icon fontSize="small">AccountGroup</Icon>,
      route: "/offic's",
      component: <EnquiriesTables />,
    },
    {
      type: "collapse",
      name: "Contacts",
      key: "contacts",
      icon: <Icon fontSize="small">table_view</Icon>,
      // icon: <Icon fontSize="small">AccountGroup</Icon>,
      route: "/contacts",
      component: <ContactsTables />,
    },

    {
      type: "collapse",
      name: "President Message",
      key: "presidentMessage",
      icon: <Icon fontSize="small">table_view</Icon>,
      route: "/presidentMessage",
      component: <PresidentMessage />,
    },
    {
      type: "collapse",
      name: "About Us",
      key: "about-us",
      icon: <Icon fontSize="small">table_view</Icon>,
      route: "/about-us",
      component: <AboutUsData />,
    },
    {
      type: "collapse",
      name: "Mission Vision",
      key: "missionVision",
      icon: <Icon fontSize="small">table_view</Icon>,
      route: "/missionVision",
      component: <MissionVision />,
    },
    {
      type: "collapse",
      name: "Weekly Notices",
      key: "Weekly-Notices",
      icon: <Icon fontSize="small">table_view</Icon>,
      route: "/Weekly-Notices",
      component: <WeeklyNotices />,
    },
    // WeeklyNotices WeeklyNoticeAdd
    {
      // type: "collapse",
      // name: "Employees",
      key: "Weekly-Notices",
      // icon: <Icon fontSize="small">table_view</Icon>,
      // icon: <Icon fontSize="small">AccountGroup</Icon>,
      route: "/WeeklyNoticeAdd",
      component: <WeeklyNoticeAdd />,
    },

    {
      type: "collapse",
      name: "Scroll Images",
      key: "scroll-image",
      icon: <Icon fontSize="small">table_view</Icon>,
      route: "/scroll-image",
      component: <ScrollImages />,
    },
    {
      // type: "collapse",
      // name: "Sign In",
      // key: "sign-in",
      // icon: <Icon fontSize="small">login</Icon>,
      route: "/",
      component: <SignIn />,
    },
    // {
    //   type: "collapse",
    //   name: "Sign Up",
    //   key: "sign-up",
    //   icon: <Icon fontSize="small">assignment</Icon>,
    //   route: "/authentication/sign-up",
    //   component: <SignUp />,
    // },
    {
      // type: "collapse",
      // name: "Sign Up",
      // key: "sign-up",
      // icon: <Icon fontSize="small">assignment</Icon>,
      route: "/add",
      component: <AddForm />,
    },
    {
      // type: "collapse",
      // name: "Sign Up",
      // key: "sign-up",
      // icon: <Icon fontSize="small">assignment</Icon>,
      route: "/add-Leadrship",
      component: <AddFormLeadr />,
    },
    {
      type: "collapse",
      name: "Voting",
      key: "voting",
      icon: <Icon fontSize="small">assignment</Icon>,
      route: "/voting",
      component: <PollList />,
    },
    {
      // type: "collapse",
      // name: "Sign Up",
      // key: "sign-up",
      // icon: <Icon fontSize="small">assignment</Icon>,
      route: "/voting/view/:id/:poll",
      component: <ViewVoters />,
    },
    {
      // type: "collapse",
      // name: "Sign Up",
      // key: "sign-up",
      // icon: <Icon fontSize="small">assignment</Icon>,
      route: "/voting/add-poll",
      component: <AddPoll />,
    },
    {
      // type: "collapse",
      // name: "Employees",
      key: "member",
      // icon: <Icon fontSize="small">table_view</Icon>,
      // icon: <Icon fontSize="small">AccountGroup</Icon>,
      route: "/memberAdd",
      component: <EmployeeAdd />,
    },
    {
      // type: "collapse",
      // name: "Employees",
      key: "office",
      // icon: <Icon fontSize="small">table_view</Icon>,
      // icon: <Icon fontSize="small">AccountGroup</Icon>,
      route: "/officeAdd",
      component: <OfficeAdd />,
    },
    {
      // type: "collapse",
      // name: "Employees",
      // key: "employees",
      // icon: <Icon fontSize="small">table_view</Icon>,
      // icon: <Icon fontSize="small">AccountGroup</Icon>,
      route: "/addScrollImages",
      component: <AddScrollImages />,
    },
  ];
} else {
  routes = [
    {
      // type: "collapse",
      // name: "Sign In",
      // key: "sign-in",
      // icon: <Icon fontSize="small">login</Icon>,
      route: "*",
      component: <SignIn />,
    },
  ];
}

export default routes;

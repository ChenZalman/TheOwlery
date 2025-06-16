import { useRoutes, Navigate } from "react-router-dom";
import { useAuthContext } from './Hooks/UseAuthContext';
import SignInPage from "./components/signInPage";
import SignUpPage from "./components/signupPage";
import HomePage from "./components/homePage";
import NotFoundPage from "./components/notFoundPage";
import ProfilePage from "./components/profilePage";
import EditProfilePage from "./components/editProfilePage";
import Chat from "./components/chatPage";
import  GroupsPage from "./components/groupsPage";
import GroupPage from "./components/group";
import AnalyticsPage from "./components/graphs/analyticsPage";
import MainFeed from "./components/MainFeed";

const ProjectRoutes = () => {
  const {user, loading} = useAuthContext();

  let element = useRoutes([
    { path: "/", element: <HomePage />  }, //This is the default page of our website to which the user is getting to.
    { path: "*", element: <NotFoundPage /> },  //This page is for wrong navigations preformed by the user
    { path: "/signinpage", element:<> {loading ? <div>Loading...</div> : !user ? <SignInPage /> : <Navigate to="/post"/>}</>},  //In this line element gets a component that return a page to get a user info if a user isn't signed
    { path: "/signuppage", element:<> {loading ? <div>Loading...</div> : !user ?  <SignUpPage />  : <Navigate to="/signinpage"/>}</>},  //In this line element gets a component that return a page to get a user info if a user isn't signed
    { path: "/post", element:<> {loading ? <div>Loading...</div> : user ?  <ProfilePage user = {user}/>  : <Navigate to="/signinpage"/>}</>},
    { path: "/analyticsPage", element:<> {loading ? <div>Loading...</div> : user ?  <AnalyticsPage user = {user}/>  : <Navigate to="/signinpage"/>}</>},
    { path: "/editprofile", element:<> {loading ? <div>Loading...</div> : user ?  <EditProfilePage user = {user}/>  : <Navigate to="/editnotfound"/>}</>},
    { path: "/chat", element:<> {loading ? <div>Loading...</div> : user ?  <Chat user = {user}/>  : <Navigate to="/chat"/>}</>},
    { path: "/groups", element:<> {loading ? <div>Loading...</div> : user ?  <GroupsPage user = {user}/>  : <Navigate to="/chat"/>}</>},
    { path: "/groups/:groupId", element: <GroupPage /> },
    { path: "/mainFeed", element:<> {loading ? <div>Loading...</div> : user ?  <MainFeed user = {user}/>  : <Navigate to="/signinpage"/>}</>},
  ]);

  return element;
};

export default ProjectRoutes;

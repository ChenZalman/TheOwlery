import { useRoutes, Navigate } from "react-router-dom";
import { useAuthContext } from './Hooks/UseAuthContext';
import SignInPage from "./components/signInPage";
import SignUpPage from "./components/signupPage";
import HomePage from "./components/homePage";
import NotFoundPage from "./components/notFoundPage";
import Post from "./components/post";
import Feed from "./components/feed";


const ProjectRoutes = () => {
  const {user} = useAuthContext();
  let element = useRoutes([
    { path: "/", element: <HomePage />  }, //This is the default page of our website to which the user is getting to.
    { path: "*", element: <NotFoundPage /> },  //This page is for wrong navigations preformed by the user
    { path: "/signinpage", element:<>  {!user ? <SignInPage /> : <Navigate to="/Pop"/>}</>},  //In this line element gets a component that return a page to get a user info if a user isn't signed
    { path: "/signuppage", element:<>  {!user ?  <SignUpPage />  : <Navigate to="/Pop"/>}</>},  //In this line element gets a component that return a page to get a user info if a user isn't signed
     { path: "/post", element:<>  {!user ?  <Feed/>  : <Navigate to="/Pop"/>}</>},
  ]);

  return element;
};

export default ProjectRoutes;

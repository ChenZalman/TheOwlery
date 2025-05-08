import { useRoutes, Navigate } from "react-router-dom";
import SignInPage from "./components/signInPage";
import SignUpPage from "./components/signupPage";
import { HomePage } from "./components/homePage";
import { useAuthContext } from './Hooks/UseAuthContext';


const ProjectRoutes = () => {
  const {user} = useAuthContext();
  let element = useRoutes([
    { path: "/", element: <HomePage />  },
    { path: "*", element: <HomePage /> },
    { path: "/signinpage", element:<>  {!user ? <SignInPage /> : <Navigate to="/Pop"/>}</>},  //In this line element gets a component that return a page to get a user info if a user isn't signed
    //{ path: "/aboutpage", element: <AboutPagePage />},
    //{ path: "/afterregistrationpage", element: <AfterSignedUpPagePage />},
    { path: "/signuppage", element:<>  {!user ?  <SignUpPage />  : <Navigate to="/Pop"/>}</>},  //In this line element gets a component that return a page to get a user info if a user isn't signed

  ]);

  return element;
};

export default ProjectRoutes;

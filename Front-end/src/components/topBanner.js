import { Link } from "react-router-dom";
import { useAuthContext } from '../Hooks/UseAuthContext';
import { useSignout } from "../Hooks/UseSignout"; 

export default function TopBanner() {
    const {user} = useAuthContext();
    const {signOut} = useSignout()
    const handleClick = () =>{
        signOut()
    }
  return (
    <div>
    <div style={{height:`50px`,display:`flex` ,gap:`100px` ,border:`solid`}}>
            <Link to="/">
                Back to main station
            </Link>
            <Link to="/signinpage">
                Welcome wizard
            </Link>
            <Link to="/signuppage">
                Become a wizard
            </Link>
            <Link to="/notFoundPage">
                Vanish to nowhere
            </Link>
            <Link to="/post">
                See a post demo
            </Link>
            {user && <button onClick={handleClick} style={{border:`solid`, height:`50px`}}>sign out</button>}
    </div>
    </div>
  )
}

import { Link } from "react-router-dom";
import { useAuthContext } from '../Hooks/UseAuthContext';
import { useSignout } from "../Hooks/UseSignout"; 

export function HomePage(){

    const {user} = useAuthContext();
    const {signOut} = useSignout()
    const handleClick = () =>{
        signOut()
    }
    return(
        <div style={{minHeight:`100px`,display:`flex` ,gap:`100px` ,border:`solid`,}}>
            <Link to="/signinpage">
                Welcome wizard
            </Link>
            <Link to="/signuppage">
                Become a wizard
            </Link>
            {user && <button onClick={handleClick} style={{border:`solid`, height:`50px`}}>sign out</button>}
        </div>
    )
}
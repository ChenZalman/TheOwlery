import { useAuthContext } from './UseAuthContext';


export const useSignout = () =>{
    const {dispatch} = useAuthContext()
    

    const signOut = () =>{
        //remove user from storage
        localStorage.removeItem('user')
        //dispatch call
        dispatch({type: 'LOGOUT'})
    
    }

    return {signOut}
}
import { useState } from "react";
import { useAuthContext } from "./UseAuthContext";
import axios from "axios";


export const UseSignInUp = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const {dispatch} = useAuthContext()
    const address = process.env.REACT_APP_ADDRESS;
    const port = process.env.REACT_APP_PORT;

    const singInUp = async (formData,command) => {
        setIsLoading(true)
        setError(null)

        try{
            console.log('Form submitted:', formData);
            console.log(`address is: ${address} and the port is: ${port}`)
            const response = await axios.post(`http://${address}:${port}/api/users`,{
                command:command,
                data: formData
            })

            const json = await response.data.user
            console.log(`user returned` , json)
            //save the user to local storage
            localStorage.setItem("user", JSON.stringify(json.email))

            //update Authcontact
            dispatch({type: 'LOGIN', payload: json})

            setIsLoading(false)
        }catch(err){
            setIsLoading(false)
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error); // Handle server-provided error message
              }
            alert(err.message)
        }
    } 
    return {singInUp,isLoading,error}
}
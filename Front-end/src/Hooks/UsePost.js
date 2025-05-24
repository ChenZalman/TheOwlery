import { useState } from "react";
import axios from "axios";
import { usePostContext } from "./UsePostContext";



export const UsePost = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const {dispatch} = usePostContext()
    const address = process.env.REACT_APP_ADDRESS;
    const port = process.env.REACT_APP_PORT;

    const post = async (formData,command) => {
        setIsLoading(true)
        setError(null)

        try{
            console.log('Form submitted:', formData);
            // console.log(`address is: ${address} and the port is: ${port}`)
            const response = await axios.post(`http://${address}:${port}/api/posts`,{
                command:command,
                data: formData
            })

            const json = await response.data.post
            console.log(`post returned` , json)
            dispatch({type: 'GET', payload: json})

            setIsLoading(false)
            return json
        }catch(err){
            setIsLoading(false)
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error); // Handle server-provided error message
              }
            alert(err.message)
        }
    } 
    return {post,isLoading,error}
}
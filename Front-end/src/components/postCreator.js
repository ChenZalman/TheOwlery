import { useAuthContext } from "../Hooks/UseAuthContext";
import { UsePost } from "../Hooks/UsePost";
import { useState } from "react";
import { UseSignInUp } from "../Hooks/UseSignInUp";


const PostCreator = () =>{
    const {post,isLoading,error} = UsePost()
    const {user,loading} = useAuthContext()
    const {signInUp} = UseSignInUp()
    const [formData, setFormData] = useState({
        text: ''
    });


    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
    const handleSubmit = async (e) => {
        e.preventDefault();
        Object.assign(formData,{userId: user.userId })
        const json = await post(formData,"create")
        if(user.postsId)
        Object.assign(user,{postsId:[...user.postsId,json.id]})
        else
        Object.assign(user,{postsId:[json.id]})
        signInUp({...user},'update')
    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="text"
                    value={formData.text}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.5rem', border:'solid', borderWidth:1, borderColor: "#112211" }}
                    />
                <button type="submit">
                        POST!
                </button>
            </form>
        </div>
    )
}
export default PostCreator
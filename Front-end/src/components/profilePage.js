import Feed from "./feed";
import testPosts from "./testPosts.js";
import { useSignout } from "../Hooks/UseSignout.js"
import {UseSignInUp} from "../Hooks/UseSignInUp.js"
import { useNavigate, Link } from "react-router-dom";

const ProfilePage = ({user}) => {
    const {signOut} = useSignout()
    const {singInUp,isLoading,error} = UseSignInUp()

    Object.assign(user,{posts: testPosts, profilePicture : `https://cdn.pixabay.com/photo/2012/04/18/23/36/boy-38262_1280.png`})
    user.posts.map((post) => Object.assign(post,{profilePicture: `https://cdn.pixabay.com/photo/2012/04/18/23/36/boy-38262_1280.png`}))

    const handleClick = async () =>{      
      await singInUp(user,"delete")
       signOut()
    }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{
        padding: '1.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '1rem',
        border: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <img
          src={user.profilePicture}
          alt="Profile"
          style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover' }}
        />
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{user.name || `Annonymus user`}</h1>
          <p style={{ color: 'gray', marginTop: '0.25rem' }}>{user.bio || `Bio - comming soon`}</p>
        </div>
        <Link  to={'/editprofile'}>edit user</Link>
      </div>

      <div style={{
        padding: '1rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '1rem',
        border: '1px solid #ccc'
      }}>
        <Feed posts = {user.posts} />
      </div>
    </div>
  );
};

export default ProfilePage;
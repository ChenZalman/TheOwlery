import { useState, useEffect } from 'react';
import { UseSignInUp } from '../Hooks/UseSignInUp';

const backGroundImage = 'images/backGroundImage.jpg'
export default function SignUpPage() {

  const {singInUp,isLoading,error} = UseSignInUp()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
    birthDate:''
  });
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    //const imgRef = useRef(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await singInUp(formData,"signup")
    // try{
    //     const response = await axios.post("http://localhost:5000/api/users",{
    //         data: formData
    //     })
    // }catch(err){
    //     alert(err.message)
    // }
    // console.log('Form submitted:', formData);
  };

  useEffect(() => {
    const img = new Image();
    img.src = backGroundImage;
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });
    };
  }, []);

  return (
    <div style={{backgroundImage: `url(${backGroundImage})`,
        backgroundSize: 'auto',
        backgroundRepeat: 'no-repeat',
        width: imageSize.width,
        height: imageSize.height,
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center', // horizontally center
        alignItems: 'center', // vertically center
        minHeight: '100vh' // ensure it takes full viewport height
    }}>
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem', transform: 'translateY(-40px)'}}>
            <h1 style={{color:"#ffffff" }}>Sign Up</h1>
            <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem'}}>
                <label style={{color:"#ffffff" }}>Name:</label>
                <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.5rem', border:'solid', borderWidth:1, borderColor: "#112211" }}
                />
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label style={{color:"#ffffff" }}>Email:</label>
                <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.5rem', border:'solid', borderWidth:1, borderColor: "#112211" }}
                />
            </div>
            <div style={{ marginBottom: '1rem' }}>
            <label style={{color:"#ffffff" }}>Password:</label>
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.5rem', border:'solid', borderWidth:1, borderColor: "#112211" }}
            />
            </div>

            <div style={{ 
            marginBottom: '1rem', 
            display: 'flex', 
            gap: '1rem' // adds space between the two selects
            }}>
                <div style={{ flex: 1 }}>
                <label style={{color:"#ffffff" }}>Gender:</label>
                    <select
                    name="gender"
                    value={formData.gender1}
                    onChange={handleChange}
                    required
                    defaultValue={formData.gender}
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: 'solid',
                        borderWidth: 1,
                        borderColor: "#112211"
                    }}
                    >
                    <option value="" disabled>Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    </select>
                </div>

                <div style={{ flex: 1 }}>
                <label style={{color:"#ffffff" }}>Date of Birth:</label>
                    <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '0.5rem', border:'solid', borderWidth:1, borderColor: "#112211" }}
                    />
                </div>
            </div>
            <div style={{ display:'flex',justifyContent:'center' ,padding: '0.5rem 1rem', border:'solid', borderWidth:1, borderColor: "#ffffff", font:'bold' }}>
                <button type="submit" style={{color:"#ffffff" }}>
                Become a wizard
                </button>
            </div>
        </form>
        </div>
    </div>
  );
}
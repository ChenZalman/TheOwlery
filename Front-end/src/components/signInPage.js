import React, { useState, useEffect } from 'react';
import axios from "axios";

const backGroundImage = 'images/backGroundImage.jpg'
export default function SignInPage() {
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
    try{
        const response = await axios.post("http://localhost:5000/api/users",{
            data: formData
        })
    }catch(err){
        alert(err.message)
    }
    console.log('Form submitted:', formData);
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
                <div style={{ display:'flex',justifyContent:'center' ,padding: '0.5rem 1rem', border:'solid', borderWidth:1, borderColor: "#ffffff", font:'bold' }}>
                    <button type="submit" style={{color:"#ffffff" }}>
                    Welcome old wizard
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
}
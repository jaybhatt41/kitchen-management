import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./Login.css"

const Login = () => {
    const[error,setError]=useState("")
    const[success,setSuccess]=useState("")
    const[formData,setFormData]=useState({
        email:"",
        password:""
    })

    const navigate=useNavigate()

    const handelChange=(e)=>{
        const{name,value}=e.target
        setFormData({...formData,[name]:value})
    }

    const handelSubmit=async(e)=>{
        e.preventDefault()
        setError("")
        setSuccess("")
        try {
            const response=await axios.post("http://localhost:5000/api/user/login",formData)
            setSuccess(response.data.msg)
            localStorage.setItem("token",response.data.token)
            navigate("/dashboard/overview")
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.msg);
              } else {
                setError("Something went wrong. Please try again.");
              }
            }
        
    }

  return (
    <div className='main'>
        <div className='login-container'>
            <h2 className='login-title'>Login</h2>
            {error && <p className='error'>{error}</p>}
            {success && <p className='success'>{success}</p>}

            <form className='login-form' onSubmit={handelSubmit}>
                <input
                    className='inputfield'
                    type='email'
                    placeholder='Enter Your Email'
                    value={formData.email}
                    name='email'
                    onChange={handelChange}
                    required
                />
                <input
                    className='inputfield'
                    type='password'
                    placeholder='Enter Your Password'
                    value={formData.password}
                    name='password'
                    onChange={handelChange}
                    required
                />
             <div className='register-link'>
             <span>Doesn`t have account?</span><Link to={"/"}>Register</Link>
             </div>
                <button className='submit-button' type='submit'>Login</button>
            </form>
        </div>

    </div>
  )
}

export default Login
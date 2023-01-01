import React,{useState} from 'react'
import {Redirect} from 'react-router-dom'
import {Authenticate,signin} from '../auth'
import Loading from '../Loading'
import ForgotPassword from './ForgotPassword'
import SocialLogin from './SocialLogin'
const Signin = () => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [error,setError] = useState('');
    const [redirectToReferer,setRedirectToReferer] = useState(false);
    const [loading,setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const user = {email,password} ;
        signin(user)
        .then(data => {
            if(data.error){
                setError(data.error)
                setLoading(false);
            }
            else{
                // Auth
                Authenticate(data,() => {
                    // redirect
                    setRedirectToReferer(true)
                })
            }
        })
    }

    if(error){
        setTimeout(() => {
            setError('');
          },5000);
    }

    if(redirectToReferer){
        return <Redirect to="/" />
    }

    const signinForm = () =>{
        return(
           <>
            <hr />
            <SocialLogin />
            <hr />
            <form>
                <div className="form-group">
                    <label className="text-muted" >Email</label>
                    <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required/>
                </div>
                <div className="form-group">
                    <label className="text-muted">Password</label>
                    <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required/>
                </div>
                <button className='btn btn-raised btn-primary' onClick={onSubmit} type='submit'>Signin</button>
                <p> <a href='.ForgetModal' data-toggle="modal" className="btn btn-raised btn-danger">  {" "}  Forgot Password?   </a> </p>
            </form>
            <ForgotPassword />
           </>
        )
    }

    return (
        <div className="container">
            <h2 className="mt-5 mb-5">Login</h2>
            {error &&  
                 <div className={`alert alert-danger`}>
                 <i className="fas fa-info-circle" /> {error}
                 </div>
            }

            { loading && 
                <Loading />
            }


            {signinForm()}
        </div>
    )
}

export default Signin

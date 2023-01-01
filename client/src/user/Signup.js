import React,{useState} from 'react'
import {Link} from 'react-router-dom'
import {signup} from '../auth'
import Loading from '../Loading'

const Signup = () => {
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [error,setError] = useState('');
    const [open,setOpen] = useState(false);
    const [loading,setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const user = {name,email,password} ;
        signup(user)
        .then(data => {
            if(data.error){
                setError(data.error)
                setLoading(false);
            }
            else{
                setError('')
                setEmail('')
                setPassword('')
                setName('')
                setOpen(true)
                setLoading(false)
            }
        })
    }

    if(error){
        setTimeout(() => {
            setError('');
          },3000);
    }

    const signupForm = () =>{
        return(
            <form>
                <div className="form-group">
                    <label className="text-muted">Name</label>
                    <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="text-muted" >Email</label>
                    <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label className="text-muted">Password</label>
                    <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)}/>
                </div>
                <button className='btn btn-raised btn-primary' onClick={onSubmit}>Signup</button>
            </form>
        )
    }

    return (
        <div className="container">
            <h2 className="mt-5 mb-5">Register</h2>

            { loading && 
                <Loading />
            }

            {error &&  
                 <div className={`alert alert-danger`}>
                 <i className="fas fa-info-circle" /> {error}
                 </div>
            }

            {open &&  
                 <div className={`alert alert-info`}>
                 <i className="fas fa-info-circle" /> New Account is successfully created ,Please 
                 <Link to="/signin"> Sign In</Link>.
                 </div>
            }

            {signupForm()}
        </div>
    )
}

export default Signup

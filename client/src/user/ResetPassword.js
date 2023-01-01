import React,{useState,useEffect} from 'react'
import {isAuthenticate, signout,resetPassword } from "../auth";


const ResetPassword = (props) => {

    const [newPassword, setNewPassword] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');


    useEffect(() => {
        if(isAuthenticate()){
            signout(() => console.log('Disconnected')) ;
        }
    }, [])

    const resetPass = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        resetPassword({
            newPassword: newPassword,
            resetPasswordLink: props.match.params.resetPasswordToken
        }).then(data => {
            if (data.error) {
                console.log(data.error);
                setError(data.error);
            } else {
                console.log(data.message);
                setSuccess(data.message);
                setNewPassword("")
            }
        });
    }

    
    return (
        <div className="container">
            <h2 className="mt-5 mb-5">Reset your Password</h2>

            {error &&  
                <div className={`alert alert-danger`}>
                    <i className="fas fa-info-circle" /> {error}
                </div>  }

            {success &&  
            <div className={`alert alert-success`}>
                <i className="fas fa-info-circle" /> {success}
            </div> }

            <form>
                <div className="form-group mt-5">
                    <input  type="password"  className="form-control" placeholder="Your new password"  value={newPassword}
                        name="password"  onChange={e =>setNewPassword(e.target.value)  }  autoFocus
                    />
                </div>
                <button
                    onClick={resetPass}
                    className="btn btn-raised btn-primary"
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
}

export default ResetPassword

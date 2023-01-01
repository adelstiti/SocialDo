import React, { Component } from 'react';
import {forgotPassword} from '../auth'

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
        email : '',
        error : '',
        success : ''
        };
      }
      
      handleChange = (e) => {
        const name = e.target.name ;
        const value = e.target.value 
        this.setState({ [name]: value });
    }

    forgotPassword = async  e =>  {
        e.preventDefault();
            this.setState({ success: "", error: "" });
            forgotPassword(this.state.email).then(data => {
                if (data.error) {
                    this.setState({ error: data.error });
                } else {
                    this.setState({ success: data.message });
                }
            });

    };

        render() {
        const { error,success,email} = this.state;
        const handleChange = this.handleChange ;
        const forgotPassword = this.forgotPassword ;

        if(error){
            setTimeout(() => {
                this.setState({ error: '' });
              },3000);
        }


        if(success){
            setTimeout(() => {
                this.setState({ success: '' });
              },20000);
        }



        return (
            <>
            <div className="modal fade ForgetModal show" >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title" id="exampleModalLabel">Forgot your password?</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {error &&  
                            <div className={`alert alert-danger`}>
                            <i className="fas fa-info-circle" /> {error}
                            </div>
                            }
                            {success &&  
                            <div className={`alert alert-success`}>
                            <i className="fas fa-info-circle" /> {success}
                            </div>
                            }
                            <form>
                                <div className="form-group">
                                    <label htmlFor="user-forget" className="col-form-label">Email</label>
                                    <input type="email" className="form-control" name="email" id="user-forget" value={email}  placeholder="Enrer email address" onChange={handleChange} autoFocus/>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn btn-secondary btn-raised" onClick={forgotPassword}>Send Password Rest Link</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            </>
        );
    }

}
export default ForgotPassword;

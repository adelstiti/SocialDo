import React, { Component } from 'react';
import {update,updateNameUser} from './apiUser'
import DefaultProfile from '../images/avatar.png'

class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
        user: this.props.user,
        id: this.props.user._id,
        name: this.props.user.name,
        email: this.props.user.email,
        about : this.props.user.about,
        password: this.props.user.password,
        token : this.props.token,
        error : '',
        success : '',
        filesize :  0
        };
      }

      componentDidMount() {
        this.userData = new FormData();
      }
     handleChange = (e) => {
         
        const name = e.target.name ;
        const filesize = e.target.name  === 'photo' ? e.target.files[0].size : 0
        const value = e.target.name  === 'photo' ? e.target.files[0] : e.target.value 
        this.userData.set(name,value);   
        this.setState({ [name]: value ,filesize});
    }

     onSubmit= ()=>{
         if(this.isValid()){
            this.setState({ error: '' });
            update(this.state.id,this.state.token,this.userData)
            .then(data => {
            if(data.error){
                this.setState({ error: data.error });
            }
            else{
            this.props.setUser(data)
            updateNameUser(data,()=> {
                this.setState({ success: 'The account was successfully updated' });
            })
            }

        })
         }
    }

   
    isValid = () => {
        const { name, email, password,filesize } = this.state;
        if (filesize > 1000000) {
            this.setState({ error: "File size should be less than 100kb"  });
             return false;
        }
        if (name.length === 0) {
          this.setState({ error: "Name is required" });
          return false;
        }
        // email@domain.com
        if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
          this.setState({
            error: "A valid Email is required",
          });
          return false;
        }
        if(password){
        if (password.length >= 1 && password.length <= 5) {
            this.setState({
              error: "Password must be at least 6 characters long",
            });
            return false;
          }          
        }else{
            this.setState({
                error: "Password must be required",
              });
              return false;
        }
        return true;
      };

    render() {
        const { error,success,name,email,id,about} = this.state;
        const handleChange = this.handleChange ;

        if(error){
            setTimeout(() => {
                this.setState({ error: '' });
              },3000);
        }


        if(success){
            setTimeout(() => {
                this.setState({ success: '' });
              },5000);
        }


    const photoUrl = id ? `${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}` 
    : DefaultProfile ;

        return (
            <div className="modal fade Editmodal" >
        <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Edit Profile</h5>
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
                    <img className="w-25 img-thumbnail" src={photoUrl} alt={name} onError={i =>{i.target.src = DefaultProfile}} />
                    <form >
                    <div className="form-group">
                        <label htmlFor="user-photo" className="col-form-label">Profile Photo:</label>
                        <input type="file" className="form-control-file" name="photo" id="user-photo" accept="image/*" onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="user-name" className="col-form-label">Name:</label>
                        <input type="text" className="form-control" name="name" id="user-name"  value={name} onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="user-email" className="col-form-label">Email:</label>
                        <input type="email" className="form-control" name="email" id="user-email" value={email} onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="user-about" className="col-form-label">About:</label>
                        <textarea className="form-control" id="user-about" rows="3" name="about" value={about} onChange={handleChange} ></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="user-password" className="col-form-label">Password:</label>
                        <input type="password" className="form-control" id="user-password" name="password" onChange={handleChange}/>
                    </div>
                    </form>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="submit"   className="btn btn-primary" onClick={this.onSubmit}>Edit</button>
                </div>

            </div>
        </div>
    </div>
        );
    }

}
export default EditProfile;
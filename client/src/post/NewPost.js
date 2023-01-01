import React, { Component } from 'react';
import {create} from './apiPost'
import {isAuthenticate} from '../auth'
import {Redirect} from 'react-router-dom'
import Loading from '../Loading'
class NewPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
        title : '',
        body : '',
        photo : '',
        user : {},
        loading : false,
        error : '',
        filesize :  0,
        redirectTo : false
        };
      }

      componentDidMount() {
        this.postData = new FormData();
        this.setState({user : isAuthenticate().user})
      }

     handleChange = (e) => {
        const name = e.target.name ;
        const filesize = e.target.name  === 'photo' ? e.target.files[0].size : 0
        const value = e.target.name  === 'photo' ? e.target.files[0] : e.target.value 
        this.postData.set(name,value);   
        this.setState({ [name]: value ,filesize});
    }

    isValid = () => {
        const { title, body,filesize } = this.state;
        if (filesize > 1000000) {
            this.setState({ error: "File size should be less than 100kb"  ,loading : false  });
             return false;
        }
        if (title.length === 0 || body.length === 0) {
          this.setState({ error: "All Fields are required" ,loading : false });
          return false;
        }
        
        return true;
      };

    clickSubmit= (e)=>{
         e.preventDefault();
        this.setState({loading : true});
         if(this.isValid()){
            const token = isAuthenticate().token;
            const userId = isAuthenticate().user._id;

            create(userId,token,this.postData)
            .then(data => {
            if(data.error){
                this.setState({ error: data.error });
            }
            else{
                this.setState({
                    loading : false,
                    title : '',
                    body: '',
                    photo : '',
                    redirectTo: true })
            }
        })
         }
    }
   
    render() {
        const { error,title,body,loading,redirectTo,user} = this.state;
        if(error){
            setTimeout(() => {
                this.setState({ error: '' });
              },3000);
        }

        if(redirectTo){ return <Redirect to={`/user/${user._id}`} />   }
        
        return (
    <div className="container">
        <h2 className="mt-5 mb-5">Create a New Post</h2>
            {loading &&  <Loading />}

            {error &&  
                 <div className={`alert alert-danger`}>
                 <i className="fas fa-info-circle" /> {error}
                 </div>
            }
            <form>
                <div className="form-group">
                    <label className="text-muted">Post Photo</label>
                    <input  onChange={this.handleChange} type="file"  accept="image/*" name="photo"  className="form-control"  />
                    
                </div>
                <div className="form-group">
                    <label className="text-muted">Title</label>
                    <input   onChange={this.handleChange} name="title" type="text" className="form-control"  value={title} />
                </div>

                <div className="form-group">
                    <label className="text-muted">Body</label>
                    <textarea   onChange={this.handleChange} name="body" className="form-control" value={body}   />
                </div>
            <button onClick={this.clickSubmit} className="btn btn-raised btn-primary"> Create Post </button>
            </form>
    </div>
        );
    }

}
export default NewPost;
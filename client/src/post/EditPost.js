import React, { Component } from 'react';
import {update} from './apiPost'
import DefaultPostPic from '../images/cover.jpg'
import {isAuthenticate} from '../auth'

class EditPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
        post: this.props.post,
        id: this.props.post._id,
        title: this.props.post.title,
        body: this.props.post.body,
        error : '',
        success : '',
        filesize :  0
        };
      }

      componentDidMount() {
        this.postData = new FormData();
      }
     handleChange = (e) => {
         
        const name = e.target.name ;
        const filesize = e.target.name  === 'photo' ? e.target.files[0].size : 0
        const value = e.target.name  === 'photo' ? e.target.files[0] : e.target.value 
        this.postData.set(name,value);   
        this.setState({ [name]: value ,filesize});
    }

     onSubmit= ()=>{
        const token = isAuthenticate().token ; 

         if(this.isValid()){
            this.setState({ error: '' });
            update(this.state.id,token,this.postData)
            .then(data => {
            if(data.error){
                this.setState({ error: data.error });
            }
            else{
            this.props.setPost(data)
            this.setState({ success: 'The Post was successfully updated' });
            }

        })
         }

         
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

    render() {
        const { error,title,body,success,post} = this.state;
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


        const photoUrl = post.photo ? `${process.env.REACT_APP_API_URL}/post/photo/${post._id}?${new Date().getTime()}` : DefaultPostPic ;

        return (
            <div className="modal fade EditPostmodal" >
        <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Edit Post</h5>
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
                    <img className="w-25 img-thumbnail" src={photoUrl} alt={title} onError={i =>{i.target.src = DefaultPostPic}} />
                    <form >
                    <div className="form-group">
                        <label htmlFor="post-photo" className="col-form-label">Post Photo:</label>
                        <input type="file" className="form-control-file" name="photo" id="post-photo" accept="image/*" onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="post-title" className="col-form-label">Title:</label>
                        <input type="text" className="form-control" name="title" id="post-title"  value={title} onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="post-content" className="col-form-label">Content:</label>
                        <textarea className="form-control" id="post-content" rows="3" name="body" value={body} onChange={handleChange} ></textarea>
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
export default EditPost;
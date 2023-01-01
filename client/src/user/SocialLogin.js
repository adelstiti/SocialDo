import React,{useState} from 'react'
import GoogleLogin from "react-google-login";
import { socialLogin, Authenticate } from "../auth";
import FacebookLogin from "react-facebook-login";
import { Redirect } from "react-router-dom";

require('dotenv').config()

const SocialLogin = () => {
    const [redirectToReferer,setRedirectToReferer] = useState(false);


    const responseGoogle = response => {
        const { googleId, name, email, imageUrl } = response.profileObj;
        const user = {
            password: googleId,
            name: name,
            email: email,
            imageUrl: imageUrl
        };

        socialLogin(user).then(data => {
            if (data.error) {
                console.log("Error Login. Please try again..");
            } else {
                Authenticate(data, () => {
                    setRedirectToReferer(true)
                });
            }
        });
    };
    
    const responseFacebook = (response) => {

        const { id, name, email, picture } = response;
        
        const user = {
            password: id,
            name: name,
            email: email,
            imageUrl: picture.data.url
        };

        socialLogin(user).then(data => {
            if (data.error) {
                console.log("Error Login. Please try again..");
            } else {
                Authenticate(data, () => {
                    setRedirectToReferer(true)
                });
            }
        });


      }


    if(redirectToReferer){
        return <Redirect to="/" />
    }
    
    return (
        <div className="container">
                <GoogleLogin
                    clientId={`${process.env.REACT_APP_GOOGLE_ID}`}
                    buttonText="Login with Google"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    className="mr-2 "
                />

                
                <FacebookLogin
                    appId="2406354233013519"
                    fields="name,email,picture"
                    textButton="Login with Facebook"
                    callback={responseFacebook} 
                    cssClass="FbButton mt-2"
                    icon="fa-facebook"
                 />
                
            </div>
    )
}

export default SocialLogin

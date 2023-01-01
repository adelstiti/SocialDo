
// Method Component Signup

export const signup = (user) =>{
    return  fetch(`${process.env.REACT_APP_API_URL}/signup`,{
            method : "POST",
            headers : {
                Accept : "application/json",
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(user)
        })
        .then(res => {
            return res.json();
        })
        .catch(err => console.log(err))
}



// Methods Component Signin

export const signin = (user) =>{
    return  fetch(`${process.env.REACT_APP_API_URL}/signin`,{
          method : "POST",
          headers : {
              Accept : "application/json",
              "Content-Type" : "application/json"
          },
          body : JSON.stringify(user)
      })
      .then(res => {
          return res.json();
      })
      .catch(err => console.log(err))
}

export const Authenticate = (jwt,next) => {
    if(typeof window !== "undefined"){
        localStorage.setItem("jwt", JSON.stringify(jwt));
        next();
    }
}


// Methods Component Navbar

export const signout = (next) => {
    if(typeof window != "undefined") 
    localStorage.removeItem('jwt')
    next()
    return  fetch(`${process.env.REACT_APP_API_URL}/signout`,{
            method : "GET"})
        .then(res => {
            console.log(res)
            return res.json();
        })
        .catch(err => console.log(err))
}

export const isAuthenticate = () => {
    if(typeof window == "undefined"){
        return false
    }

    if(localStorage.getItem('jwt')){
        return JSON.parse(localStorage.getItem('jwt'))
    }
    else{
        return false
    }
}

export const forgotPassword = email => {
    return fetch(`${process.env.REACT_APP_API_URL}/forgot-password/`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const resetPassword = resetInfo => {
    return fetch(`${process.env.REACT_APP_API_URL}/reset-password/`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(resetInfo)
    })
        .then(response => {
            console.log("forgot password response: ", response);
            return response.json();
        })
        .catch(err => console.log(err));
};

export const socialLogin = user => {
    return fetch(`${process.env.REACT_APP_API_URL}/social-login/`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        // credentials: "include", // works only in the same origin
        body: JSON.stringify(user)
    })
        .then(response => {
            console.log("signin response: ", response);
            return response.json();
        })
        .catch(err => console.log(err));
};

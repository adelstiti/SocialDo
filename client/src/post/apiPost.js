export const create = (userId, token, post) =>{
    return  fetch(`${process.env.REACT_APP_API_URL}/post/new/${userId}`,{
            method : "POST",
            headers : {
                Accept : "application/json",
                Authorization: `Bearer ${token}`
            },
            body : post
        })
        .then(res => {
            return res.json();
        })
        .catch(err => console.log(err))
}

export const list = () =>{
    return fetch(`${process.env.REACT_APP_API_URL}/posts`,{
         method : "GET"
     })
     .then(res => {
         return res.json();
     })
     .catch(err => console.log("Erorr",err)  )
 }

 export const readPost = (postId) =>{
    return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`,{
         method : "GET"
     })
     .then(res => {
         return res.json();
     })
     .catch(err => console.log("Erorr",err)  )
 }


 export const listbyUserId = (userId,token) =>{
    return fetch(`${process.env.REACT_APP_API_URL}/posts/by/${userId}`,{
         method : "GET",
         headers : {
             Accept : "application/json",
             'Content-Type' : 'application/json',
             Authorization: `Bearer ${token}`
         }
     })
     .then(res => {
         return res.json();
     })
     .catch(err => console.log("Erorr",err)  )
 }

 export const deletePost = (postId,token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`,{
         method : "DELETE",
         headers : {
             Accept : "application/json",
             "Content-Type" : "application/json",
             Authorization : `Bearer ${token}`
         }
     })
     .then(res => {
         return res.json();
     })
     .catch(err => console.log("Erorr",err)  )
 }


 export const update = (postId, token, post) => {
    // console.log("USER DATA UPDATE: ", user);
    return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: post
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};



export const getLike = (userId,token,postId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/like`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type" : "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({userId,postId})
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
}

export const unlike = (userId,token,postId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/unlike`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type" : "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({userId,postId})
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
}


export const comment = (userId,token,postId,comment) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/comment`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type" : "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({userId,postId,comment})
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
}

export const uncomment = (userId,token,postId,comment) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/uncomment`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type" : "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({userId,postId,comment})
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
}
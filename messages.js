const generateMessage = (username,text) => {   // it recieves text as argument 
    return {
        username,
        text,            // and return object containing text,and time
        createdAt: new Date().getTime()
    }
}
const generateLocationMessage = (username,url) =>{

    return {
        username,
        url,
        createdAt : new Date().getTime()
    }
}
module.exports = {
    generateMessage,
    generateLocationMessage
}

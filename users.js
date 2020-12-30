

const users = []  // this is used to save users

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    // Store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)   //find index find user by id
              // it return -1 if not found else return 0aur greater value
    if (index !== -1) {
        return users.splice(index, 1)[0]  // delete 1 object 
    }
}

const getUser = (id) =>{
  
    return users.find((user) => id == user.id)

    // const User = users.filter((user)=>{
    //     if(id === user.id)
    //     { 
            
    //         return user
    //     }
    // })
    

    //  return User
}

const getUsersInRoom = (room) =>{
       room =  room = room.trim().toLowerCase()
           return users.filter((user)=> room === user.room)   // keep all users in users array which have room name as room and rest will be filter out 

    // const User = users.filter((user)=>{
    //     if(room === user.room)
    //     { 
            
    //         return user
    //     }
    // })
    

    //  return User

 }
// addUser({
//     id: 22,
//     username: 'Andrew  ',
//     room: '  South Philly'
// })


// addUser({
//     id: 23,
//     username: 'russel ',
//     room: 'Philly'
// })


// addUser({
//     id: 25,
//     username: 'dhoni  ',
//     room: 'north '
// })


// const x = getUser(22)
// const y = getUsersInRoom('north')

// console.log(x)
// console.log(y)

module.exports = {
    addUser,
    getUser,
    removeUser,
    getUsersInRoom
}
// console.log(users)

// const removedUser = removeUser(22)

// console.log(removedUser)
// console.log(users)
const socket = io()  // to recieve value from server and setting up the connection with server
// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML   // accesing their inner html
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
//OPTIONS
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true }) // Qs is query string when someones join room it extracts its username and room value 
const autoscroll = () => {     //used for scrolling down automatically when msges increses
    // New message element
    const $newMessage = $messages.lastElementChild  //getting last msg   
    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)   //getting its margin 
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin  // adding margin to msg height
    // Visible height
    const visibleHeight = $messages.offsetHeight
    // Height of messages container 
    const containerHeight = $messages.scrollHeight  //total height we are able to scroll through
    // How far have I scrolled?
   const scrollOffset = $messages.scrollTop + visibleHeight
    if (containerHeight - newMessageHeight <= scrollOffset) {  // when new last  msg is added there we are at bottom 
        $messages.scrollTop = $messages.scrollHeight   //we will scroll total available content 
    }
}

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {    // mustach is used for rendering templates 
        username : message.username,
        message: message.text,  // sending text
        createdAt: moment(message.createdAt).format('h:mm a')       // sending time 
    })
    $messages.insertAdjacentHTML('beforeend', html)   // it means append the messages add new messages at the end
    autoscroll()
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        username : message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')       // h means hour ,mm means mnth , a means am/pm
    }) 
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({ room, users }) => {        // display all users in room
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})
$messageForm.addEventListener('submit', (e) => {      //submit event takes place
    e.preventDefault()       // it means prevent default refreshing
    $messageFormButton.setAttribute('disabled', 'disabled')    // disable the button
    const message = e.target.elements.message.value              //taking message value
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')  //enable it 
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if (error) {
            return console.log(error)
        }
        console.log('Message delivered!')     
    })
})
$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')   // if navigator dosent work
    }
    $sendLocationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {                      //sending location to server
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')  
        })
    })
})
socket.emit('join', { username, room }, (error) => {// join event join the room
    if (error) {
        alert(error)
        location.href = '/'
    }
})
import Login from './components/Login'
import SignUp from './components/SignUp'
import Nav from './components/Navigation'
import Pokelist from './components/PokeList'
import Pagination from './components/Pagination'
import Footer from './components/Footer'
import { StreamChat } from 'stream-chat'
import { Chat } from 'stream-chat-react'
import Cookies from 'universal-cookie'
import { useState } from 'react'
import JoinGame from './components/JoinGame'

function App() {
  const api_key = process.env.REACT_APP_KEY
  const cookies = new Cookies()
  const token = cookies.get('token')
  const client = StreamChat.getInstance(api_key)
  const [isAuth, setIsAuth] = useState(false)
  const [signed, setSigned] = useState(true)

  const logOut = () => {
    cookies.remove('token')
    cookies.remove('userId')
    cookies.remove('firstName')
    cookies.remove('lastName')
    cookies.remove('hashedPassword')
    cookies.remove('channelName')
    cookies.remove('username')
    client.disconnectUser()
    localStorage.removeItem('pokeArr')
    setIsAuth(false)
  }

  if (token) {
    client
      .connectUser(
        {
          id: cookies.get('userId'),
          name: cookies.get('username'),
          firstName: cookies.get('firstName'),
          lastName: cookies.get('lastName'),
          hashedPassword: cookies.get('hashedPassword'),
        },
        token
      )
      .then(user => {
        setIsAuth(true)
      })
  }

  return (
    <div className='App'>
      {isAuth ? (
        <>
          {/* <Nav /> */}
          <Chat client={client}>
            <JoinGame />
            <button className='log-out' onClick={logOut}>
              Log Out
            </button>
          </Chat>
          <Pokelist />
          <Pagination />
          <Footer />
        </>
      ) : (
        <>
          <Login setIsAuth={setIsAuth} />
          <SignUp setIsAuth={setIsAuth} />
          {/* {signed?(
          
          ):(

        )} */}
        </>
      )}
    </div>
  )
}

export default App

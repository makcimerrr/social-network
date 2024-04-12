import '../styles/globals.css'
import { useEffect, useState } from 'react'
import { ToastProvider } from 'react-toast-notifications';
import { getCookie } from '../services/useCookie'
import MiniDrawer from '../components/minidrawer'

function MyApp({ Component, pageProps }) {
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')

  useEffect(() => {
    // Check if the user is logged in using cookies
    const username = getCookie("session");
    if (username) {
      // If the cookie exists, set loggedIn to true
      setLoggedIn(true);
    }
  }, []); // Run once on component mount

  return (
    <ToastProvider>
      <MiniDrawer loggedIn={loggedIn} />
      <Component {...pageProps} loggedIn={loggedIn} setLoggedIn={setLoggedIn} setEmail={setEmail} />
    </ToastProvider>
  )
}

export default MyApp
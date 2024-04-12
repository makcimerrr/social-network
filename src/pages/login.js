import React, { useState } from 'react';
import { useRouter } from 'next/router'; // Import useRouter from next/router
import { useToasts } from 'react-toast-notifications';
import LoginComponent from '../components/loginForm';
import { setCookie } from '../services/cookie';
import { loginUser } from '../services/login_auth';
import LoginForm from '../components/loginForm';

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { addToast } = useToasts();
  const router = useRouter(); // Use useRouter from next/router

  const onButtonClick = async () => {
    setEmailError('');
    setPasswordError('');

    if ('' === email) {
      setEmailError('Please enter your email/username');
      return;
    }

    if ('' === password) {
      setPasswordError('Please enter a password');
      return;
    }

    if (password.length < 7) {
      setPasswordError('The password must be 8 characters or longer');
      return;
    }

    try {
      const data = {
        data: email,
        password: password
      };

      const responseData = await loginUser(data);

      if (responseData.success === true) {
        addToast('Authentication successful!', {
          appearance: 'success',
          autoDismiss: true,
        });

        props.setLoggedIn(true);
        props.setEmail(responseData.email);
        router.push('/'); // Use router.push for navigation
      } else {
        addToast('Authentication failed. Please check your credentials. Error: ' + responseData.message, {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    } catch (error) {
      console.error(error);
      addToast('Error during authentication: ' + error.message, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <LoginForm
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      emailError={emailError}
      passwordError={passwordError}
      onButtonClick={onButtonClick}
    />
    </div>
  );
};

export default Login;
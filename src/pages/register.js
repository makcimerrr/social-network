import React, { useState } from 'react';
import { useRouter } from 'next/router'; // Import useRouter from next/router
import { useToasts } from 'react-toast-notifications';
import RegisterForm from '../components/registerForm';
import { setCookie } from '../services/cookie';
import { RegisterUser } from '../services/register_auth';

const Register = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');

    const [dateOfBirth, setDateOfBirth] = useState('');
    const [avatar, setAvatar] = useState('');
    const [dateOfBirthError, setDateOfBirthError] = useState('');
    const [avatarError, setAvatarError] = useState('');

    const [nickname, setNickname] = useState('');
    const [bio, setBio] = useState('');
    const [nicknameError, setNicknameError] = useState('');
    const [bioError, setBioError] = useState('');

    const { addToast } = useToasts();
    const router = useRouter(); // Use useRouter from next/router

    const onRegisterClick = async () => {
        setEmailError('');
        setPasswordError('');

        if ('' === email) {
            setEmailError('Please enter your email');
            return;
        }

        if ('' === password) {
            setPasswordError('Please enter a password');
            return;
        }

        if ('' === firstName) {
            setFirstNameError('Please enter your first name');
            return;
        }
        if ('' === lastName) {
            setLastNameError('Please enter your last name');
            return;
        }

        if ('' === dateOfBirth) {
            setDateOfBirthError('Please enter your date of birth');
            return;
        }

        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            setEmailError('Please enter a valid email')
            return
        }

        if (password.length < 7) {
            setPasswordError('The password must be 8 characters or longer');
            return;
        }

        if (/[!@#$%^&*(),.?":{}|<>]/.test(nickname)) {
            setNicknameError('Nickname should not contain special characters.');
            return;
        }

        if (bio.length > 200) {
            setBioError('Bio should not exceed 200 characters.');
            return;
        }

        try {
            const data = {
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
                dateOfBirth: dateOfBirth,
                avatar: avatar,
                nickname: nickname,
                bio: bio
            };

            const responseData = await RegisterUser(data);

            if (responseData.success === true) {
                addToast('Authentication successful!', {
                    appearance: 'success',
                    autoDismiss: true,
                });
                props.setLoggedIn(true);
                props.setEmail(responseData.email);
                console.log(responseData.email)
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

        <RegisterForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            emailError={emailError}
            passwordError={passwordError}

            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            firstNameError={firstNameError}
            lastNameError={lastNameError}

            dateOfBirth={dateOfBirth}
            setDateOfBirth={setDateOfBirth}
            avatar={avatar}
            setAvatar={setAvatar}
            dateOfBirthError={dateOfBirthError}
            avatarError={avatarError}

            nickname={nickname}
            setNickname={setNickname}
            bio={bio}
            setBio={setBio}
            nicknameError={nicknameError}
            bioError={bioError}

            onRegisterClick={onRegisterClick}
        />

        </div>
    );
};

export default Register;

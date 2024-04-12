// registerForm.jsx
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PasswordStrengthMeter from '../services/passwordStrengh';

const RegisterForm = ({ email, setEmail, password, setPassword, emailError, passwordError, firstName, setFirstName, lastName, setLastName, firstNameError, lastNameError, dateOfBirth, setDateOfBirth, avatar, setAvatar, dateOfBirthError, avatarError, nickname, setNickname, bio, setBio, nicknameError, bioError, onRegisterClick }) => {

    return (
        <div className={'mainContainer'} style={{ marginTop: '50px' }}>
            <div className={'titleContainer'}>
                <div>Register</div>
            </div>
            <br />
            <div className={'inputContainer'}>
                <input
                    value={email}
                    placeholder="Enter your email here"
                    onChange={(ev) => setEmail(ev.target.value)}
                    className={'inputBox'}
                />
                <label className="errorLabel">{emailError}</label>
            </div>
            <br />
            <div className={'inputContainer'}>
                <input
                    value={password}
                    placeholder="Enter your password here"
                    onChange={(ev) => setPassword(ev.target.value)}
                    className={'inputBox'}
                    type="password"
                />

                <PasswordStrengthMeter password={password} />
                <label className="errorLabel">{passwordError}</label>
            </div>
            <br />
            <div className={'inputContainer'}>
                <input
                    value={firstName}
                    placeholder="Enter your first name here"
                    onChange={(ev) => setFirstName(ev.target.value)}
                    className={'inputBox'}
                />
                <label className="errorLabel">{firstNameError}</label>
            </div>
            <br />
            <div className={'inputContainer'}>
                <input
                    value={lastName}
                    placeholder="Enter your last name here"
                    onChange={(ev) => setLastName(ev.target.value)}
                    className={'inputBox'}
                />
                <label className="errorLabel">{lastNameError}</label>
            </div>
            <br />
            <div className={'inputContainer'}>
                <DatePicker
                    selected={dateOfBirth}
                    placeholderText="Select your date of birth"
                    onChange={date => setDateOfBirth(date)}
                    className={'inputBox'}
                />
                <label className="errorLabel">{dateOfBirthError}</label>
            </div>
            <br />
            <div className={'inputContainer'}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(ev) => setAvatar(ev.target.files[0])}
                    className={'inputBox'}
                />
                <label className="errorLabel">{avatarError}</label>
            </div>
            <br />
            <div className={'inputContainer'}>
                <input
                    value={nickname}
                    placeholder="Enter your nickname (optional)"
                    onChange={(ev) => setNickname(ev.target.value)}
                    className={'inputBox'}
                />
                <label className="errorLabel">{nicknameError}</label>
            </div>
            <br />
            <div className={'inputContainer'}>
                <textarea
                    value={bio}
                    placeholder="Enter your bio (optional)"
                    onChange={(ev) => setBio(ev.target.value)}
                    className={'inputBox'}
                    maxLength={200} // Example max length of 200 characters
                />
                <label className="errorLabel">{bioError}</label>
            </div>
            <br />
            <div className={'inputContainer'}>
                <input className={'inputButton'} type="button" onClick={onRegisterClick} value={'Register'} />
            </div>
        </div>
    );
};

export default RegisterForm;

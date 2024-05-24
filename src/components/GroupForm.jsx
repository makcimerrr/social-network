import React, { useState } from 'react';import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const GroupForm = ({ setForm,form,formErrors, onRegisterClick,data,setInvite,setInviteErrors,formInvite,onInviteClick }) => {
    const [inviteError, setInviteError] = useState(null); // New state variable for storing the error message

    const handleInviteClick = async () => { // Modified onInviteClick function
        const result = await onInviteClick();
        if (!result.success) {
            setInviteError(result.message);
        }
    };

    return (
        <div className={'mainContainer'}>

            <div className={'allform'}>

            <div className={'creategroupContainer'}>

                <div className={'titleContainer'}>
                    <div>Create Group</div>
                </div>
                <br/>
                <div className={'inputContainer'}>
                    <input
                        value={form.title}
                        placeholder="Title of the Group"
                        onChange={(ev) => setForm(prevForm => ({...prevForm, title: ev.target.value}))}
                        className={'inputBox'}
                    />
                    <label className="errorLabel">{formErrors.title}</label>
                </div>

                <br/>


                <br/>
                <div className={'inputContainer'}>
                <textarea
                    value={form.aboutGroup}
                    placeholder="Enter a description of the group"
                    onChange={(ev) => setForm(prevForm => ({...prevForm, aboutGroup: ev.target.value}))}
                    className={'inputBox'}
                />
                    <label className="errorLabel">{formErrors.aboutGroup}</label>
                </div>


                <br/>

                <div className={'inputContainer'}>
                    <input className={'inputButton'} type="button" onClick={onRegisterClick} value={'Create it'}/>
                </div>
            </div>


            <br/>

            <div className={'inviteinmygroup'}>

                <div className={'titleContainer'}>
                    <div>Invite In My Group</div>
                </div>

                <br/>
                <div className={'d'}>
                    <input
                        value={formInvite.nameOfGroup}
                        placeholder="Name of the Group"
                        onChange={(ev) => setInvite(prevForm => ({...prevForm, nameOfGroup: ev.target.value}))}
                        className={'inputBox'}
                    />
                    <label className="errorLabel">{formErrors.nameOfGroup}</label>

                </div>

                <br/>


                <br/>
                <div className={'inputContainer'}>
                    <input
                        value={formInvite.nameOfThePerson}
                        placeholder="Name of the person you want to invite"
                        onChange={(ev) => setInvite(prevForm => ({...prevForm, nameOfThePerson: ev.target.value}))}
                    className={'inputBox'}
                />
                    <label className="errorLabel">{formErrors.nameOfThePerson}</label>
                </div>


                <br/>

                <div className={'inputContainer'}>
                    <input className={'inputButton'} type="button" onClick={onInviteClick} value={'Invite'}/>
                </div>
            </div>
            </div>


            <div className={'group-list'}>
                <h1>Own Group</h1>
                <hr/>
                {data && data.map((group, index) => (
                    <div key={index}>
                        <h2>Title :{group.Title} </h2>
                        <h2>About Group :{group.AboutGroup} </h2>
                        <hr/>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GroupForm;
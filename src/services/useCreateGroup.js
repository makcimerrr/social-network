export const createGroup = async (form,props) => {
    try {
        console.log(form)
        console.log(props.id)

        const response = await fetch('http://localhost:8080/creategroup', {
            method: 'POST',
            body: JSON.stringify({...form,  id : props.id}),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            if (data && data.success) {
                console.log(data);
                return { success: true, data };
            } else {
                console.error('Create group failed:', data ? data.message : 'No response body');
                return { success: false, message: data ? data.message : 'No response body' };
            }
        } else {
            console.error('Create group failed:', response.statusText);
            return { success: false, message: response.statusText };
        }
    } catch (error) {
        console.error('Error during creation of group:', error);
        return { success: false, message: error.message };
    }
};

export const getGroup = async (props) => {
    try {
        const response = await fetch('http://localhost:8080/getallgroups', {
            method: 'POST',
            body: JSON.stringify(props.id),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
        });

        if (!response.ok) {
            console.error('Get group failed:', response.statusText);
            return { success: false, message: response.statusText };
        }

        const data = await response.json(); // Convertit la réponse JSON en un objet JavaScript
        return { success: true, data }; // Retourne l'objet JavaScript
    } catch (error) {
        const errorMessage = error.message ? error.message : 'An error occurred';

        console.error('Error:', errorMessage);

        return {success: false, message: errorMessage};
    }
}

export const InviteInMyGroup = async (formInvite,props) => {
    if (!formInvite.nameOfGroup || !formInvite.nameOfThePerson) {
        console.error('Error: nameOfGroup or nameOfThePerson is undefined or empty');
        return { success: false, message: 'nameOfGroup or nameOfThePerson is undefined or empty' };
    }
    try {
        const response = await fetch('http://localhost:8080/inviteinmygroup', {
            method: 'POST',
            body: JSON.stringify({...formInvite,  id : props.id}),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            if (data && data.success) {
                console.log(data);
                return { success: true, data };
            } else {
                console.error(data);
                return { success: false, message: data ? data.message : 'No response body' };
            }
        } else {
            console.error(response.statusText);
            return { success: false, message: response.statusText };
        }
    } catch (error) {
        console.log(error);
        return { success: false, message: error.message };
    }
}

import {conn, sendMsg} from "@/services/useWebsocket";

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
                console.log("envoie ws")
                //sendMsg(conn, 0, { value: "New Group" }, 'group')
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
    var ConvertID = parseInt(props.id, 10); // You want to use radix 10

    try {
        const response = await fetch('http://localhost:8080/getallgroups', {
            method: 'POST',
            body: JSON.stringify(ConvertID),
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
       // console.log(data)


        const groups = data.groups;
        const groupsWhereIamNotIn = data.groupsWhereIamNotIn;

/*

        console.log(groups)
        console.log(groupsWhereIamNotIn)
*/


        return { success: true, groups, groupsWhereIamNotIn }; // Retourne l'objet JavaScript


        // return { success: true, data }; // Retourne l'objet JavaScript
       // return { success: true, array1: data.array1, array2: data.array2 };
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
                sendMsg(conn, 0, { value: "New Group" }, 'group')
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

export const getOneGroup = async (id) => {

    let IdAfterConvert = (parseInt(id, 10));


    try {
        const response = await fetch('http://localhost:8080/getonegroup', {
            method: 'POST',
            body: JSON.stringify({idGroup:IdAfterConvert}),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (!response.ok) {
            console.error('Get group failed:', response.statusText);
            return { success: false, message: response.statusText };
        }

        const data = await response.json(); // Convertit la réponse JSON en un objet JavaScript
        return { success: true, data };
    } catch (error) {
        const errorMessage = error.message ? error.message : 'An error occurred';

        console.error('Error:', errorMessage);

        return {success: false, message: errorMessage};
    }
}

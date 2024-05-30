import React from "react";

const OneGroup = ({ SingleForm }) => {
    if (!SingleForm) {
        return <div>No data available</div>;
    }


    return (

        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <h1> Title : {SingleForm.Title}</h1>
            <hr/>
            <p> about US : {SingleForm.AboutGroup}</p>
        </div>
    );
}

export default OneGroup;
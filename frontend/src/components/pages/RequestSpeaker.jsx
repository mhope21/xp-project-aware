import React, {useEffect} from "react";

// Possible new feature: Ability to schedule a speaker to come to a user's school
function RequestSpeaker() {

    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

    return(
        <>
        <div className="black-strip"></div>
        <section className="speaker p-5"><div></div></section>
       
        </>
    )
};

export default RequestSpeaker;
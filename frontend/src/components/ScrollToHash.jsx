import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Method to allow the #(services and team) locations on the home page to come up even when clicked from another page
const ScrollToHash = () => {

    const { hash } = useLocation();

    useEffect(() => {
        console.log(
            "Scroll To Hash is being triggered."
        )
        if (hash) {

            const element = document.querySelector(hash);
            
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [hash]);

    return null;
};

export default ScrollToHash;

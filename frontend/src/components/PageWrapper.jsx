import React from 'react'
import Navigation from './Navigation';
import Footer from './Footer';

// Passed in the content for the middle of the page as children and the logged in and user state. Navbar and footer displayed on every page.
const PageWrapper = ({children, loggedIn, setLoggedIn, setUser, user }) => (

    
    <div id="page-top">
    <Navigation loggedIn={loggedIn} setLoggedIn={setLoggedIn} setUser={setUser} user={user} />
    {children}     
    <Footer/>
    </div>
  
);

export default PageWrapper;

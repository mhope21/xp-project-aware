import React from 'react'

// Header component for displaying header on page
function Header() {
  return (
    <>
        <header className="masthead">
        <div className="container pb-5">
        <div className="masthead-heading mb-5" style={{marginTop: '-75px', textShadow: '2px 3px black'}}>Project AWARE</div>   
        <div className="masthead-subheading pb-5 mb-5" style={{marginTop: '-35px', textShadow: '2px 2px gray', fontSize: '32px'}}><b>A</b>dvancing <b>W</b>ellbeing and <b>A</b>cceptance Through <b>R</b>esources and <b>E</b>ducation</div>
        
        <a className="btn btn-primary btn-xl text-uppercase" href="#services">Tell Me More</a>
    </div>
</header>
    </>
  )
}
export default Header;
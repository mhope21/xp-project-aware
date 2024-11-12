import React from "react"

function Footer() {
    // Footer component for displaying footer at the bottom of the page
    return (
        <>
        <footer className="footer py-4">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-4 text-lg-start"><p>Copyright &copy; Project AWARE 2024</p>
                    <p>1234 Helping Hand Blvd.<br/>
                    Caring, IL 67890</p>
                    </div>
                    <div className="col-lg-4 my-3 my-lg-0">
                        <a className="btn btn-dark btn-social mx-2" href="#!" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                        <a className="btn btn-dark btn-social mx-2" href="#!" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                        <a className="btn btn-dark btn-social mx-2" href="#!" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                    </div>
                    <div className="col-lg-4 text-lg-end">
                        <a className="link-dark text-decoration-none me-3" href="#!">Privacy Policy</a>
                        <a className="link-dark text-decoration-none" href="#!">Terms of Use</a>
                    </div>
                </div>
            </div>
            <div className="container mt-5">
                <div className="row">
                    <div className="col text-center">
                        <p className="mb-0">
                        Images and illustrations provided by <a href="https://www.freepik.com" target="_blank" rel="noopener noreferrer">Freepik</a>.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
        </>
    )
};
export default Footer;
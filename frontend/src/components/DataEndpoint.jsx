import React from 'react';
import { Link } from 'react-router-dom';

// Passed in the various api endpoints for the tables
const DataEndpoint = ({ adminUserUrl, kitsUrl, kitItemsUrl,  donationUrl, contactsUrl, ordersUrl, setSelectedEndpoint }) => {  


  const scrollToTable = () => {
    const tableElement = document.getElementById('table');
    if (tableElement) {
      tableElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  
  return (
    // Displays the menu links for each table, sets the api endpoint based on menu selection
    <>
    <div className="offcanvas-body p-0">
          <nav className="navbar-dark">
            <ul className="navbar-nav">
              <li className="mb-2">
                <Link to="#" className="nav-link px-3 active"
                data-bs-dismiss="offcanvas"
                onClick={() => {setSelectedEndpoint(adminUserUrl)
                  scrollToTable();
                }}>
                  <span className="me-2">
                    <i className="fas fa-user"></i>
                  </span>
                  <span>Users</span>
                </Link>
              </li>
              <li className="mb-2">
              <Link  to='/authenticated/new_forms/add_user' className="nav-link px-5">
              <span className="me-2"><i className="fas fa-user-plus"></i></span>
              <span>Add New User</span>  
              </Link>
            </li>
              <li className="mb-2">
                <Link to="#"  className="nav-link px-3" 
               data-bs-dismiss="offcanvas" onClick={() => {setSelectedEndpoint(kitsUrl)
                  scrollToTable();
                }}>
                  <span className="me-2">
                    <i className="bi bi-boxes"></i>
                  </span>
                  <span>Kits</span>
                </Link>
              </li>
              <li className="mb-2">
              <Link to='/authenticated/new_forms/add_kit' className="nav-link px-5">
                    <span className="me-2"><i className="bi bi-box"></i></span>
                    <span>Add New Kit</span>
                </Link>
            </li>
              <li className="mb-2">
                <Link to="#"  className="nav-link px-3" 
               data-bs-dismiss="offcanvas" onClick={() => {setSelectedEndpoint(kitItemsUrl)
                  scrollToTable();
                }}>
                  <span className="me-2">
                    <i className="fa-solid fa-book"></i>
                  </span>
                  <span>Kit Items</span>
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/authenticated/new_forms/add_kit_item" className="nav-link px-5">
                    <span className="me-2"><i className="fa-solid fa-book-medical"></i></span>
                    <span>Add New Kit Item</span>
                </Link>
            </li>
              <li className="mb-2">
                <Link to="/authenticated/new_forms/add_item_to_kit" className="nav-link px-5">
                    <span className="me-2"><i className="fa-solid fa-box-open"></i></span>
                    <span>Add Item to Kit</span>
                </Link>
            </li>
              <li className="mb-2">
                <Link to="#"  className="nav-link px-3" data-bs-dismiss="offcanvas" onClick={() => {setSelectedEndpoint(ordersUrl)
                  scrollToTable();
                }}>
                  <span className="me-2">
                    <i className="bi bi-clipboard-check-fill"></i>
                  </span>
                  <span>Orders</span>
                </Link>
              </li>
              <li className="mb-2">
              <Link 
                  to="#" 
                  className="nav-link px-3"
                  data-bs-dismiss="offcanvas" 
                  onClick={() => {
                    setSelectedEndpoint(donationUrl);
                    scrollToTable();
                  }}
                >
                  <span className="me-2">
                    <i className="bi bi-cash-coin"></i>
                  </span>
                  <span>Donations</span>
                </Link>
              </li>
              <li className="mb-2">
                <Link to="#"  className="nav-link px-3" 
               data-bs-dismiss="offcanvas" onClick={() => {setSelectedEndpoint(contactsUrl)
                  scrollToTable();
                }}>
                  <span className="me-2">
                    <i className="bi bi-chat-right-text-fill"></i>
                  </span>
                  <span>Contacts</span>
                </Link>
              </li>
            </ul>
          </nav>
  
      </div>
      </>
      
  );
};

export default DataEndpoint;

//import useState hook to create menu collapse state
import React, { useState, useEffect } from "react";

//import react pro sidebar components
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";

//import icons from react icons
import { FaQuestion, FaUsers } from "react-icons/fa";
import { FiHome, FiLogOut, FiArrowLeftCircle, FiArrowRightCircle, FiBook } from "react-icons/fi";
import { BiCog } from "react-icons/bi";


//import sidebar css from react-pro-sidebar module and our custom css 
import "react-pro-sidebar/dist/css/styles.css";
import "./Header.css";
import { Link } from "react-router-dom";

function logout() {
  window.localStorage.clear();
  window.location.reload();
 }

const Header = () => {
  
    //create initial menuCollapse state using useState hook
    const [menuCollapse, setMenuCollapse] = useState(true)

    //create a custom function that will change menucollapse state from false to true and true to false
  const menuIconClick = () => {
    //condition checking to change state from true to false and vice versa
    menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
  };

  useEffect(() => {
    toggleNavActiveState()
  }, [])

  function toggleNavActiveState() {

      var btns = document.getElementsByClassName("menu-item");

      // Loop through the buttons and add the active class to the current/clicked button
      for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function() {
          var current = document.getElementsByClassName("active");
          current[0].className = current[0].className.replace(" active", "");
          this.className += " active";
        });
      } 
  }

  const renderStaffMenu = () => {
    if(window.localStorage.getItem('isStaff') === 'true') {
      return (
        <Menu iconShape="square">
        <MenuItem className="menu-item" active={true} icon={<FiHome />}><Link className="menu-text" to='/'>Home</Link></MenuItem>
        <MenuItem className="menu-item" icon={<FaUsers />}><Link to="/manage/students" className="menu-text">Students</Link></MenuItem>
        <MenuItem className="menu-item" icon={<FiBook />}><Link to="/manage/modules" className="menu-text">Modules</Link></MenuItem>
        <MenuItem className="menu-item" icon={<FaQuestion />}><Link to="/manage/questions" className="menu-text">Questions</Link></MenuItem>
      </Menu>
      )
    }
    if (window.localStorage.getItem('isStaff') === 'false') {
      return (
        <Menu iconShape="square">
        <MenuItem active={true}  className="menu-item" icon={<FiHome />}>
          <Link to='/' className="menu-text">Home</Link>
        </MenuItem>
        <MenuItem className="menu-item" icon={<FaUsers />}><Link className="menu-text" to={`/student/${window.localStorage.getItem('userId')}/profile`} >Profile</Link></MenuItem>
      </Menu>
    )
    }
  }

  return (
    <>
      <div id="header">
          {/* collapsed props to change menu size using menucollapse state */}
        <ProSidebar collapsed={menuCollapse}>
          <SidebarHeader>
          <div className="logotext">
              {/* small and big change using menucollapse state */}
              <p>{menuCollapse ? "MC" : "Microcred"}</p>
            </div>
            <div className="closemenu" onClick={menuIconClick}>
                {/* changing menu collapse icon on click */}
              {menuCollapse ? (
                <FiArrowRightCircle/>
              ) : (
                <FiArrowLeftCircle/>
              )}
            </div>
          </SidebarHeader>
          <SidebarContent>
            {renderStaffMenu()}
          </SidebarContent>
          <SidebarFooter>
            <Menu iconShape="square">
              <MenuItem icon={<FiLogOut />} onClick={() => logout()}><Link className="menu-text" to="/">Logout</Link></MenuItem>
            </Menu>
          </SidebarFooter>
        </ProSidebar>
      </div>
    </>
  );
};

export default Header;
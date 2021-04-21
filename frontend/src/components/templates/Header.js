//import useState hook to create menu collapse state
import React, { useState } from "react";

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
import { FaList, FaRegHeart, FaUser, FaUsers } from "react-icons/fa";
import { FiHome, FiLogOut, FiArrowLeftCircle, FiArrowRightCircle, FiBook } from "react-icons/fi";
import { RiPencilLine } from "react-icons/ri";
import { BiCog } from "react-icons/bi";


//import sidebar css from react-pro-sidebar module and our custom css 
import "react-pro-sidebar/dist/css/styles.css";
import "./Header.css";
import { Link } from "react-router-dom";


const Header = () => {
  
    //create initial menuCollapse state using useState hook
    const [menuCollapse, setMenuCollapse] = useState(false)

    // create account type state to show appropriate content
    const [isStaff, setStaff] = useState(true)

    //create a custom function that will change menucollapse state from false to true and true to false
  const menuIconClick = () => {
    //condition checking to change state from true to false and vice versa
    menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
  };

  const renderStaffMenu = () => {
    if(isStaff) {
      return (
        <Menu iconShape="square">
        <MenuItem active={true} icon={<FiHome />}>
          Home<Link to='/'/>
        </MenuItem>
        <MenuItem icon={<FiBook />}>Courses</MenuItem>
        <MenuItem icon={<FaUsers />}>Profile</MenuItem>
        <MenuItem icon={<BiCog />}>Settings</MenuItem>
      </Menu>
      )
    }
    return (
      <Menu iconShape="square">
      <MenuItem active={true} icon={<FiHome />}>
        Home<Link to='/'/>
      </MenuItem>
      <MenuItem icon={<FiBook />}>Units</MenuItem>
      <MenuItem icon={<FaUsers />}>Profile</MenuItem>
    </Menu>
  )
  }

  return (
    <>
      <div id="header">
          {/* collapsed props to change menu size using menucollapse state */}
        <ProSidebar collapsed={menuCollapse}>
          <SidebarHeader>
          <div className="logotext">
              {/* small and big change using menucollapse state */}
              <p>{menuCollapse ? "Logo" : "Microcred"}</p>
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
              <MenuItem icon={<FiLogOut />}>Logout</MenuItem>
            </Menu>
          </SidebarFooter>
        </ProSidebar>
      </div>
    </>
  );
};

export default Header;
import React, { useEffect,useState } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { LoginMenu } from './api-authorization/LoginMenu';
import './NavMenu.css';
import axios from 'axios';
import authService from './api-authorization/AuthorizeService';


export function NavMenu() {
  const [collapsed, setCollapsed] = useState(true);
  const [rows, setRows] = useState([]);
  const [isUser, setIsUser] = useState(false);
  useEffect(() =>{
    authService.isAuthenticated().then(authCheck => {
      setIsUser(authCheck)
      if (authCheck) {
        authService.getUser().then(user => {
          authService.getAccessToken().then(token => {
            axios.get(`customidentityrole/all/${user.name}/1`,
              {
                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
              }
            ).then((response) => {
              let roles = response.data
              let _rows=[]
              if (roles.includes('Admin')) {
                 _rows = [
                  <NavItem key={1}>
                    <NavLink tag={Link} id='nav-item' className="text-light nav-item" to="/students-index-view" >Students</NavLink>
                  </NavItem>,
                  <NavItem key={2}>
                    <NavLink tag={Link} id='nav-item' className="text-light" to="/professors-index-view">Professors</NavLink>
                  </NavItem>,
                  <NavItem key={3}>
                    <NavLink tag={Link} id='nav-item' className="text-light" to="/clubs-index-view">Clubs</NavLink>
                  </NavItem>,
                  <NavItem key={4}>
                  <NavLink tag={Link} id='nav-item' className="text-light" to="/college-events-index-view">Events</NavLink>
                </NavItem>
                ]
              }
              else if (roles.includes('President')) {
                _rows = [
                  <NavItem key={1}>
                    <NavLink tag={Link} id='nav-item' className="text-light" to="/clubs-president-view">Clubs Activity</NavLink>
                  </NavItem>,
                   <NavItem key={2}>
                   <NavLink tag={Link} id='nav-item' className="text-light" to="/college-events-president-view">Events Activity</NavLink>
                 </NavItem>
                ]
              }
              else if (roles.includes('Student')) {
                _rows = [
                  <NavItem key={1}>
                    <NavLink tag={Link} id='nav-item' className="text-light" to="/events-page" >Events</NavLink>
                  </NavItem>,
                  <NavItem key={2}>
                    <NavLink tag={Link} id='nav-item' className="text-light" to="/clubs-page">Clubs</NavLink>
                  </NavItem>
                ]
              }
              else {
                 _rows = [
                  <NavItem key={1}>
                  <NavLink tag={Link} id='nav-item' className="text-light" to="/events-page" >Events</NavLink>
                </NavItem>,
                <NavItem key={2}>
                  <NavLink tag={Link} id='nav-item' className="text-light" to="/clubs-page">Clubs</NavLink>
                </NavItem>
                ]
              }
            
            setRows(_rows)
            })

          })
        })
      }
      else {
        let _rows = [
          <NavItem key={1}>
          <NavLink tag={Link} id='nav-item' className="text-light" to="/events-page" >Events</NavLink>
        </NavItem>,
        <NavItem key={2}>
          <NavLink tag={Link} id='nav-item' className="text-light" to="/clubs-page">Clubs</NavLink>
        </NavItem>
        ]
        setRows(_rows)
      }
    })
  },[])
  return (
    <header>
      <Navbar className="navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow mb-3" container="fluid" color='dark' fixed='top' dark  >
            <NavbarToggler onClick={()=>setCollapsed(!collapsed)} className="mr-2" /> 
        <NavbarBrand tag={Link} to="/">Capstone Event Management</NavbarBrand>
        {!collapsed&&isUser?
        <LoginMenu>
        </LoginMenu>:""}
        <Collapse className="d-sm-inline-flex flex-sm-column-reverse" isOpen={!collapsed} navbar>
          <ul className="navbar-nav flex-grow" id='nav-list'>
            {rows}
            {!isUser?
        <LoginMenu>
        </LoginMenu>:""}
          </ul>
        </Collapse>
          {collapsed&&isUser?
        <LoginMenu>
        </LoginMenu>:""}
      </Navbar>
    </header>
  );
}
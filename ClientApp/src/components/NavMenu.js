import React, { Component,useEffect,useState } from 'react';
import { Button, ButtonDropdown, Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { LoginMenu } from './api-authorization/LoginMenu';
import './NavMenu.css';
import axios from 'axios';
import authService from './api-authorization/AuthorizeService';

 class NavMen extends Component {
  static displayName = NavMenu.name;

  constructor(props) {
    super(props);
    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.getListRows = this.getListRows.bind(this);
    this.state = {
      collapsed: true,
      rows: []
    };
  }

  toggleNavbar() {
    let _state = this.state
    _state.collapsed = !_state.collapsed
    this.setState(_state);
  }

  componentDidMount() {
    console.log('componentDidMount')
    this.toggleNavbar()
    // this.getListRows()
  }
  componentDidUpdate(prevProps, prevState) {
    console.log('componentDidUpdate')
    console.log(this.state)

  }
  
  render() {
    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow mb-3" container="fluid" color='dark' fixed='top' dark  >
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <NavbarBrand tag={Link} to="/">Capstone Event Management</NavbarBrand>
          <Collapse className="d-sm-inline-flex flex-sm-column-reverse" isOpen={!this.state.collapsed} navbar>
            <ul className="navbar-nav flex-grow" id='nav-list'>
              {this.state.rows}
              <NavItem>
                    <NavLink tag={Link} id='nav-item' className="text-light" to="/students-index-view" >Students</NavLink>
                  </NavItem>,
                  <NavItem>
                    <NavLink tag={Link} id='nav-item' className="text-light" to="/professors-index-view">Professors</NavLink>
                  </NavItem>,
                  <NavItem>
                    <NavLink tag={Link} id='nav-item' className="text-light" to="/clubs-index-view">Clubs</NavLink>
                  </NavItem>
            </ul>
          </Collapse>
          <LoginMenu>
          </LoginMenu>
        </Navbar>
      </header>
    );
  }
}

export function NavMenu() {
  const [collapsed, setCollapsed] = useState(true);
  const [rows, setRows] = useState([]);
  useEffect(() =>{
    authService.isAuthenticated().then(authCheck => {
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
                  <NavItem>
                    <NavLink tag={Link} id='nav-item' className="text-light" to="/students-index-view" >Students</NavLink>
                  </NavItem>,
                  <NavItem>
                    <NavLink tag={Link} id='nav-item' className="text-light" to="/professors-index-view">Professors</NavLink>
                  </NavItem>,
                  <NavItem>
                    <NavLink tag={Link} id='nav-item' className="text-light" to="/clubs-index-view">Clubs</NavLink>
                  </NavItem>,
                  <NavItem>
                  <NavLink tag={Link} id='nav-item' className="text-light" to="/college-events-index-view">Events</NavLink>
                </NavItem>
                ]
              }
              else if (roles.includes('President') || roles.includes('Professor')) {
                _rows = [
                  <NavItem>
                    <NavLink tag={Link} id='nav-item' className="text-light" to="/clubs-president-view">Clubs</NavLink>
                  </NavItem>
                ]
              }
              else if (roles.includes('Students')) {
                _rows = [
                  <NavItem>
                    <NavLink tag={Link} id='nav-item' className="text-light" to="/professors-index-view" >Professors</NavLink>
                  </NavItem>,
                  <NavItem>
                    <NavLink tag={Link} id='nav-item' className="text-light" to="/clubs-index-view">Clubs</NavLink>
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
        <Collapse className="d-sm-inline-flex flex-sm-column-reverse" isOpen={!collapsed} navbar>
          <ul className="navbar-nav flex-grow" id='nav-list'>
            {rows}
          </ul>
        </Collapse>
        <LoginMenu>
        </LoginMenu>
      </Navbar>
    </header>
  );
}
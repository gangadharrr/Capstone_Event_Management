import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { LoginMenu } from './api-authorization/LoginMenu';
import './NavMenu.css';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow mb-3" container="fluid" color='dark' fixed='top' dark  >
          <NavbarBrand tag={Link} to="/">Capstone Event Management</NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
            <ul className="navbar-nav flex-grow" id='nav-list'>
              <NavItem>
                <NavLink tag={Link} className="text-light" to="/students-index-view">Students</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} className="text-light" to="/professors-index-view">Professors</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} className="text-light" to="/clubs-index-view">Clubs</NavLink>
              </NavItem>
              <LoginMenu>
              </LoginMenu>
            </ul>
          </Collapse>
        </Navbar>
      </header>
    );
  }
}

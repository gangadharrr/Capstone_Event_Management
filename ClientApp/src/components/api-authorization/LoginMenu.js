import React, { Component, Fragment, useState } from 'react';
import { DropdownItem, DropdownMenu, NavbarToggler, Navbar, Collapse, NavItem, NavLink, DropdownToggle, Dropdown } from 'reactstrap';
import { Link } from 'react-router-dom';

import authService from './AuthorizeService';
import { ApplicationPaths } from './ApiAuthorizationConstants';
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react"

export class LoginMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      userName: null,
      dropdownOpen: false
    };
  }

  componentDidMount() {
    this._subscription = authService.subscribe(() => this.populateState());
    this.populateState();
  }

  componentWillUnmount() {
    authService.unsubscribe(this._subscription);
  }

  async populateState() {
    const [isAuthenticated, user] = await Promise.all([authService.isAuthenticated(), authService.getUser()])
    this.setState({
      isAuthenticated,
      userName: user && user.name
    });
  }

  render() {
    const { isAuthenticated, userName } = this.state;
    if (!isAuthenticated) {
      const registerPath = `${ApplicationPaths.Register}`;
      const loginPath = `${ApplicationPaths.Login}`;
      return this.anonymousView(registerPath, loginPath);
    } else {
      const profilePath = `${ApplicationPaths.Profile}`;
      const logoutPath = `${ApplicationPaths.LogOut}`;
      const logoutState = { local: true };
      return this.authenticatedView(userName, profilePath, logoutPath, logoutState);
    }
  }

  toggle = () => { this.setState({ dropdownOpen: !this.state.dropdownOpen }) }
  authenticatedView(userName, profilePath, logoutPath, logoutState) {
    const cld = new Cloudinary({ cloud: { cloudName: 'dujyzevpx' } });
    const myImg = cld.image(`Images/${userName}`);


    return (<Fragment>
      <Dropdown isOpen={this.state.dropdownOpen} toggle={() => { this.toggle() }} direction="down" menuRole="listbox" >
        <DropdownToggle color='dark'><AdvancedImage cldImg={myImg} style={{ height: "39px", width: "39px", borderRadius: "50%" }} onError={e => e.target.src = "https://res.cloudinary.com/dujyzevpx/image/upload/v1687345453/Images/Account_Logo_jton6z.png"} id="profile-picture-nav" /> </DropdownToggle>
        <DropdownMenu dark>
          <DropdownItem ><NavLink replace tag={Link} className="text-light" to={profilePath} style={{ color: "white" }}>{userName}</NavLink></DropdownItem>
          <DropdownItem > <NavLink replace tag={Link} className="text-light" to={logoutPath} state={logoutState}>Logout</NavLink></DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {/* <NavItem>
        <NavLink tag={Link} className="text-dark" to={profilePath} style={{display:"flex",flexDirection:"row"}}> <AdvancedImage cldImg={myImg} style={{height:"39px",width:"39px",borderRadius:"50%"}} onError={e => e.target.src = "https://res.cloudinary.com/dujyzevpx/image/upload/v1687345453/Images/Account_Logo_jton6z.png"} id="profile-picture-nav"  /> {userName.split("@")[0]}</NavLink>
      </NavItem>
      <NavItem>
        <NavLink replace tag={Link} className="text-dark" to={logoutPath} state={logoutState}>Logout</NavLink>
      </NavItem> */}
    </Fragment>);
  }

  anonymousView(registerPath, loginPath) {
    return (  <ul className="navbar-nav flex-grow" style={{ display: "flex", columnGap: "10%",marginRight: "5%" }}>
      <NavItem>
        <NavLink tag={Link} id='nav-item'  className="text-light" to={registerPath}>Register</NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={Link} id='nav-item'  className="text-light" to={loginPath}>Login</NavLink>
      </NavItem>
  </ul>);
  }
}

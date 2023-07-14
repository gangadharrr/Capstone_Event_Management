import React, { Component, Fragment } from 'react';
import { DropdownItem, DropdownMenu,NavItem, NavLink, DropdownToggle, Dropdown } from 'reactstrap';
import { Link } from 'react-router-dom';

import authService from './AuthorizeService';
import { ApplicationPaths } from './ApiAuthorizationConstants';
import axios from 'axios';
import { Logout } from './Logout';

export class LoginMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      userName: null,
      dropdownOpen: false,
      userDetails: null
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
      authService.getAccessToken().then(token => {
        axios.get(`customidentityrole/${userName}/1`, {
          headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        }).then((response) => {
          this.setState({
            isAuthenticated:this.state.isAuthenticated,
            userName:this.state.userName,
            dropdownOpen:this.state.dropdownOpen,
            userDetails:response.data
          })
        }).catch((error) => {
        if(error.response.status===401){
          var logoutObj=new Logout(logoutState)
          logoutObj.logout(); 
        }
      })
      })


    return (<Fragment>
      <Dropdown isOpen={this.state.dropdownOpen} toggle={() => { this.toggle() }} direction="down" menuRole="listbox" >
        <DropdownToggle color='dark'><img alt='...' src={this.state.userDetails?this.state.userDetails.profileUrl:"https://res.cloudinary.com/dujyzevpx/image/upload/v1687345453/Images/Account_Logo_jton6z.png"} style={{ height: "39px", width: "39px", borderRadius: "50%" }}  id="profile-picture-nav" /> </DropdownToggle>
        <DropdownMenu dark>
          <DropdownItem ><NavLink replace tag={Link} className="text-light" to={profilePath} style={{ color: "white" }}>{userName}</NavLink></DropdownItem>
          <DropdownItem > <NavLink replace tag={Link} className="text-light" to={logoutPath} state={logoutState}>Logout</NavLink></DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </Fragment>);
  }

  anonymousView(registerPath, loginPath) {
    return (  
  <React.Fragment >

      <NavItem>
        <NavLink tag={Link} id='nav-item' className="text-light" to={registerPath}>Register</NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={Link} id='nav-item'  className="text-light" to={loginPath}>Login</NavLink>
      </NavItem>
  </React.Fragment>
  );
  }
}

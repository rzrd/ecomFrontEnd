import React from 'react';
import {
  Collapse, Navbar, NavbarToggler,
  NavbarBrand, Nav, NavItem,
  NavLink, UncontrolledDropdown, DropdownToggle,
  DropdownMenu, DropdownItem} from 'reactstrap';
import { Link, withRouter } from "react-router-dom";


export default withRouter (class Header extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
    }
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  logout(){
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  render() {
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">Home</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href={localStorage.getItem('isLoggedIn') ? `/user/${localStorage.getItem('user')}`:'/login'}>Login</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href={localStorage.getItem('isLoggedIn') ? `/user/${localStorage.getItem('user')}`:'/signUp'}>Sign Up</NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Account
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>
                    <Link to={localStorage.getItem('isLoggedIn') ? `/user/${localStorage.getItem('user')}` : '/login'}>Account Detail</Link>
                  </DropdownItem>
                  <DropdownItem>
                    <Link to='/product'>Product List</Link>
                  </DropdownItem>
                  <DropdownItem>
                    <Link to='/alluser'>User List</Link>
                  </DropdownItem>

                  <DropdownItem divider />
                  <DropdownItem>
                  <Link to='/' onClick={this.logout}>LogOut</Link>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
})
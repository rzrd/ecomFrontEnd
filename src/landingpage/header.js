import React from 'react';
import {
  Collapse, Navbar, NavbarToggler,
  NavbarBrand, Nav, NavItem,
  NavLink, UncontrolledDropdown, DropdownToggle,
  DropdownMenu, DropdownItem
} from 'reactstrap';
import { Link, withRouter } from "react-router-dom";


export default withRouter(class Header extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      user: ''
    }
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  componentDidMount() {
    fetch(`https://ketemubackend.herokuapp.com/user/${localStorage.getItem('user')}`)
      .then(response => response.json())
      .then(data => {
        this.setState((state) => ({
          user: data.data.username
        }))
      })
  }

  logout() {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  render() {
    var tombol
    if (localStorage.getItem('isLoggedIn')) {
      tombol =
        <NavItem>welcome, </NavItem>
    } else {
      tombol =
          <NavItem>
            <NavLink href={localStorage.getItem('isLoggedIn') ? `/user/${localStorage.getItem('user')}` : '/login'}>Login</NavLink>
          </NavItem>
    }

    var tombol2
    if (localStorage.getItem('isLoggedIn')) {
      tombol2 =
        <NavItem>{this.state.user}</NavItem>
    } else {
      tombol2 =
          <NavItem>
            <NavLink href={localStorage.getItem('isLoggedIn') ? `/user/${localStorage.getItem('user')}` : '/signUp'}>Sign Up</NavLink>
          </NavItem>
    }

    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">Home</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {tombol}
              {tombol2}
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
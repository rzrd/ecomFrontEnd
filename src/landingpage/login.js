import React from 'react';
import { Button, Form, FormGroup, Label, Input, FormFeedback, FormText } from 'reactstrap';
import { Link, Redirect } from "react-router-dom";


export default class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      userId: '',
      redirect: false
    }
    this.onChangeUsername = this.onChangeUsername.bind(this)
    this.onChangePassword = this.onChangePassword.bind(this)
    this.UserLogin = this.UserLogin.bind(this)
  }
  onChangeUsername(event) {
    this.setState({
      username: event.target.value
    })
  }
  onChangePassword(event) {
    this.setState({
      password: event.target.value
    })
  }
  
  UserLogin() {
    fetch('https://rozibackend.herokuapp.com/user/login',
      {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password
        }),
      })
      .then(response => response.json())
      .then(data => {
        localStorage.setItem('isLoggedIn', true)
        localStorage.setItem('token', data.data.token)
        localStorage.setItem('user', data.data.userId)
        this.props.history.push('/')
      })
  }

  render() {
    if (this.state.redirect) {
      return (
        <Redirect to='/'></Redirect>
      )
    }
      return (
        <Form style={{ width: '30vw', margin: 'auto' }}>
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Label for="username" className="mr-sm-2">Username</Label>
            <Input type="text" onChange={this.onChangeUsername} name="username" id="username" placeholder="Your Username Please!" invalid />
            <FormFeedback>Oh noes! username is not registered</FormFeedback>
          </FormGroup>
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Label for="password" className="mr-sm-2">Password</Label>
            <Input type="password" onChange={this.onChangePassword} name="password" id="password" placeholder="Passwordnya?" invalid />
            <FormFeedback>Oh noes! password is wrong</FormFeedback>
          </FormGroup>
          <Link to='/'><Button onClick={this.UserLogin}>Log In</Button></Link>
          <FormText>Belum punya akun? daftar disini..</FormText>
          <Link to='/signup'><Button>Sign Up</Button></Link>
        </Form>
      );
    }
  }
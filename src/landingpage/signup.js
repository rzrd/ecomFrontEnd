import React from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Link, Redirect } from "react-router-dom";


export default class SignUp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      email: '',
      image: '',
      redirect: false
    }
    this.onChangeUsername = this.onChangeUsername.bind(this)
    this.onChangePassword = this.onChangePassword.bind(this)
    this.onChangeEmail = this.onChangeEmail.bind(this)
    this.AddNewUser = this.AddNewUser.bind(this)
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
  onChangeEmail(event) {
    this.setState({
      email: event.target.value
    })
  }
  AddNewUser() {
    fetch('https://ketemubackend.herokuapp.com/user/',
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
          password: this.state.password,
          email: this.state.email
        }),
      })
      .then(response => response.json())
      .then(() => {
        this.setState({
          redirect: true
        })
      })
  }

  render() {
    if (this.state.redirect) {
      return (
        <Redirect to='/user'></Redirect>
      )
    }
    return (
      <Form style={{ width: '40vw', margin: 'auto' }}>
        <FormGroup>
          <Label>Username</Label>
          <Input type="text" onChange={this.onChangeUsername} placeholder="usernamenya apa" />
        </FormGroup>
        <FormGroup>
          <Label>Email</Label>
          <Input type="email" onChange={this.onChangeEmail} placeholder="emailnya" />
        </FormGroup>
        <FormGroup>
          <Label>Password</Label>
          <Input type="password" onChange={this.onChangePassword}  placeholder="jangan disebar passnya" />
        </FormGroup>
        <FormGroup>
          <Label>Photo Profile</Label>
          <Input type="file" />
          <FormText color="muted">
            untuk photo profile belum dibuat logic dan uploadernya !!!
          </FormText>
        </FormGroup>
        <Link to='/user'><Button onClick={this.AddNewUser}>Sign Up</Button></Link>
        <FormText>Sudah punya akun? masuk disini..</FormText>
        <Link to='/login'><Button>Log In</Button></Link>
      </Form>
    );
  }
}
import React, { createRef } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Link, Redirect } from "react-router-dom";
import Dropzone from 'react-dropzone'
import axios from 'axios'

var dropzoneRef = createRef()


export default class SignUp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      email: '',
      image: '',
      src: 'https://image.flaticon.com/icons/png/512/3/3901.png',
      redirect: false
    }
    this.onChangeUsername = this.onChangeUsername.bind(this)
    this.onChangePassword = this.onChangePassword.bind(this)
    this.onChangeEmail = this.onChangeEmail.bind(this)
    this.AddNewUser = this.AddNewUser.bind(this)
    this.handleUploadImages = this.handleUploadImages.bind(this)
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
    fetch('https://rozibackend.herokuapp.com/user/',
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
          email: this.state.email,
          image: this.state.image
        }),
      })
      .then(response => response.json())
      .then(() => {
        this.setState({
          redirect: true
        })
      })
  }

  // This function does the uploading to cloudinary
  handleUploadImages = images => {
    // uploads is an array that would hold all the post methods for each image to be uploaded, then we'd use axios.all()
    const uploads = images.map(image => {
      // our formdata
      const formData = new FormData();
      formData.append("file", image);
      formData.append("tags", 'userImage'); // Add tags for the images - {Array}
      formData.append("upload_preset", "ardwork"); // Replace the preset name with your own
      formData.append("api_key", "851178384963432"); // Replace API key with your own Cloudinary API key
      formData.append("timestamp", (Date.now() / 1000) | 0);
      // Replace cloudinary upload URL with yours
      return axios.post(
        "https://api.cloudinary.com/v1_1/ardworkpict/image/upload",
        formData,
        { headers: { "X-Requested-With": "XMLHttpRequest" } })
        .then(gambar => {
          this.setState({
            image: gambar.data.secure_url,
            src: gambar.data.secure_url
          })
        })
    });
    // We would use axios `.all()` method to perform concurrent image upload to cloudinary.
    axios.all(uploads).then(gambar => {
      // ... do anything after successful upload. You can setState() or save the data
      console.log('Images have all being uploaded')     
    });
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
          <Dropzone ref={dropzoneRef} onDrop={this.handleUploadImages}>
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <img style={{ width: 100 }} src={this.state.src} alt="" srcSet="" />
                    </div>
                  )}
                </Dropzone>
        </FormGroup>
        <Link to='/login'><Button onClick={this.AddNewUser}>Sign Up</Button></Link>
        <FormText>Sudah punya akun? masuk disini..</FormText>
        <Link to='/login'><Button>Log In</Button></Link>
      </Form>
    );
  }
}
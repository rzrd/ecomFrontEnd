import React, { createRef } from 'react';
import {
  TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardColumns,
  CardTitle, CardBody, CardImg, CardSubtitle, Row, Col, Form, FormGroup, Label, Input
} from 'reactstrap';
import { Link } from "react-router-dom";
import classnames from 'classnames';
import Dropzone from 'react-dropzone'
import axios from 'axios'

var dropzoneRef = createRef()

export default class ShowUser extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1',
      user: {},
      userProduct: [],
      productName: '',
      productPrice: '',
      productImage: '',
      src: "https://image.flaticon.com/icons/png/512/3/3901.png",
      redirect: false
    };
    this.onChangeProductName = this.onChangeProductName.bind(this)
    this.onChangeProductPrice = this.onChangeProductPrice.bind(this)
    this.AddNewProduct = this.AddNewProduct.bind(this)
    this.handleUploadImages = this.handleUploadImages.bind(this)
  }

  onChangeProductName(event) {
    this.setState({
      productName: event.target.value
    })
  }
  onChangeProductPrice(event) {
    this.setState({
      productPrice: event.target.value
    })
  }

  AddNewProduct() {
    fetch('https://rozibackend.herokuapp.com/product/',
      {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json',
          'token': `${localStorage.getItem('token')}`
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify({
          name: this.state.productName,
          price: this.state.productPrice,
          image: this.state.productImage
        }),
      })
      .then(response => response.json())
      .then(() => {
        this.setState({
          redirect: true
        })
      })
      .then(() => {
        window.location.reload()
      })
  }

  componentDidMount() {
    fetch(`https://rozibackend.herokuapp.com/user/${this.props.match.params.id}`)
      .then(response => response.json())
      .then(data => {
        this.setState((state) => ({
          user: data.data,
          userProduct: [...state.userProduct, ...data.data.products]
        }))
      })
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }


  // This function does the uploading to cloudinary
  handleUploadImages = images => {
    // uploads is an array that would hold all the post methods for each image to be uploaded, then we'd use axios.all()
    const uploads = images.map(image => {
      // our formdata
      const formData = new FormData();
      formData.append("file", image);
      formData.append("tags", 'productImage'); // Add tags for the images - {Array}
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
            productImage: gambar.data.secure_url,
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
    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}
            >
              Account detail
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              My Product
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '3' })}
              onClick={() => { this.toggle('3'); }}
            >
              My Review
            </NavLink>
          </NavItem>
        </Nav>


        <TabContent activeTab={this.state.activeTab} style={{ width: '1000px', margin: 'auto', padding: '10px' }}>
          <TabPane tabId="1">
            <Row>
              <Col sm="4">
                <Card body>
                  <CardImg top width="100%" src={this.state.user.image ? this.state.user.image : `https://pbs.twimg.com/profile_images/1164752786992484354/PyFcqmzG_400x400.jpg`} alt={this.state.user.username} />
                  <CardBody>
                    <h4><CardTitle>{this.state.user.username}</CardTitle></h4>
                    <CardSubtitle>{this.state.user.email}</CardSubtitle>
                    <Link to={`/userEdit/${this.state.user._id}`}><Button color="info">Edit User</Button></Link>
                    <Link to={`/userDelete/${this.state.user._id}`}><Button style={{ float: 'right' }} color="danger">Delete User</Button></Link>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </TabPane>


          <TabPane tabId="2">
            <Form style={{ width: '40vw', margin: 'auto' }}>
              <FormGroup>
                <Label>Product Name</Label>
                <Input type="text" onChange={this.onChangeProductName} placeholder="nama product mu" />
              </FormGroup>
              <FormGroup>
                <Label>Price</Label>
                <Input type="number" onChange={this.onChangeProductPrice} placeholder="berapa harganya" />
              </FormGroup>
              <FormGroup>
                <Label>Product Image</Label>
                <Dropzone ref={dropzoneRef} onDrop={this.handleUploadImages}>
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <img style={{ width: 100 }} src={this.state.src} alt="" srcSet="" />
                    </div>
                  )}
                </Dropzone>
              </FormGroup>
              <Button onClick={this.AddNewProduct}>Add Product</Button>
            </Form>


            <h2 style={{ textAlign: 'center' }}>{this.state.user.username}'s Product</h2>
            <CardColumns style={{ width: '1000px', margin: 'auto' }}>
              {this.state.userProduct.map(showProducts => {
                return (
                  <Card body key={showProducts._id}>
                    <Link to={`/product/${showProducts._id}`}>
                      <CardImg top width="100%" src={showProducts.image ? showProducts.image : `https://ui-avatars.com/api/?name=${showProducts.name}`} alt={showProducts.name} />
                      <CardBody>
                        <h4><CardTitle>{showProducts.name}</CardTitle></h4>
                        <CardSubtitle>{showProducts.price}</CardSubtitle>
                      </CardBody>
                    </Link>
                  </Card>
                )
              })}
            </CardColumns>
          </TabPane>

          <TabPane tabId="3">
            <Row>
              <Col sm="12">
                <h4>My review list</h4>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </div>
    );
  }
}
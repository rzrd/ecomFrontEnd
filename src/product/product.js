import React from 'react';
import {
  Card, Button, CardTitle, CardBody, CardImg, CardSubtitle,
  Form, FormGroup, Label, Input, Media, Alert
} from 'reactstrap';
import { Link, withRouter } from "react-router-dom";


export default withRouter(class ShowProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {},
      productReview: [],
      redirect: false,
      authorId: '',
      message: '',
      success: '',
      textReview: '',
      id: this.props.match.params.id
    };
    this.deleteProduct = this.deleteProduct.bind(this)
    this.onChangeReview = this.onChangeReview.bind(this)
    this.addNewReview = this.addNewReview.bind(this)
  }

  componentDidMount() {
    fetch(`https://ketemubackend.herokuapp.com/product/${this.props.match.params.id}`)
      .then(response => response.json())
      .then(data => {
        if (data.data.reviews !== undefined) {
          this.setState((state) => ({
            product: data.data,
            productReview: [...state.productReview, ...data.data.reviews],
            authorId: data.data.author._id,
            redirect: true,
            message: data.message,
            success: data.success
          }))
        } else {
          this.setState((state) => ({
            redirect: true,
            message: data.message,
            success: data.success
          }))
        }
      })
  }

  deleteProduct() {
    fetch(`https://ketemubackend.herokuapp.com/product/${this.props.match.params.id}`,
      {
        method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json',
          'token': `${localStorage.getItem('token')}`
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer' // no-referrer, *client
      })
      .then(() => {
        window.location.reload()
      })
  }

  addNewReview() {
    fetch(`https://ketemubackend.herokuapp.com/review?productId=${this.state.id}`,
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
          text: this.state.textReview
        }),
      })
      .then(response => response.json())
      .then(() => {
        window.location.reload()
      })
  }

  onChangeReview = (event) => {
    this.setState({
      textReview: event.target.value
    })
  }

  render() {
    var hideButton
    if (String(this.state.authorId) === localStorage.getItem('user')) {
      hideButton =
        <div >
          <Link to={`/productEdit/${this.state.product._id}`}><Button color="info">Edit Product</Button></Link>
          <Button style={{ float: 'right' }} onClick={this.deleteProduct} color="danger">Delete Product</Button>
        </div>
    } else {
      hideButton =
        <div>ini bukan produkmu</div>
    }

    var showMessage
    if (this.state.success) {
      showMessage =
        <div style={{ width: '50vh', margin: 'auto', padding: '10px' }}>
          <Card body>
            <CardImg top width="100%" src={this.state.product.image ? this.state.product.image : `https://ui-avatars.com/api/?name=${this.state.product.name}`} alt={this.state.product.name} />
            <CardBody>
              <h4><CardTitle>{this.state.product.name}</CardTitle></h4>
              <CardSubtitle>{this.state.product.price}</CardSubtitle>
            </CardBody>
          </Card>
          {hideButton}
        </div>
    } else {
      showMessage =
        <div>{this.state.message} atau sudah terhapus</div>
    }

    var showReviewMssg
    if (localStorage.getItem('isLoggedIn') && this.state.success === true) {
      showReviewMssg =
        <Form style={{ width: '50vh', margin: 'auto', padding: '10px' }}>
          <FormGroup>
            <Label>Berikan Review Mu...</Label>
            <Input type="textarea" onChange={this.onChangeReview} name="text" placeholder='isi reviewmu disini, min 10 char' />
          </FormGroup>
          <Button onClick={this.addNewReview}>Submit Review</Button>
        </Form>
    } else {
      if (this.state.success === false) {
        showReviewMssg =
          <div style={{ width: '50vh', margin: 'auto', padding: '10px' }}>id product tak ditemukan, produk telah terhapus</div>
      } else {
        showReviewMssg =
          <div style={{ width: '50vh', margin: 'auto', padding: '10px' }}>sign up dan atau login untuk membuat review</div>
      }
    }

    return (
      <div>
        {showMessage}
        <div>
          {showReviewMssg}
        </div>
        <div>
          {this.state.productReview.map(productRev => {
            return (
              <Alert color="dark" style={{ width: '100vh', margin: 'auto' }} key={productRev._id}>
                <Media left middle href={`/user/${productRev.author._id}`}>
                  <Media object src={productRev.author.image ? productRev.author.image : 'https://pbs.twimg.com/profile_images/1164752786992484354/PyFcqmzG_400x400.jpg'} style={{ width: '50pt' }} alt="foto user" />
                </Media>
                <Media body>
                  <Media heading>
                    {productRev.author.username}
                  </Media>
                  {productRev.text}
                </Media>
                <Link to={`/reviewDetail/${productRev._id}`}><Button>See Review</Button></Link>
              </Alert>
            )
          })}
        </div>
      </div>
    );
  }
}
)
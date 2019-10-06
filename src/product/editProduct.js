import React, { createRef } from 'react';
import {
    Button, Form, FormGroup, Label, Input
} from 'reactstrap';
import { Link } from "react-router-dom";
import Dropzone from 'react-dropzone'
import axios from 'axios'

var dropzoneRef = createRef()

export default class EditProduct extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            product: {},
            productName: '',
            productPrice: '',
            productImage: '',
            src: ''
        }
        this.editProduct = this.editProduct.bind(this)
        this.onChangeProductName = this.onChangeProductName.bind(this)
        this.onChangeProductPrice = this.onChangeProductPrice.bind(this)
        this.handleUploadImages = this.handleUploadImages.bind(this)
    }

    editProduct() {
        fetch(`https://rozibackend.herokuapp.com/product/${this.props.match.params.id}`,
            {
                method: 'PUT', // *GET, POST, PUT, DELETE, etc.
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
                window.location.reload()
            })
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

    componentDidMount() {
        fetch(`https://rozibackend.herokuapp.com/product/${this.props.match.params.id}`)
            .then(response => response.json())
            .then(dataP => {
                this.setState(() => ({
                    product: dataP.data,
                    productImage: dataP.data.image,
                    src: dataP.data.image,
                    productName: dataP.data.name,
                    productPrice: dataP.data.price
        
                }))
            })
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
            <Form style={{ width: '40vw', margin: 'auto' }}>
                <FormGroup>
                    <Label>Product Name</Label>
                    <Input type="text" onChange={this.onChangeProductName} value={this.state.productName} placeholder="nama product mu" />
                </FormGroup>
                <FormGroup>
                    <Label>Price</Label>
                    <Input type="number" onChange={this.onChangeProductPrice} value={this.state.productPrice} placeholder="berapa harganya" />
                </FormGroup>
                <FormGroup>
                    <Label>Product Image</Label>
                    <Dropzone ref={dropzoneRef} onDrop={this.handleUploadImages}>
                        {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <img style={{ width: 200 }} src={this.state.src} alt="" srcSet="" />
                            </div>
                        )}
                    </Dropzone>
                </FormGroup>
                <Link to={`/product/${this.state.product._id}`}><Button onClick={this.editProduct}>Edit Product</Button></Link>
            </Form>
        )
    }
}
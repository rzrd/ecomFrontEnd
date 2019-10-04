import React from 'react';
import {
    Card, CardImg, CardTitle, CardColumns,
    CardSubtitle, CardBody
} from 'reactstrap';
import { Link } from "react-router-dom";


export default class LandingPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            products: []
        }
    }

    componentDidMount() {
        fetch('https://ketemubackend.herokuapp.com/product')
            .then(response => response.json())
            .then(data => {
                this.setState(state => ({
                    products: [...state.products, ...data.data]
                }))
            })
    }

    render() {
    return (
        <div>
            <h2 style={{ textAlign: 'center' }}>All Product</h2>
            <CardColumns style={{ width: '1000px', margin: 'auto' }}>
                    {this.state.products.map(showProducts =>{
                        return(
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
        </div>
    );
    }
};
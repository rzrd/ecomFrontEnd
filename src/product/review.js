import React from 'react';
import {
    Button, Media, Alert
} from 'reactstrap';
import { Link, withRouter } from "react-router-dom";


export default withRouter(class ShowProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            text: '',
            author: '',
            product: '',
            success: ''
        };
        this.deleteReview = this.deleteReview.bind(this)
    }

    componentDidMount() {
        fetch(`https://rozibackend.herokuapp.com/review/${this.props.match.params.id}`)
            .then(response => response.json())
            .then(data => {
                if (data.success === true) {
                    this.setState(() => ({
                        id: data.data._id,
                        text: data.data.text,
                        author: data.data.author,
                        product: data.data.product,
                        success: data.success
                    }))
                } else {
                    this.setState((state) => ({
                        success: data.success
                    }))
                }
            })
    }

    deleteReview() {
        fetch(`https://rozibackend.herokuapp.com/review/${this.props.match.params.id}`,
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

    render() {
        var buttonRev
        if(this.state.author._id === localStorage.getItem('user')){
            buttonRev =
            <Media>
            <Link to={`/product/${this.state.product._id}`}><Button onClick={this.deleteReview}>Delete Review</Button></Link>
            <Link to={`/product/${this.state.product._id}`}><Button>Back To Product</Button></Link>
            </Media>
        }else{
            buttonRev =
            <Link to={`/product/${this.state.product._id}`}><Button>Back To Product</Button></Link>
        }

        return (
            <div>
                <Alert color="dark" style={{ width: '100vh', margin: 'auto' }}>
                    <Media body>
                        <Media heading href={`/user/${this.state.author._id}`}>
                            {this.state.author.username}
                        </Media>
                        {this.state.text}
                    </Media>
                        {buttonRev}
                </Alert>
            </div>
        );
    }
}
)
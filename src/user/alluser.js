import React from 'react';
import {
    Card, Button, CardImg, CardTitle, CardColumns,
    CardSubtitle, CardBody
} from 'reactstrap';
import { Link } from "react-router-dom";


export default class AllUser extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            users: []
        }
    }

    componentDidMount() {
        fetch('https://rozibackend.herokuapp.com/user')
            .then(response => response.json())
            .then(data => {
                this.setState(state => ({
                    users: [...state.users, ...data.data]
                }))
            })
    }


    render() {
        return (
            <div>
                <h2 style={{ textAlign: 'center' }}>All User</h2>
                <CardColumns style={{ width: '1000px', margin: 'auto' }}>
                    {this.state.users.map(showuser => {

                        var buttonAcc
                        if (showuser._id === localStorage.getItem('user')) {
                            buttonAcc =
                                    <Link to={`/user/${showuser._id}`}><Button color="info">Acc Detail</Button></Link>
                        } else {
                            buttonAcc =
                                <div>login untuk menggunakan user ini</div>
                        }

                        return (
                            <Card body key={showuser._id}>
                                <CardImg top width="100%" src={showuser.image ? showuser.image : `https://pbs.twimg.com/profile_images/1164752786992484354/PyFcqmzG_400x400.jpg`} alt={showuser.username} />
                                <CardBody>
                                    <h4><CardTitle>{showuser.username}</CardTitle></h4>
                                    <CardSubtitle>{showuser.email}</CardSubtitle>
                                    {buttonAcc}
                                </CardBody>
                            </Card>
                        )
                    })}
                </CardColumns>
            </div>
        );
    }
}





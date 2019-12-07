import React from 'react'
import Layout from '../components/layout'
import ListGroup from 'react-bootstrap/ListGroup'
import { Button, Container, Alert } from 'react-bootstrap'
import { withRouter } from "next/router";
import axios from "axios";
import socketWrapper from '../components/socketio/socketHOC';
import { FaAngleLeft } from "react-icons/fa";
import Link from 'next/link';

//import withAuthentication from '../components/withAuthentication'

class Setting extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            groupId: undefined,
            groupName: undefined,
            userName: undefined,
            alert: {
                show: false,
                content: '',
            }
        }
    }

    async componentDidMount() {
        const group = JSON.parse(localStorage.getItem('group'));
        const userName = localStorage.getItem('userName');

        this.setState({
            ...this.state,
            groupId: group.groupId,
            groupName: group.groupName,
            userName: userName
        })
    }

    async changeUserName() {
        let newName = window.prompt('Enter your new user name:')
        if (newName == null) {
            return
        }
        if (newName == '') {
            return this.setState({
                alert: {
                    show: true,
                    content: 'User name cannot be empty.',
                }
            })
        }
        try {
            // let params = {newName:newName};
            // let {data} = await axios.put('/users/userName', params);
            let params = { newName:newName };
            let { data } = await axios.post(`/users/userName`, params);
            //console.log(data);
            // console.log('before change name', data)
            if(data.user){
                let newUser = JSON.parse(localStorage.getItem('user'))
                newUser.name = data.user.name
                localStorage.setItem('user', JSON.stringify(newUser));
                localStorage.setItem('userName', data.user.name);
                this.setState({
                    userName:data.user.name,
                    alert: {
                        show: true,
                        content: data.msg
                    }
                })
            }
            else{
                console.log('wrong branch')
                this.setState({
                    alert: {
                        show: true,
                        content: data.msg
                    }
                })
            }
        }catch(e) {
            console.log(e)
            this.setState({
                alert: {
                    show: true,
                    content: e.message
                }
            })
        }
    }

    async dismissGroup() {
        try {
            // let params = {newName:newName};
            // let {data} = await axios.put('/users/userName', params);
            let params = { groupId: this.state.groupId };
            let { data } = await axios.post(`/users/dismissGroup`, params);
            //console.log(data);
            if(data.user && data.group){
                console.log("success dismiss group");
                this.props.router.replace('/groups')
            }
            else{
                this.setState({
                    alert: {
                        show: true,
                        content: data.msg
                    }
                })
            }
        }
        catch(e) {
            console.log(e)
            this.setState({
                alert: {
                    show: true,
                    content: e.message
                }
            })
        }
    }

    handleLogToOtherGroup() {
        this.props.onLeave()
        this.props.router.replace('/groups')
    }

    async handleLogOut() {
        await axios.post(`/users/logout`);
        this.props.router.replace('/login')
    }

    sideIconLeft() {
        const prevPage = localStorage.getItem('back');
        if(prevPage == 'chat'){
            return (
                <Link href="/chat">
                    <a><FaAngleLeft color="#007bff" size="1.5rem" className="flex-grow-0" /></a>
                 </Link>
             )
        }
        else{
            return (
                <Link href="/map">
                    <a><FaAngleLeft color="#007bff" size="1.5rem" className="flex-grow-0" /></a>
                 </Link>
             )
        }
    }

    render() {
        return (
            <Layout title={"Setting"} sideIconLeft={this.sideIconLeft}>
                <Container>
                    <div>
                        <ListGroup className="mt-4" variant="flush">            
                            <ListGroup.Item
                            as="div"
                            action={true}
                            key={"groupName"}
                            >
                                <p>Group Name: {this.state.groupName}</p> 
                            </ListGroup.Item>

                            <ListGroup.Item
                            as="div"
                            action={true}
                            key={"userName"}
                            >
                                <p>User Name: {this.state.userName}</p> 
                                <Button onClick={() => this.changeUserName()} variant="dark" size="sm" className="btn-block">Change User Name</Button>
                            </ListGroup.Item>

                            <ListGroup.Item
                            as="div"
                            action={true}
                            key={"logToOtherGroup"}
                            onClick={this.handleLogToOtherGroup.bind(this)}
                            >
                                <p>Log to other group</p> 
                            </ListGroup.Item>

                            <ListGroup.Item
                            as="div"
                            action={true}
                            key={"dismissGroup"}
                            onClick={this.dismissGroup.bind(this)}
                            >
                                <p>Dismiss Group</p> 
                            </ListGroup.Item>

                        </ListGroup>
                    </div>
                    <div className="mt-5">
                        <Button onClick={this.handleLogOut.bind(this)} variant="dark" size="lg" className="btn-block">Logout</Button>
                    </div>
                </Container>
            </Layout>
        )
    }

}

export default socketWrapper(withRouter(Setting))
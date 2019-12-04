import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Layout from '../components/layout'
import { Button, Container } from 'react-bootstrap'
import { withRouter } from "next/router";
import axios from "axios";
import withAuthentication from '../components/withAuthentication'

class Groups extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            groups: []
        }
    }

    async componentDidMount() {
        let groups = await this.getGroups()
        this.setState({
            ...this.state,
            groups: groups
        })
    }

    async getGroups() {
        try{
            const user = JSON.parse(localStorage.getItem('user'));
            const uid = user._id;
            const { data } = await axios.get(`/users/${uid}`);
            const groups = data.groups ? data.groups : [];
            // return [
            //     { name: 'My Family', gid: 'myFamily' },
            //     { name: 'My Friends', gid: 'myFriends' },
            //     { name: 'Hiking Team', gid: 'hikingTeam' },
            //     { name: 'Colleagues', gid: 'colleagues' },
            // ]
            return groups;
        }catch (e) {
            switch(e.response.status) {
                case 404:
                    let { router } = this.props
                    router.replace('/')
                    break
                default:
                    console.log("error happens");
                    console.log(JSON.stringify(e));
            }
        }
        return []
    }

    handleGroupSelect(group) {
        localStorage.setItem('group', JSON.stringify(group));
        let { router } = this.props;
        router.push('/map');
    }

    selectGroups() {
        return (
            <>
                <p className="mt-4 text-muted">You have multiple groups. Please select one to continue... </p>
                <div>
                    <ListGroup className="mt-4" variant="flush">
                        {this.state.groups.map(group => (
                            <ListGroup.Item
                            as="div"
                            action={true}
                            key={group.groupName}
                            onClick={this.handleGroupSelect.bind(this, group)}
                            >
                                {group.groupName}
                                {/* {group.name} */}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            </>
        )
    }
    
    render() {
        return (
            <Layout>
                <Container>
                    {this.state.groups.length > 0 ? this.selectGroups() : ''}
                    <div className="mt-5">
                        <p className="text-muted">Want to have a new group?</p>
                        <Button variant="dark" size="lg" className="btn-block">Create</Button>
                        <p className="text-muted mt-4">Or join a new group.</p>
                        <Button variant="secondary" size="lg" className="btn-block">Search</Button>
                    </div>
                </Container>
            </Layout>
        )
    }
}

export default withAuthentication(withRouter(Groups))
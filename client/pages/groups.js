import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Layout from '../components/layout'
import { Button, Container } from 'react-bootstrap'
import { withRouter } from "next/router";

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
        return [
            { name: 'My Family', gid: 'myFamily' },
            { name: 'My Friends', gid: 'myFriends' },
            { name: 'Hiking Team', gid: 'hikingTeam' },
            { name: 'Colleagues', gid: 'colleagues' },
        ]
    }

    handleGroupSelect(group) {
        localStorage.setItem('group', JSON.stringify(group))
        let { router } = this.props
        router.push('/map')
    }
    
    render() {
        return (
            <Layout>
                <Container>
                    <p className="mt-4 text-muted">You have multiple groups. Please select one to continue... </p>
                    <div>
                        <ListGroup className="mt-4" variant="flush">
                            {this.state.groups.map(group => (
                                <ListGroup.Item
                                as="div"
                                action={true}
                                key={group.gid}
                                onClick={this.handleGroupSelect.bind(this, group)}
                                >
                                    {group.name}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
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

export default withRouter(Groups)
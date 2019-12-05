import 'react-chat-elements/dist/main.css'
import React from 'react'
import Link from 'next/Link'
import Layout from '../components/layout'
import { FaAngleLeft, FaBars } from "react-icons/fa";
import { MessageBox, Input, Button } from 'react-chat-elements'
import Icon from '../components/icon'
import { FaPaperPlane } from 'react-icons/fa'
import { Container } from 'react-bootstrap'
import withAuthentication from '../components/withAuthentication'
import socketWrapper from '../components/socketio/socketHOC'

class Chat extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            groupName: '',
            messages: [
                // {
                //     title: 'You',
                //     position: 'right',
                //     type: 'text',
                //     text: 'Hi, we can start sharing our location!',
                //     date: new Date(),
                // },
            ]
        }

    }

    sideIconLeft() {
        return (
           <Link href="/map">
               <a><FaAngleLeft color="#007bff" size="1.5rem" className="flex-grow-0" /></a>
            </Link>
        )
    }

    sideIconRight() {
        return (
            <FaBars size="1.5rem" color="#007bff" />
        )
    }

    componentDidUpdate(prevProps) {
        if (this.props.chatHistory !== prevProps.chatHistory) {
            let chatHistory = this.props.chatHistory
            this.setState({ messages: chatHistory}
                    , () => {
                        this.refs.chatBody.scrollTo({
                            top: this.refs.chatBody.scrollHeight,
                            left: 0,
                            behavior: 'smooth'
                        })
                    }
                )
        }
    }

    messageList() {
        let list = []
        let { messages } = this.state
        for (let i = 0; i < messages.length; i ++) {
            let msg = messages[i]
            list.push(
                <div className={`d-flex mb-4 ${msg.position}-box`} key={`msg-${i}`}>
                    <Icon className={msg.position} name={msg.title} style={{ width: '28px', height: '28px', flexShrink: 0 }} />
                    <MessageBox
                        className="flex-grow-1 flex-shrink-1 message-box"
                        width="100"
                        {...msg}
                    />
                </div>
            )
        }
        return list
    }

    addMessage(msg) {
        this.props.onSendMessage(msg, (err) => {
            console.log('in chat add Message')
            console.log(msg)
            return null
          })
    }

    sendMessage() {
        let textAreaArr = this.refs.input.input
        this.addMessage({
            title: "You",
            position: "right",
            type: "text",
            text: textAreaArr.value,
            date: new Date()
        })
        this.refs.input.clear()
    }
    
    render() {
        return (
            <Layout title={this.state.groupName} sideIconLeft={this.sideIconLeft} sideIconRight={this.sideIconRight}>
                <Container fluid={true} className="d-flex flex-column flex-grow-1 flex-shrink-0" style={{height: '0 !important', overflow: 'hidden'}}>
                    <div ref="chatBody" className="chat-body mt-3 flex-grow-1 flex-shrink-0">
                        {this.messageList()}
                    </div>
                    <div className="input-box flex-shrink-1 mb-3">
                        <Input
                            ref='input'
                            placeholder="Enter message here..."
                            multiline={true}
                            inputStyle={{ backgroundColor: '#eee' }}
                            rightButtons={
                                <Button
                                    text={<FaPaperPlane style={{width: '60px'}}
                                    onClick={this.sendMessage.bind(this)}
                                    />} />
                            }
                        />
                    </div>
                </Container>
                <style>{`
                    .message-box {
                        position: relative;
                        top: 10px;
                        max-width: 60%;
                    }
                    .right {
                        order: 1;
                    }
                    .right-box {
                        justify-content: flex-end;
                    }
                    .chat-body {
                        height: 0 !important;
                        overflow-y: auto;
                    }
                    .input-box {
                        // width: 100%;
                        // bottom: 0;
                        // position: fixed;
                        // left: 0;
                        padding: 0 0.5rem 0 0.5rem;
                    }
                `}</style>
            </Layout>
        )

    }
}

export default withAuthentication(socketWrapper(Chat))
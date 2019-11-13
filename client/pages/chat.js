import React from 'react'
import Layout from '../components/layout'
import { FaAngleLeft, FaBars } from "react-icons/fa";
import { MessageBox, Input, Button } from 'react-chat-elements'
import 'react-chat-elements/dist/main.css'
import Icon from '../components/icon'
import { FaPaperPlane } from 'react-icons/fa'

class Chat extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            groupName: '',
            messages: [
                {
                    title: 'You',
                    position: 'right',
                    type: 'text',
                    text: 'Hi, we can start sharing our location!',
                    date: new Date(),
                },
                {
                    title: 'Amy',
                    position: 'left',
                    type: 'text',
                    text: 'Yes! I cannot wait anymore! Yes! I cannot wait anymore! Yes! I cannot wait anymore!',
                    date: new Date(),
                },
                {
                    title: 'Eric',
                    position: 'left',
                    type: 'text',
                    text: 'Hey, are you Ok?',
                    date: new Date(),
                }
            ]
        }
    }

    sideIconLeft() {
        return (
            <FaAngleLeft size="1.5rem" color="#007bff" />
        )
    }

    sideIconRight() {
        return (
            <FaBars size="1.5rem" color="#007bff" />
        )
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            groupName: JSON.parse(localStorage.getItem('group')).name
        })
    }

    messageList() {
        let list = []
        let { messages } = this.state
        for (let i = 0; i < messages.length; i ++) {
            let msg = messages[i]
            list.push(
                <div className={`d-flex mt-4 ${msg.position}-box`} key={`msg-${i}`}>
                    <Icon className={msg.position} name={msg.title} style={{ width: '28px', height: '28px' }} />
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
        this.setState({
            ...this.state,
            messages: [...this.state.messages, msg]
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
        console.log(this.refs)
        this.refs.input.clear()
    }
    
    render() {
        return (
            <Layout title={this.state.groupName} sideIconLeft={this.sideIconLeft} sideIconRight={this.sideIconRight}>
                <div>

                    <div className="chat-body" style={{ marginBottom: '100px' }}>
                        {this.messageList()}
                    </div>
                    <div className="input-box mt-5">
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
                    <style>{`
                        .message-box {
                            position: relative;
                            top: 10px;
                            // max-width: 60%;
                        }
                        .right {
                            order: 1;
                        }
                        .right-box {
                            justify-content: flex-end;
                        }
                        .input-box {
                            width: 100%;
                            bottom: 0;
                            position: fixed;
                            left: 0;
                            padding: 0 0.5rem 0 0.5rem;
                        }
                    `}</style>
                </div>
            </Layout>
        )

    }
}

export default Chat
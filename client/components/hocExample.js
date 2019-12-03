import react, { useState } from 'react'



function withHocExample(Component) {
    return class extends react.Component {
        constructor(props) {
            super(props)
            this.state = {
                count: 0,
                globalCount: globalCount
            }
            // ...
        }

        render() {
            return (
                <Component
                    handler={data => this.handler(data)}
                    globalCount={this.state.globalCount}
                    count={this.state.count}
                    {...this.props}
                />
            )
        }

        handler(data) {
            console.log('this is handler in class')
            this.setState({
                count: this.state.count + 1,
                globalCount: globalHandler(data)
            })
        }
    }
}

var globalCount = 0

function globalHandler(data) {
    globalCount ++
    console.log(data)
    return globalCount
}

export default withHocExample
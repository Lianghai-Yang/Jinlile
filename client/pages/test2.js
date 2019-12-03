import withHocExample from '../components/hocExample'
import React from 'react'
import Link from 'next/Link'

class Test2 extends React.Component {
    render() {
        return (
            <div>
                Test 2
                <p>Count: {this.props.count}</p>
                <p>Global Count: {this.props.globalCount}</p>
                <button onClick={() => this.props.handler({ test: 'hello world' })}>Click</button>
                <Link href='/test1'><a>Test 1</a></Link>
            </div>
        )
    }
}

export default withHocExample(Test2)
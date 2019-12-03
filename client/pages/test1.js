import withHocExample from '../components/hocExample'
import React from 'react'
import Link from 'next/Link'

class Test1 extends React.Component {
    render() {
        return (
            <div>
                Test 1
                <p>Count: {this.props.count}</p>
                <p>Global Count: {this.props.globalCount}</p>
                <button onClick={() => this.props.handler({ test: 'I am test1' })}>Click</button>
                <Link href='/test2'><a>Test 2</a></Link>
            </div>
        )
    }
}

export default withHocExample(Test1)
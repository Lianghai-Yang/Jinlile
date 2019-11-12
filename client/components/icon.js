import React from 'react'

class Icon extends React.Component {

    simpleHash(name='') {
        let sum = 0;
        for (let i = 0; i < name.length; i++) {
            sum += name.charCodeAt(i)
        }
        return sum % 50 + 1
    }
    
    render() {
        let { name } = this.props
        let length = parseInt(650 / this.props.zoom)
        return (
            <div className="marker-container">
                <img src={`/icons/icon-${this.simpleHash(name)}.svg`} alt="user"/>
                <div>{name}</div>
                <style jsx scoped>{`
                    .marker-container {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: center;
                        width: ${length}px;
                        height: ${length}px;
                        text-align: center;
                        font-size: 16px;
                        color: white;
                        letter-spacing: 0.1rem;
                        text-shadow: 2px 0 0 #666, -2px 0 0 #666, 0 2px 0 #666, 0 -2px 0 #666, 1px 1px #666, -1px -1px 0 #666, 1px -1px 0 #666, -1px 1px 0 #666;
                        position: relative;
                        left: ${-length/2}px;
                        top: ${-length/2}px;
                    }
                    img {
                        width: 100%;
                        height: 100%;
                        filter: drop-shadow(3px 3px 2px #222);
                    }
                `}</style>
            </div>
        )
    }
}

export default Icon
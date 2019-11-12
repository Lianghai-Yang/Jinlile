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
        let length = parseInt(500 / this.props.zoom)
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
                    left: ${-length/2}px;
                    top: ${-length/2}px;
                    text-align: center;
                    font-size: 16px;
                    color: white;
                    text-shadow: 2px 0 0 #666, -2px 0 0 #666, 0 2px 0 #666, 0 -2px 0 #666, 1px 1px #666, -1px -1px 0 #666, 1px -1px 0 #666, -1px 1px 0 #666;
                }
                img {
                    width: 100%;
                    height: 100%;
                }
            `}</style>
            </div>
        )
    }
}

export default Icon
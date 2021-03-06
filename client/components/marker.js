import React from 'react'
import Icon from './icon'

class Marker extends React.Component {
    
    render() {
        let { name } = this.props
        let length = parseInt(650 / this.props.zoom)
        return (
            <div className="marker-container">
                <Icon name={name} alt={name} />
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

export default Marker
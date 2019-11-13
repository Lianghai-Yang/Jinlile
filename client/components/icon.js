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
        return (
            <>
            <img src={`/icons/icon-${this.simpleHash(name)}.svg`} alt={name} {...this.props} />
            <style jsx>{`
                img {
                    width: 100%;
                    height: 100%;
                    filter: drop-shadow(3px 3px 2px #222);
                }
            `}</style>
            </>
        )
    }

}

export default Icon
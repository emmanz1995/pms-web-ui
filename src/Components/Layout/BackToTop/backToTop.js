import React, { Component }  from 'react';
import './backToTop.css'

class backToTop extends Component {
    constructor(props) {
        super (props) 
    };
    render() {
        return (
            <div>
                <input type="submit" className="topdown-btn" value ="Back To Top" />
            </div>
        )
    }
}
export default backToTop;
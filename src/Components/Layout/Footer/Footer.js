import React from 'react';
import './footer.css';

const footer = (props) => {
    return (
        <div>
            <div className="footer">
                Powered by Emmanuel &copy;{new Date().getFullYear()}
            </div>
        </div>
    );

}

export default footer;
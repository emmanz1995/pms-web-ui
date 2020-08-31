import React from 'react';
import './footer.css';

const footer = (props) => {
    return (
        <div>
            <div className="footer">
                Powered by Emmanuel and Anoj &copy;{new Date().getFullYear()}
            </div>
        </div>
    );

}

export default footer;
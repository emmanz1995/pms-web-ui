import React from 'react';
import './footer.css';

const footer = (props) => {
    return (
        <div>
            <div className="footer">
                {/* displays the copyright icon and displays the current year */}

                Powered by Emmanuel &copy;{new Date().getFullYear()}
            </div>
        </div>
    );

}

export default footer;



import React from 'react';
import { Spinner } from './ui/spinner';


const Loading = () => {
    return (
        <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">
           <Spinner />
        </div>
    );
}

export default Loading;

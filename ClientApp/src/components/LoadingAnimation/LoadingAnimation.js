import React from 'react'
import { Puff } from "react-loader-spinner";
import '../LoadingAnimation/LoadingAnimation.css';
export function LoadingAnimation(props) {
    return (
        <div className='loading-fragment'>
            <Puff
                height="80"
                width="80"
                radius={1}
                color="#4fa94d"
                ariaLabel="puff-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
            <h5>{props.text}</h5>
        </div>
    )
}


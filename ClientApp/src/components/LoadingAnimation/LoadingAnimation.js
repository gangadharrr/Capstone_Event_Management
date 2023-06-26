import React from 'react'
import { Puff, FallingLines } from "react-loader-spinner";

import '../LoadingAnimation/LoadingAnimation.css';
export function LoadingAnimation(props) {
    return (
        <div className='loading-fragment'>
            {props.type === 'puff' ? <Puff
                height="80"
                width="80"
                radius={1}
                color="#4fa94d"
                ariaLabel="puff-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            /> : props.type === 'fallinglines' ?
                <FallingLines
                    height="80"
                    width="80"
                    radius={1}
                    color="#4fa94d"
                    ariaLabel="puff-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                /> : <Puff
                    height="80"
                    width="80"
                    radius={1}
                    color="#4fa94d"
                    ariaLabel="puff-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                />}
            <p>{props.text}</p>
        </div>
    )
}


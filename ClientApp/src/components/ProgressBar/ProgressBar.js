import React from 'react'

export function ProgressBar(props) {
    return (
        <div className="progress" style={{ visibility: props.status?'visible':'hidden' }}>
            <div className="progress-bar" role="progressbar" style={{ width: `${props.value}%` }}>
                <span className="sr-only" >{props.value}% Complete</span>
            </div>
        </div>
    )
}


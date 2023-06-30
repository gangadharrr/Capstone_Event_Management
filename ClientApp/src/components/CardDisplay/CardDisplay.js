import React from 'react'
import'./CardDisplay.css'
import { Link } from 'react-router-dom'

export function CardDisplay(props) {
  return (
    <div className="card" >
    <img src={props.imgsrc} className="card-img-top" alt="..."/>
      <div className="card-body">
        <h5 className="card-title">{props.title}</h5>
        <p className="card-text">{props.description}</p>
        <Link to={props.btnsrc} className="btn btn-primary card-button ">Know More</Link>
      </div>
  </div>

  )
}

import React, { useEffect } from 'react'
import'./CardDisplay.css'
import { Link,useNavigate } from 'react-router-dom'

export function CardDisplay(props) {
  const navigate = useNavigate()
  useEffect(() => {
    
  })
  return (
    <div className="card" id='card' onClick={()=>navigate(props.btnsrc)} >
    <img src={props.imgsrc} className="card-img-top" alt="..."/>
      <div className="card-body" id='card-body'>
        <div className="card-title" id='card-title'><h5>{props.title}</h5></div>
        <p className="card-text">{props.description}</p>
        <Link to={props.btnsrc} className="btn btn-primary " id='card-button'>Know More</Link>
      </div>
  </div>

  )
}

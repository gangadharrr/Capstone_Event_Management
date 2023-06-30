import React, { Component, useState, useEffect,useRef } from 'react';
import { LoadingAnimation } from './LoadingAnimation/LoadingAnimation';
import { CardDisplay } from './CardDisplay/CardDisplay';
import axios from 'axios';
import authService from './api-authorization/AuthorizeService';
import "./Home.css"


export function Home() {
  const [data, setData] = useState(null);
  const [spinner, setSpinner] = useState(true);
  const ref = useRef();
  useEffect(() => {
    authService.getAccessToken().then(token => {
      axios.get('clubs', {
        headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
      }).then((response) => {
        setData(response.data)
        setSpinner(false)
      })
    })
  })
  const scroll = (scrollOffset) => {
    ref.current.scrollLeft += scrollOffset;
  };
  return (
    <div><h1>Hello, world!</h1>
      <h4>Clubs</h4>
      <hr />
      <div className='scroll-content'>
        <button className='nav-buttons' onClick={() => scroll(-200)}>&#5176;</button>
      <div className="rowDisplay" ref={ref}>
        { spinner ? <LoadingAnimation type='fallinglines' text="Loading..." /> : data.map((item) => {
          return (
            <div className="col-sm-3" key={item.clubId}>
              <CardDisplay  imgsrc={item.clubPicture} title={item.name} description={item.description} btnsrc={`/club-home?id=${item.clubId}`} />
            </div>
          )
        })}
      </div>
        <button className='nav-buttons'  onClick={() => scroll(200)}>&#5171;</button>
        </div>
    </div>
      

  )
}

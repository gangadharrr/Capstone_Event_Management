import React, { Component, useState, useEffect, useRef } from 'react';
import { LoadingAnimation } from './LoadingAnimation/LoadingAnimation';
import { CardDisplay } from './CardDisplay/CardDisplay';
import { EventCardDisplay } from './EventCardDisplay/EventCardDisplay';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./Home.css"
import { Position } from '@cloudinary/url-gen/qualifiers';


export function Home() {
  const [isOverflowingEvents, setIsOverflowingEvents] = useState(false);
  const [isOverflowingCLubs, setIsOverflowingClubs] = useState(false);
  const [clubData, setClubData] = useState(null);
  const [eventsData, setEventsData] = useState(null);
  const [clubNames, setClubNames] = useState([])
  const [spinner, setSpinner] = useState(true);
  const eventsRef = useRef(null);
  const clubsRef = useRef(null);
  useEffect(() => {
    axios.get(`collegeevents`).then((response) => {
      setEventsData(response.data)
      axios.get(`clubs`).then((response) => {
        setClubData(response.data)
        let _data = {}
        response.data.map((val) => {
          _data[val.clubId] = val.name
        })
        setClubNames(_data)
        setSpinner(false)
        const el = eventsRef.current;
        if (eventsRef.current && el.offsetWidth < el.scrollWidth) {
          setIsOverflowingEvents(true);
        }
        const els = clubsRef.current;
        if (eventsRef.current && els.offsetWidth < els.scrollWidth) {
          setIsOverflowingClubs(true);
        }
     
      })
    })
  });

  const scrollClubs = (scrollOffset) => {
    clubsRef.current.scrollLeft += scrollOffset;
  };
  const scrollEvents = (scrollOffset) => {
    eventsRef.current.scrollLeft += scrollOffset;
  };
  const DateFormatter = (date) => {
    var d = new Date(date);
    return d.toDateString();
  }
  const images = [
    "https://res.cloudinary.com/ifeomaimoh/image/upload/v1652345767/demo_image2.jpg",
    "https://res.cloudinary.com/ifeomaimoh/image/upload/v1652366604/demo_image5.jpg",
    "https://res.cloudinary.com/ifeomaimoh/image/upload/v1652345874/demo_image1.jpg",
  ];
  return (spinner ? <LoadingAnimation type='fallinglines' text="Loading..." /> :
    <React.Fragment>
      <h3>Recent Updates</h3>
      <hr />
      <div id='carousal-content-display'>
        <div className="box" style={{ height: '100%', width: '45%' }} >
          <Carousel useKeyboardArrows={true} dynamicHeight={true} showThumbs={false} infiniteLoop={true} showArrows={true} autoPlay={true} interval={5000} >
            {eventsData.map((val, index) => (
              <div className="slide" key={index} >
                <img alt="sample_file" src={val.pictureUrl}  style={{filter:"blur(2px)"}} />
                <img alt="sample_file" src={val.posterUrl} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '50%', height: '100%' }} />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
      <h4>Events</h4>
      <hr />
      <div className='scroll-content' >
        {isOverflowingEvents ? <button className='nav-buttons' onClick={() => scrollEvents(-200)}>&#5176;</button> : null}
        <div className="rowDisplay" id='events-row-display' ref={eventsRef}>
          {eventsData.map((item) => {
            return (
              <div  id='event-card' key={item.eventId}>
                <EventCardDisplay
                  imgsrc={item.pictureUrl}
                  title={item.name}
                  modeOfEvent={item.modeOfEvent}
                  clubName={clubNames[item.clubId]}
                  lastDate={"Last Date : " + DateFormatter(item.lastDayToRegister)}
                  resourcePerson={item.resourcePerson}
                  btnsrc={`/club-home?id=${item.clubId}`} />
              </div>
            )
          })}
        </div>
        {isOverflowingEvents ? <button className='nav-buttons' onClick={() => scrollEvents(200)}>&#5171;</button> : null}
      </div><br />
      <h4>Clubs</h4>
      <hr />
      <div className='scroll-content' >
        {isOverflowingCLubs ? <button className='nav-buttons' onClick={() => scrollClubs(-200)}>&#5176;</button> : null}
        <div className="rowDisplay" ref={clubsRef}>
          {clubData.map((item) => {
            return (
              <div className="col-sm-3" id='club-card' key={item.clubId}>
                <CardDisplay imgsrc={item.clubPicture} title={item.name} description={item.description} btnsrc={`/club-home?id=${item.clubId}`} />
              </div>
            )
          })}
        </div>
        {isOverflowingCLubs ? <button className='nav-buttons' onClick={() => scrollClubs(200)}>&#5171;</button> :null}
      </div>
    </React.Fragment>


  )
}

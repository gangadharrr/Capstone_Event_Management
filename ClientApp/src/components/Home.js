import React, { useState, useEffect, useRef } from 'react';
import { LoadingAnimation } from './LoadingAnimation/LoadingAnimation';
import { CardDisplay } from './CardDisplay/CardDisplay';
import { EventCardDisplay } from './EventCardDisplay/EventCardDisplay';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./Home.css"
import authService from './api-authorization/AuthorizeService';
import { useNavigate } from 'react-router-dom';


export function Home() {
  const navigate = useNavigate()
  const [isOverflowingEvents, setIsOverflowingEvents] = useState(true);
  const [isOverflowingCLubs, setIsOverflowingClubs] = useState(true);
  const [clubData, setClubData] = useState(null);
  const [eventsData, setEventsData] = useState(null);
  const [clubNames, setClubNames] = useState([])
  const [roles, setRoles] = useState([])
  const [spinner, setSpinner] = useState(true);
  const eventsRef = useRef(null);
  const clubsRef = useRef(null);
  useEffect(() => {
    axios.get(`collegeevents`).then((res) => {
      setEventsData(res.data)
      axios.get(`clubs`).then((response) => {
        setClubData(response.data)
        let _data = {}
        response.data.map((val) => {
          _data[val.clubId] = val.name
          return null
        })
        setClubNames(_data)
        authService.getUser().then((user) => {
          axios.get(`customidentityrole/details/${user.name}/1`).then((responseRole) => {
            setRoles(responseRole.data)
          })
        }).catch((error) => {
          console.log(error);
        })
        setSpinner(false)
        const el = eventsRef.current;
        if (eventsRef.current && el.offsetWidth < el.scrollWidth) {
          setIsOverflowingEvents(true);
        }
        else {
          setIsOverflowingEvents(false);
        }
        const els = clubsRef.current;
        if (eventsRef.current && els.offsetWidth < els.scrollWidth) {
          setIsOverflowingClubs(true);
        }
        else {
          setIsOverflowingEvents(false);
        }

      })
    })
  }, [])

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
  return (spinner ? <LoadingAnimation type='fallinglines' text="Loading..." /> :
    <React.Fragment>
      <h3>Recent Updates</h3>
      <hr />
      <div id='carousal-content-display'>
        <div className="box" style={{ height: '100%', width: '45%' }} >
          <Carousel useKeyboardArrows={true} dynamicHeight={true} showThumbs={false} infiniteLoop={true} showArrows={true} autoPlay={true} interval={5000} >
            {eventsData.map((val, index) => (
              <div className="slide" key={index} onClick={() => navigate(`/college-events-index-page?id=${val.eventId}`)} >
                <img alt="sample_file" src={val.pictureUrl} style={{ filter: "blur(2px)" }} />
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
              <div id='event-card' key={item.eventId}>
                <EventCardDisplay
                  ActiveColor={roles.includes(item.accessLevel) ? "rgb(0, 255, 0)" : "rgb(255, 0, 0)"}
                  imgsrc={item.pictureUrl}
                  title={item.name}
                  modeOfEvent={item.modeOfEvent}
                  clubName={clubNames[item.clubId]}
                  lastDate={"Last Date : " + DateFormatter(item.lastDayToRegister)}
                  resourcePerson={item.resourcePerson}
                  btnsrc={`/college-events-index-page?id=${item.eventId}`} />
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
        {isOverflowingCLubs ? <button className='nav-buttons' onClick={() => scrollClubs(200)}>&#5171;</button> : null}
      </div>
    </React.Fragment>


  )
}

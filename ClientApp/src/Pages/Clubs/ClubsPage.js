import React, {  useState, useEffect } from 'react';
import { LoadingAnimation } from '../../components/LoadingAnimation/LoadingAnimation';
import { CardDisplay } from '../../components/CardDisplay/CardDisplay';
import axios from 'axios';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./ClubsPage.css"

export function ClubsPage() {
  const [spinner, setSpinner] = useState(true);
  const [clubData, setClubData] = useState(null);
  useEffect(() => {
    axios.get(`clubs`).then((response) => {
        setClubData(response.data)
        setSpinner(false)
    })
  },[])
    return ( spinner ? <LoadingAnimation type='puff' text="Loading..." /> :
        <React.Fragment>
            <h1>Clubs</h1>
            <hr/>
            <div className='clubs-page'>
               {clubData ? clubData.map((item) =>{
                
                 return(
                     <CardDisplay imgsrc={item.clubPicture} title={item.name} description={item.description} btnsrc={`/club-home?id=${item.clubId}`} />
                     ) 
               }):<LoadingAnimation type='fallinglines' text="Loading..." /> }  
            </div>
        </React.Fragment>
    )
}
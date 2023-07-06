import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import "./CollegeEventsIndexPage.css"
import { useLocation, useNavigate } from 'react-router-dom';
import { LoadingAnimation } from '../../components/LoadingAnimation/LoadingAnimation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBellSlash, faBell, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { ProfileCardDisplay } from "../../components/ProfileCardDisplay/ProfileCardDisplay"
import { EventCardDisplay } from "../../components/EventCardDisplay/EventCardDisplay"
import authService from '../../components/api-authorization/AuthorizeService'
import { ApplicationPaths } from '../../components/api-authorization/ApiAuthorizationConstants';


export function CollegeEventsIndexPage() {
  return (
    <div>CollegeEventsIndexPage</div>
  )
}

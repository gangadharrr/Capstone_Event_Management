import React, { useState, useEffect } from 'react'
import './MembersIndexPage.css'
import { useNavigate, useLocation } from 'react-router-dom'
import authService from '../../components/api-authorization/AuthorizeService';
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react"
import { LoadingAnimation } from '../../components/LoadingAnimation/LoadingAnimation';
import axios from 'axios'
export function MembersIndexPage() {
    const cld = new Cloudinary({ cloud: { cloudName: 'dujyzevpx' } });
    const myImg = cld.image('Images/Account_Logo_jton6z.png')
    const [data, setData] = useState([])
    const [spinner, setSpinner] = useState(true);
    const navigate = useNavigate()
    const location = useLocation()
    const queryParameters = new URLSearchParams(location.search)
    useEffect(() => {
        authService.getAccessToken().then(token => {
            axios.get(`${queryParameters.get('member')}/${queryParameters.get('id')}`, {
                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            }).then((response) => {
                setData([response.data])
                setSpinner(false)
            })
        })
    })
    return (
        spinner ? <LoadingAnimation type='puff' text="Loading..." /> :

            <React.Fragment>
                {
                    data.map((data) => {
                        return (
                            <center>
                                <div id='members-index-page'>
                                    <div style={{display: 'flex',width: '100%',flexDirection: 'row',justifyContent: 'flex-end' }} >

                                        <button className="btn btn-close" onClick={() => navigate(queryParameters.get('returnUrl'))}></button>
                                    </div>
                                    <div id='members-index-page-head'>
                                        <AdvancedImage cldImg={myImg} onError={e => e.target.src = "https://res.cloudinary.com/dujyzevpx/image/upload/v1687345453/Images/Account_Logo_jton6z.png"} id="members-card-img-top" />
                                        <h2>{data.name}</h2>
                                    </div>
                                    <hr />
                                    <div>
                                        <p style={{ fontWeight: 700 }}>Personal Details</p>
                                        <div id='personal-details'>
                                        {queryParameters.get('member') === 'professors' ?
                                             <dl className="row">
                                             <dt className="col-sm-4">
                                                 ProfessorId
                                             </dt>
                                             <dd className="col-sm-8">
                                                 {data.professorId}
                                             </dd>
                                             <dt className="col-sm-4">
                                                 Name
                                             </dt>
                                             <dd className="col-sm-8">
                                                 {data.name}
                                             </dd>
                                             <dt className="col-sm-4">
                                                 Email
                                             </dt>
                                             <dd className="col-sm-8">
                                                 {data.email}
                                             </dd>
                                             <dt className="col-sm-4">
                                                 Designation
                                             </dt>
                                             <dd className="col-sm-8">
                                                 {data.designation}
                                             </dd>
                                             <dt className="col-sm-4">
                                                 Degree
                                             </dt>
                                             <dd className="col-sm-8">
                                                 {data.normalizedDegree}
                                             </dd>
                                             <dt className="col-sm-4">
                                                 Branch
                                             </dt>
                                             <dd className="col-sm-8">
                                                 {data.normalizedBranch}
                                             </dd>
                                         </dl>:
                                            <dl className="row">
                                                <dt className="col-sm-4">
                                                    Name
                                                </dt>
                                                <dd className="col-sm-8">
                                                    {data.name}
                                                </dd>
                                                <dt className="col-sm-4">
                                                    Phone Number
                                                </dt>
                                                <dd className="col-sm-8">
                                                    pending
                                                </dd>
                                                <dt className="col-sm-4">
                                                    Email
                                                </dt>
                                                <dd className="col-sm-8">
                                                    {data.email}
                                                </dd>
                                                <dt className="col-sm-4">
                                                    Batch
                                                </dt>
                                                <dd className="col-sm-8">
                                                    {data.batch}
                                                </dd>
                                                <dt className="col-sm-4">
                                                    Section
                                                </dt>
                                                <dd className="col-sm-8">
                                                    {data.section}
                                                </dd>
                                                <dt className="col-sm-4">
                                                    Roll Number
                                                </dt>
                                                <dd className="col-sm-8">
                                                    {data.rollNumber}
                                                </dd>
                                                <dt className="col-sm-4">
                                                    Degree
                                                </dt>
                                                <dd className="col-sm-8">
                                                    {data.normalizedDegree}
                                                </dd>
                                                <dt className="col-sm-4">
                                                    Branch
                                                </dt>
                                                <dd className="col-sm-8">
                                                    {data.normalizedBranch}
                                                </dd>
                                            </dl>
                                        }
                                        </div>
                                        
                                    </div>

                                </div>
                            </center>
                        )
                    })
                }
            </React.Fragment>

    )
}

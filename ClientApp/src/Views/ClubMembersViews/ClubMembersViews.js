import React, { useState,useEffect } from 'react'
import { useQuery } from "react-query";
import authService from '../../components/api-authorization/AuthorizeService';
import { Link, Route, useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import { LoadingAnimation } from '../../components/LoadingAnimation/LoadingAnimation';

export function ClubMembersIndexView() {
    const navigate = useNavigate()
    const location = useLocation()
    const queryParameters = new URLSearchParams(location.search)
    const [data, setData] = useState([])
    const [clubMemberData, setClubMemberData] = useState(null)
    const [spinner, setSpinner] = useState(true);
    useEffect(() => {
        authService.getAccessToken().then(token => {
            var _data=[]
            axios.get(`clubmembers`, { 
                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            }).then((res) => {
                res.data.map((val) => {
                    axios.get(`students/${val.email}`, {
                        headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
                    }).then((response) => {
                        _data.push(response.data)
                        setData(_data)
                    })
                })
            })
            setSpinner(false)
            console.log(data)
        })
    },[])


    return (
        spinner ? <LoadingAnimation type='puff' text="Loading..." /> :
            <React.Fragment>
                <h1>Club Members</h1>
                <p style={{ textAlign: 'right' }}>
                    <Link className='btn btn-primary' to="/clubs-president-view">Back to List</Link>&nbsp;
                </p>
                <table className="table">
                    <thead>
                        <tr>
                            <th>
                                RollNumber
                            </th>
                            <th>
                                Name
                            </th>
                            <th>
                                Degree
                            </th>
                            <th>
                                Branch
                            </th>
                            <th>
                                Batch
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((val) => {
                                return (
                                    <tr key={val.email}>
                                        <td>
                                            {val.rollNumber}
                                        </td>
                                        <td>
                                            {val.name}
                                        </td>
                                        <td>
                                            {val.normalizedDegree}
                                        </td>
                                        <td>
                                            {val.normalizedBranch}
                                        </td>
                                        <td>
                                            {val.batch}
                                        </td>
                                        <td>
                                            <Link className='btn btn-warning' to={"/club-members-details-view?id=" + val.email}>Details</Link> 
                                        </td>
                                    </tr>

                                )
                            })}
                    </tbody>
                </table>
            </React.Fragment>
    )
}
export function ClubMembersDetailsView() {
    const location = useLocation()
    const [spinner, setSpinner] = useState(true);
    const [data1, setData] = useState(null)
    const queryParameters = new URLSearchParams(location.search)

    useEffect(() => {
        authService.getAccessToken().then(token => {

            axios.get(`students/${queryParameters.get('id')}`, {
                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            }).then(response => {

                setData(response.data)
                setSpinner(false)
            })
        })
    }, [])
    return (
        <React.Fragment>
            <h1>Details</h1>
            {spinner ? <LoadingAnimation type='fallinglines' text="Loading..." /> : <React.Fragment>
            <div>
                <h4>Student Details</h4>
                <hr />
                <dl className="row">
                    <dt className="col-sm-2">
                        Name
                    </dt>
                    <dd className="col-sm-10">
                        {data1.name}
                    </dd>
                    <dt className="col-sm-2">
                        Email
                    </dt>
                    <dd className="col-sm-10">
                        {data1.email}
                    </dd>
                    <dt className="col-sm-2">
                        Batch
                    </dt>
                    <dd className="col-sm-10">
                        {data1.batch}
                    </dd>
                    <dt className="col-sm-2">
                        Section
                    </dt>
                    <dd className="col-sm-10">
                        {data1.section}
                    </dd>
                    <dt className="col-sm-2">
                        Roll Number
                    </dt>
                    <dd className="col-sm-10">
                        {data1.rollNumber}
                    </dd>
                    <dt className="col-sm-2">
                        Degree
                    </dt>
                    <dd className="col-sm-10">
                        {data1.normalizedDegree}
                    </dd>
                    <dt className="col-sm-2">
                        Branch
                    </dt>
                    <dd className="col-sm-10">
                        {data1.normalizedBranch}
                    </dd>
                </dl>
            </div>
            <div>
                <Link className='btn btn-primary' to={'/club-members-index-view'}>Back to List</Link>
            </div>

        </React.Fragment>}
        </React.Fragment>
    )
}

 
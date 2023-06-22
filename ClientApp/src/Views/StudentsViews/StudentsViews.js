import React, { useEffect } from 'react'
import { useState, createContext, useContext } from "react";
import { useQuery } from "react-query";
import authService from '../../components/api-authorization/AuthorizeService';
import AuthorizeRoute from '../../components/api-authorization/AuthorizeRoute';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import { LoadingAnimation } from '../../components/LoadingAnimation/LoadingAnimation';

export function StudentsIndexView() {
    const navigate = useNavigate();
    const [data, setData] = useState(null)
    const [spinner, setSpinner] = useState(true); 
    var rows = []
    function onClickHandler(link) {
        navigate(link);
    }
    useEffect(() => {
        authService.getAccessToken().then(token => {
            axios.get('students', {
                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            }).then((response) => {
                setData(response.data)
                setSpinner(false)
            })
        })
    },[])
    if(data){
    data.map((val) => {
        rows.push(
            <tr>
                <td>
                    {val.name}
                </td>
                <td>
                    {val.email}
                </td>
                <td>
                    {val.batch}
                </td>
                <td>
                    <a className='btn btn-primary' onClick={() => onClickHandler("/students-edit-view?id=" + val.email)} >Edit</a> |&nbsp;
                    <a className='btn btn-warning' onClick={() => onClickHandler("/students-details-view?id=" + val.email)}>Details</a> |&nbsp;
                    <Link className='btn btn-danger' to='/students-delete-view'>Delete</Link>

                </td>
            </tr>

        )
    })
}



    return (
        <React.Fragment>
            <h1>Students</h1>
            <p>
                <a className='btn btn-primary' onClick={() => onClickHandler("/students-create-view")}>Create New</a>
            </p>
            <table class="table">
                <thead>
                    <tr>
                        <th>
                            Name
                        </th>
                        <th>
                            Email
                        </th>
                        <th>
                            RollNumber
                        </th>
                        <th>
                            Batch
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                {spinner?<LoadingAnimation type='fallinglines' text="Loading..."/>:rows}
                </tbody>
            </table>
        </React.Fragment>
    )
}
export function StudentsCreateView() {
    return (
        <div>StudentsCreateView</div>
    )
}
export function StudentsEditView() {
    return (
        <div>StudentsEditView</div>
    )
}
export function StudentsDetailsView() {
    const location = useLocation()
    var row=[]
    const [spinner, setSpinner] = useState(true);  
    const [data1, setData] = useState(null)
    const queryParameters = new URLSearchParams(location.search)
    async function populateStudent() {
        const token = await authService.getAccessToken();
        var response = await axios.get(`students/${queryParameters.get('id')}`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        })
        return await response.data

    }
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
    if(data1){                
    row.push(<React.Fragment>
        <div>
            <h4>Student Details</h4>
            <hr />
            <dl class="row">
                <dt class="col-sm-2">
                    Name
                </dt>
                <dd class="col-sm-10">
                    {data1.name}
                </dd>
                <dt class="col-sm-2">
                    Email
                </dt>
                <dd class="col-sm-10">
                    {data1.email}
                </dd>
                <dt class="col-sm-2">
                    Batch
                </dt>
                <dd class="col-sm-10">
                    {data1.batch}
                </dd>
                <dt class="col-sm-2">
                    Section
                </dt>
                <dd class="col-sm-10">
                    {data1.section}
                </dd>
                <dt class="col-sm-2">
                    Roll Number
                </dt>
                <dd class="col-sm-10">
                    {data1.rollNumber}
                </dd>
                <dt class="col-sm-2">
                    Degree
                </dt>
                <dd class="col-sm-10">
                    {data1.normalizedDegree}
                </dd>
                <dt class="col-sm-2">
                    Branch
                </dt>
                <dd class="col-sm-10">
                    {data1.normalizedBranch}
                </dd>
            </dl>
        </div>
        <div>
            <Link className='btn btn-warning' to={'/students-edit-view?id=' + data1.email}>Edit</Link> |&nbsp;
            <Link className='btn btn-primary' to={'/students-index-view'}>Back to List</Link>
        </div>

    </React.Fragment>
    )
    }
    return (
        <React.Fragment>
            <h1>Details</h1>
            {spinner?<LoadingAnimation type='fallinglines' text="Loading..."/>:row}
        </React.Fragment>
    )
}
export function StudentsDeleteView() {
    return (
        <div>StudentsDeleteView</div>
    )
}

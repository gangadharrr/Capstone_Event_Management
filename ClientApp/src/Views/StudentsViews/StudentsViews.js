import React, { useEffect } from 'react'
import { useState } from "react";
import { useQuery } from "react-query";
import authService from '../../components/api-authorization/AuthorizeService';
import { Link, Route, useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import { LoadingAnimation } from '../../components/LoadingAnimation/LoadingAnimation';
export function StudentsIndexView() {
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const [spinner, setSpinner] = useState(true);
    var rows = []
    useEffect(() => {
        authService.getAccessToken().then(token => {
            axios.get('students', {
                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            }).then((response) => {
                setData(response.data)
                setSpinner(false)
            })
        })
    })
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
                        {val.rollNumber}
                    </td>
                    <td>
                        {val.batch}
                    </td>
                    <td>
                        <Link className='btn btn-primary' to={"/students-edit-view?id=" + val.email} >Edit</Link> |&nbsp;
                        <Link className='btn btn-warning' to={"/students-details-view?id=" + val.email}>Details</Link> |&nbsp;
                        <button className='btn btn-danger'
                         onClick={() => { 
                            authService.getAccessToken().then(token => {
                                axios.delete(`students/${val.email}`, {
                                    headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
                                }).then((response) => {
                                    console.log(response.data);
                                    navigate("/students-index-view");
                                })
                            })
                         }}
                        >Delete</button>
    
                    </td>
                </tr>
    
            )
        })
    }
    return (
        <React.Fragment>
            <h1>Students</h1>
            <p style={{ textAlign: 'right' }}>
                <Link className='btn btn-primary' to="/students-create-view">+ Create New</Link>&nbsp;
            </p>
            <table className="table">
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
                    {spinner ? <LoadingAnimation type='fallinglines' text="Loading..." /> : rows}
                </tbody>
            </table>
        </React.Fragment>
    )
}
export function StudentsCreateView() {
    const navigate = useNavigate()
    const [data, setData] = useState({
        name: null,
        email: null,
        batch: null,
        section: null,
        rollNumber: null,
        normalizedDegree: null,
        normalizedBranch: null,
    })
    const [errors, setErrors] = useState({
        name: null,
        email: null,
        batch: null,
        section: null,
        rollNumber: null,
        normalizedDegree:null,
        normalizedBranch: null,
    })
    var sections = []
    for (var item of ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']) {
        sections.push(<option defaultValue={item}>{item}</option>)
    }
    function onChangeHandle(event) {
        var _data = data
        var _errors = errors
        if (event.target.value === '') {
            _data[event.target.id] = event.target.value
            _errors[event.target.id] = `${event.target.id} is required`
            setData(_data)
            setErrors(_errors)
        }
        else if (event.target.id === 'email') {
            let pattern = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/
            if (pattern.test(event.target.value)) {
                _data[event.target.id] = event.target.value
                _errors[event.target.id] = ''
                setData(_data)
                setErrors(_errors)
            }
            else {
                _data[event.target.id] = event.target.value
                _errors[event.target.id] = `${event.target.id} is not valid`
                setData(_data)
                setErrors(_errors)
            }
        }
        else {
            _data[event.target.id] = event.target.value
            _errors[event.target.id] = ''
            setData(_data)
            setErrors(_errors)
        }
        console.log(data)
        console.log(errors)
    }
    function submitForm() {
        if (errors.name === '' && errors.email === '' && errors.batch === '' && errors.section === '' && errors.rollNumber === '' && errors.normalizedDegree === '' && errors.normalizedBranch === '') {
            authService.getAccessToken().then(token => {
                axios.post('students', {
                    name: data.name,
                    email: data.email,
                    batch: data.batch,
                    section: data.section,
                    rollNumber: parseInt(data.rollNumber),
                    normalizedDegree: data.normalizedDegree,
                    normalizedBranch: data.normalizedBranch,
                },
                    { headers: !token ? {} : { 'Authorization': `Bearer ${token}` } }
                ).then((response) => {
                    console.log(response)
                    navigate('/students-index-view')
                }
                )
            }
            )
        }
        else {
            alert('Invalid Data Entered');
        }
    }
    return (
        <React.Fragment>
            <h1>Create</h1>

            <h4>Students</h4>
            <hr />
            <div className="row">
                <div className="col-md-4">
                        <div className="form-group">
                            <input className="form-control" id='name' placeholder="Name" onChange={onChangeHandle} required />
                            <span  className="text-danger">{errors.name}</span>
                        </div><br />
                        <div className="form-group">
                            <input id="email" className="form-control" placeholder="Email" onChange={onChangeHandle} required />
                            <span htmlFor='email' className="text-danger">{errors.email}</span>
                        </div><br />
                        <div className="form-group">
                            <input id="rollNumber" type='number' className="form-control" placeholder="Roll Number"  onChange={onChangeHandle} required />
                            <span htmlFor='rollNumber' className="text-danger">{errors.rollNumber}</span>
                        </div><br />
                        <div className="form-group">
                            <select name="section" id="section" onChange={onChangeHandle} className="form-control" required>
                                <option value="" selected disabled hidden>Select Section</option>
                                {sections}
                            </select>
                        </div><br />
                        <div className="form-group" >
                            <input id="batch" className="form-control" placeholder="Batch" onChange={onChangeHandle} required />
                            <span htmlFor='batch' className="text-danger">{errors.batch}</span>
                            <br />
                        </div>
                        <div className="form-group">
                            <input id='normalizedDegree' className="form-control" placeholder="Degree" onChange={onChangeHandle} required />
                            <span htmlFor='normalizedDegree' className="text-danger">{errors.normalizedDegree}</span>
                        </div><br />
                        <div className="form-group" >
                            <input id='normalizedBranch' className="form-control" placeholder="Branch" onChange={onChangeHandle} required />
                            <span htmlFor='normalizedBranch' className="text-danger">{errors.normalizedBranch}</span>
                            <br />
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary" onClick={submitForm}>Create</button>&nbsp;&nbsp;
                            <Link className="btn btn-warning" to={"/students-index-view"}>Back to List</Link>
                        </div>
                </div>
            </div>
        </React.Fragment>
    )
}
export function StudentsEditView() {
    return (
        <div>StudentsEditView</div>
    )
}
export function StudentsDetailsView() {
    const location = useLocation()
    var row = []
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
    if (data1) {
        row.push(<React.Fragment>
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
                <Link className='btn btn-warning' to={'/students-edit-view?id=' + data1.email}>Edit</Link> |&nbsp;
                <Link className='btn btn-primary' to={'/students-index-view'}>Back to List</Link>
            </div>

        </React.Fragment>
        )
    }
    return (
        <React.Fragment>
            <h1>Details</h1>
            {spinner ? <LoadingAnimation type='fallinglines' text="Loading..." /> : row}
        </React.Fragment>
    )
}
export function StudentsDeleteView() {
    return (
        <div>StudentsDeleteView</div>
    )
}

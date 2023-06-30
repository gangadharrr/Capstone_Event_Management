import React, { useState,useEffect } from 'react'
import { useQuery } from "react-query";
import authService from '../../components/api-authorization/AuthorizeService';
import { Link, Route, useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import { LoadingAnimation } from '../../components/LoadingAnimation/LoadingAnimation';
import { ProgressBar } from '../../components/ProgressBar/ProgressBar';
import "./StudentsViews.css"
export function StudentsIndexView() {
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const [spinner, setSpinner] = useState(true);
    const [progressBar, setProgressBar] = useState({ value: 0, status: false });
    useEffect(() => {
        authService.getAccessToken().then(token => {
            axios.get('students', {
                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            }).then((response) => {
                setData(response.data)
                setSpinner(false)
                setTimeout(() => { setProgressBar({ value: 0, status: false }) }, 1000)

            })
        })
    }, [data])

    function readCsvFile(eve) {
        if (eve.target.files.length > 0) {
            var uplodedFile = eve.target.files[0]
            var reader = new FileReader();
            reader.onloadend = function (e) {
                var jsonData = [];
                var headers = [];
                var rows = e.target.result.split("\r\n");
                for (var i = 0; i < rows.length; i++) {
                    var cells = rows[i].split(",");
                    var rowData = {};
                    for (var j = 0; j < cells.length; j++) {
                        if (i == 0) {
                            var headerName = cells[j].trim();
                            headers.push(headerName);
                        } else {
                            var key = headers[j];
                            if (key) {
                                rowData[key] = cells[j].trim();
                            }
                        }
                    }
                    if (i != 0) {
                        jsonData.push(rowData);
                    }
                }
                jsonData = JSON.parse(JSON.stringify(jsonData));
                if(headers.toString()===['name', 'email', 'batch', 'section', 'rollNumber', 'normalizedDegree', 'normalizedBranch'].toString()){
                    authService.getAccessToken().then(token => {
                        jsonData.map((studentRecord, index) => {
                            axios.post('students', studentRecord,
                                { headers: !token ? {} : { 'Authorization': `Bearer ${token}` } }
                            ).then((response) => {
                                setProgressBar({ value: parseInt(((index + 1) / jsonData.length) * 100), status: true });
                            }
                            ).catch((error) => {
                                console.log(error)
                            })
                        })
                    }
                    )
                }
                else{
                    alert('Invalid Csv File Imported')
                }
                
            }
            reader.readAsText(uplodedFile);
        }

    }
    return (
        spinner ? <LoadingAnimation type='fallinglines' text="Loading..." /> :
            <React.Fragment>
                <ProgressBar value={progressBar.value} status={progressBar.status} />
                <h1>Students</h1>
                <p style={{ textAlign: 'right' }}>
                    <label htmlFor="UploadedFile">
                        <a htmlFor="UploadedFile" className="btn btn-success">+ Add Via File(.csv)</a>
                    </label>
                    <input id="UploadedFile" name="UploadedFile" onChange={readCsvFile} type="file" accept="text/csv" hidden />&nbsp;
                    <Link className='btn btn-primary' to="/students-create-view">+ Create New</Link>&nbsp;
                    <button className='btn btn-danger' onClick={() => {

                        if (window.confirm(`Are you sure you want to delete all students?`)) {
                            data.map(
                                (val, index) => {
                                    authService.getAccessToken().then(token => {
                                        axios.delete(`students/${val.email}`, {
                                            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
                                        }).then((response) => {
                                            setProgressBar({ value: parseInt(((index + 1) / data.length) * 100), status: true });
                                        }).catch((error) => {
                                            console.log(error)
                                        })
                                    })
                                }

                            )
                        }
                    }
                }
                    >Delete All</button>
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
                                            <Link className='btn btn-primary' to={"/students-edit-view?id=" + val.email} >Edit</Link> |&nbsp;
                                            <Link className='btn btn-warning' to={"/students-details-view?id=" + val.email}>Details</Link> |&nbsp;
                                            <button className='btn btn-danger'
                                                onClick={() => {
                                                    if (window.confirm(`Are you sure you want to delete this student (` + val.email + ")?")) {
                                                        authService.getAccessToken().then(token => {
                                                            axios.delete(`students/${val.email}`, {
                                                                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
                                                            }).then((response) => {
                                                                navigate("/students-index-view");
                                                            }).catch((error) => {
                                                                console.log(error)
                                                            })
                                                        })
                                                    }
                                                }}
                                            >Delete</button>

                                        </td>
                                    </tr>

                                )
                            })}
                    </tbody>
                </table>
            </React.Fragment>
    )
}
export function StudentsCreateView() {
    const navigate = useNavigate()
    const [data, setData] = useState([{
        name: null,
        email: null,
        batch: null,
        section: null,
        rollNumber: null,
        normalizedDegree: null,
        normalizedBranch: null,
        err_name: null,
        err_email: null,
        err_batch: null,
        err_section: null,
        err_rollNumber: null,
        err_normalizedDegree: null,
        err_normalizedBranch: null
    }])

    var sections = []
    for (var item of ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']) {
        sections.push(<option defaultValue={item}>{item}</option>)
    }
    function onChangeHandle(event) {
        var _data = data[0]
        if (event.target.value === '') {
            _data[event.target.id] = event.target.value
            _data['err_' + event.target.id] = `${event.target.id} is required`
            setData([_data])
        }
        else if (event.target.id === 'email') {
            let pattern = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/
            if (pattern.test(event.target.value)) {
                _data[event.target.id] = event.target.value
                _data['err_' + event.target.id] = ''
                setData([_data])
            }
            else {
                _data[event.target.id] = event.target.value
                _data['err_' + event.target.id] = `${event.target.id} is not valid`
                setData([_data])
            }
        }
        else {
            _data[event.target.id] = event.target.value
            _data['err_' + event.target.id] = ''
            setData([_data])
        }
    }
    function submitForm() {
        if (data[0].err_name === '' && data[0].err_email === '' && data[0].err_batch === '' && data[0].err_section === '' && data[0].err_rollNumber === '' && data[0].err_normalizedDegree === '' && data[0].err_normalizedBranch === '') {
            authService.getAccessToken().then(token => {
                axios.post('students', {
                    name: data[0].name,
                    email: data[0].email.toLowerCase(),
                    batch: data[0].batch,
                    section: data[0].section,
                    rollNumber: parseInt(data[0].rollNumber),
                    normalizedDegree: data[0].normalizedDegree,
                    normalizedBranch: data[0].normalizedBranch,
                },
                    { headers: !token ? {} : { 'Authorization': `Bearer ${token}` } }
                ).then((response) => {
                    navigate('/students-index-view')
                }
                ).catch((error) => {
                    console.log(error)
                })
            }
            )
        }
        else {
            alert('Invalid Data Entered');
        }
    }
    return (
        <React.Fragment>
            {data.map((data) => {
                return (

                    <React.Fragment>
                        <h1>Create</h1>

                        <h4>Students</h4>
                        <hr />
                        <div className="row" key={data.email}>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <input className="form-control" id='name' placeholder="Name" onChange={onChangeHandle} required />
                                    <span className="text-danger">{data.err_name}</span>
                                </div><br />
                                <div className="form-group">
                                    <input id="email" className="form-control" placeholder="Email" onChange={onChangeHandle} required />
                                    <span className="text-danger">{data.err_email}</span>
                                </div><br />
                                <div className="form-group">
                                    <input id="rollNumber" type='number' className="form-control" placeholder="Roll Number" onChange={onChangeHandle} required />
                                    <span  className="text-danger">{data.err_rollNumber}</span>
                                </div><br />
                                <div className="form-group">
                                    <select name="section" id="section" onChange={onChangeHandle}  className="form-control" required>
                                        <option hidden>Select Section</option>
                                        {sections}
                                    </select>
                                </div><br />
                                <div className="form-group" >
                                    <input id="batch" className="form-control" placeholder="Batch" onChange={onChangeHandle} required />
                                    <span className="text-danger">{data.err_batch}</span>
                                    <br />
                                </div>
                                <div className="form-group">
                                    <input id='normalizedDegree' className="form-control" placeholder="Degree" onChange={onChangeHandle} required />
                                    <span className="text-danger">{data.err_normalizedDegree}</span>
                                </div><br />
                                <div className="form-group" >
                                    <input id='normalizedBranch' className="form-control" placeholder="Branch" onChange={onChangeHandle} required />
                                    <span  className="text-danger">{data.err_normalizedBranch}</span>
                                    <br />
                                </div>
                                <div className="form-group">
                                    <button className="btn btn-success" onClick={submitForm}>Create</button>&nbsp;&nbsp;
                                    <Link className="btn btn-warning" to={"/students-index-view"}>Back to List</Link>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                )

            }
            )}
        </React.Fragment>
    )
}
export function StudentsEditView() {
    const location = useLocation()
    const [spinner, setSpinner] = useState(true);
    const queryParameters = new URLSearchParams(location.search)
    const navigate = useNavigate()
    const [data, setData] = useState([{
        name: null,
        email: null,
        batch: null,
        section: null,
        rollNumber: null,
        normalizedDegree: null,
        normalizedBranch: null,
        err_name: '',
        err_email: '',
        err_batch: '',
        err_section: '',
        err_rollNumber: '',
        err_normalizedDegree: '',
        err_normalizedBranch: ''
    }])

    var sections = []
    for (var item of ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']) {
        sections.push(<option defaultValue={item}>{item}</option>)
    }
    function onChangeHandle(event) {
        var _data = data[0]
        if (event.target.value === '') {
            _data[event.target.id] = event.target.value
            _data['err_' + event.target.id] = `${event.target.id} is required`
            setData([_data])
        }
        else if (event.target.id === 'email') {
            let pattern = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/
            if (pattern.test(event.target.value)) {
                _data[event.target.id] = event.target.value
                _data['err_' + event.target.id] = ''
                setData([_data])
            }
            else {
                _data[event.target.id] = event.target.value
                _data['err_' + event.target.id] = `${event.target.id} is not valid`
                setData([_data])
            }
        }
        else {
            _data[event.target.id] = event.target.value
            _data['err_' + event.target.id] = ''
            setData([_data])
        }
    }
    function submitForm() {
        if (data[0].err_name === '' && data[0].err_email === '' && data[0].err_batch === '' && data[0].err_section === '' && data[0].err_rollNumber === '' && data[0].err_normalizedDegree === '' && data[0].err_normalizedBranch === '') {
            authService.getAccessToken().then(token => {
                axios.put(`students/${queryParameters.get('id')}`, {
                    name: data[0].name,
                    email: data[0].email.toLowerCase(),
                    batch: data[0].batch,
                    section: data[0].section,
                    rollNumber: parseInt(data[0].rollNumber),
                    normalizedDegree: data[0].normalizedDegree,
                    normalizedBranch: data[0].normalizedBranch,
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

    useEffect(() => {
        authService.getAccessToken().then(token => {

            axios.get(`students/${queryParameters.get('id')}`, {
                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            }).then(response => {
                let _data = response.data
                _data.err_name = ''
                _data.err_email = ''
                _data.err_batch = ''
                _data.err_section = ''
                _data.err_rollNumber = ''
                _data.err_normalizedDegree = ''
                _data.err_normalizedBranch = ''
                setData([_data])
                setSpinner(false)
            })
        })
    }, [])

    return (
        <React.Fragment>
            {data.map((data) => {
                return (spinner ? <LoadingAnimation type='fallinglines' text="Loading..." /> :

                    <React.Fragment>
                        <h1>Edit</h1>

                        <h4>Students</h4>
                        <hr />
                        <div className="row" key={data.email}>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <input className="form-control" id='name' placeholder="Name" value={data.name} onChange={onChangeHandle} required />
                                    <span className="text-danger">{data.err_name}</span>
                                </div><br />
                                <div className="form-group">
                                    <select name="section" id="section" onChange={onChangeHandle} value={data.section} className="form-control" required>
                                        {sections}
                                    </select>
                                </div><br />
                                <div className="form-group" >
                                    <input id="batch" className="form-control" placeholder="Batch" value={data.batch} onChange={onChangeHandle} required />
                                    <span htmlFor='batch' className="text-danger">{data.err_batch}</span>
                                    <br />
                                </div>
                                <div className="form-group">
                                    <input id='normalizedDegree' className="form-control" placeholder="Degree" value={data.normalizedDegree} onChange={onChangeHandle} required />
                                    <span htmlFor='normalizedDegree' className="text-danger">{data.err_normalizedDegree}</span>
                                </div><br />
                                <div className="form-group" >
                                    <input id='normalizedBranch' className="form-control" placeholder="Branch" value={data.normalizedBranch} onChange={onChangeHandle} required />
                                    <span htmlFor='normalizedBranch' className="text-danger">{data.err_normalizedBranch}</span>
                                    <br />
                                </div>
                                <div className="form-group">
                                    <button className="btn btn-success" onClick={submitForm}>Save</button>&nbsp;&nbsp;
                                    <Link className="btn btn-warning" to={"/students-index-view"}>Back to List</Link>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                )

            }
            )}
        </React.Fragment>
    )
}
export function StudentsDetailsView() {
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
                <Link className='btn btn-warning' to={'/students-edit-view?id=' + data1.email}>Edit</Link>&nbsp;
                <Link className='btn btn-primary' to={'/students-index-view'}>Back to List</Link>
            </div>

        </React.Fragment>}
        </React.Fragment>
    )
}


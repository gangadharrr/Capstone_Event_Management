import React, { useState, useEffect } from 'react'
import axios from "axios";
import authService from '../../components/api-authorization/AuthorizeService';
import { Link, Route, useLocation, useNavigate } from 'react-router-dom';
import { LoadingAnimation } from '../../components/LoadingAnimation/LoadingAnimation';
import { ProgressBar } from '../../components/ProgressBar/ProgressBar';

export function ProfessorsIndexView() {
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const [spinner, setSpinner] = useState(true);
    const [progressBar, setProgressBar] = useState({ value: 0, status: false });
    useEffect(() => {
        authService.getAccessToken().then(token => {
            axios.get('professors', {
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
                if (headers.toString() === ['professorId', 'name', 'email', 'designation', 'normalizedDegree', 'normalizedBranch'].toString()) {
                    authService.getAccessToken().then(token => {
                        authService.getUser().then(user => {
                            jsonData.map((professorRecord, index) => {
                                axios.post(`professors/${user.name}`, professorRecord,
                                    { headers: !token ? {} : { 'Authorization': `Bearer ${token}` } }
                                ).then((response) => {
                                    setProgressBar({ value: parseInt(((index + 1) / jsonData.length) * 100), status: true });
                                }
                                ).catch((error) => {
                                    console.log(error)
                                })
                            })
                        })
                    }
                    )
                }
                else {
                    alert('Invalid Csv File Imported')
                }

            }
            reader.readAsText(uplodedFile);
        }

    }

    return (
        spinner ? <LoadingAnimation type='puff' text="Loading..." /> :
            <React.Fragment>
                <ProgressBar value={progressBar.value} status={progressBar.status} />
                <h1>Professors</h1>
                <p style={{ textAlign: 'right' }}>
                    <label htmlFor="UploadedFile">
                        <a htmlFor="UploadedFile" className="btn btn-success">+ Add Via File(.csv)</a>
                    </label>
                    <input id="UploadedFile" name="UploadedFile" onChange={readCsvFile} type="file" accept="text/csv" hidden />&nbsp;
                    <Link className='btn btn-primary' to="/professors-create-view">+ Create New</Link>&nbsp;
                    <button className='btn btn-danger' onClick={() => {

                        if (window.confirm(`Are you sure you want to delete all professors?`)) {
                            data.map(
                                (val, index) => {
                                    authService.getAccessToken().then(token => {
                                        authService.getUser().then(user =>{
                                            axios.delete(`professors/${user.name}/${val.email}`, {
                                                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
                                            }).then((response) => {
                                                setProgressBar({ value: parseInt(((index + 1) / data.length) * 100), status: true });
                                            }).catch((error) => {
                                                console.log(error)
                                            })
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
                                ProfessorId
                            </th>
                            <th>
                                Name
                            </th>
                            <th>
                                Email
                            </th>
                            <th>
                                Designation
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
                                            {val.professorId}
                                        </td>
                                        <td>
                                            {val.name}
                                        </td>
                                        <td>
                                            {val.email}
                                        </td>
                                        <td>
                                            {val.designation}
                                        </td>
                                        <td>
                                            <Link className='btn btn-primary' to={"/professors-edit-view?id=" + val.email} >Edit</Link> |&nbsp;
                                            <Link className='btn btn-warning' to={"/professors-details-view?id=" + val.email}>Details</Link> |&nbsp;
                                            <button className='btn btn-danger'
                                                onClick={() => {
                                                    if (window.confirm(`Are you sure you want to delete this professor (` + val.email + ")?")) {
                                                        authService.getAccessToken().then(token => {
                                                            authService.getUser().then(user =>{
                                                                axios.delete(`professors/${user.name}/${val.email}`, {
                                                                    headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
                                                                }).then((response) => {
                                                                    navigate("/professors-index-view");
                                                                }).catch((error) => {
                                                                    console.log(error)
                                                                })
                                                            })
                                                        })
                                                    }
                                                }}
                                            >Delete</button>
                                        </td>
                                    </tr>)
                            })
                        }
                    </tbody>
                </table>
            </React.Fragment>
    )
}
export function ProfessorsCreateView() {
    const navigate = useNavigate()
    const [data, setData] = useState([{
        professorId: null,
        name: null,
        email: null,
        designation: null,
        normalizedDegree: null,
        normalizedBranch: null,
        err_professorId: null,
        err_name: null,
        err_email: null,
        err_designation: null,
        err_normalizedDegree: null,
        err_normalizedBranch: null
    }])
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
        if (data[0].err_name === '' && data[0].err_email === '' && data[0].err_designation === '' && data[0].err_professorId === ''  && data[0].err_normalizedDegree === '' && data[0].err_normalizedBranch === '') {
            authService.getAccessToken().then(token => {
                authService.getUser().then(user => {
                    axios.post(`professors/${user.name}`, {
                        professorId: data[0].professorId,
                        name: data[0].name,
                        email: data[0].email.toLowerCase(),
                        designation: data[0].designation,
                        normalizedDegree: data[0].normalizedDegree,
                        normalizedBranch: data[0].normalizedBranch,
                    },
                        { headers: !token ? {} : { 'Authorization': `Bearer ${token}` } }
                    ).then((response) => {
                        navigate('/professors-index-view')
                    }
                    ).catch((error) => {
                        console.log(error)
                    })
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

                        <h4>Professors</h4>
                        <hr />
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <input id="professorId" placeholder="ProfessorId" className="form-control" onChange={onChangeHandle} required />
                                    <span className="text-danger">{data.err_professorId}</span>
                                </div><br />
                                <div className="form-group">
                                    <input id="name" placeholder="Name" onChange={onChangeHandle} className="form-control" required />
                                    <span className="text-danger">{data.err_name}</span>
                                </div><br />
                                <div className="form-group">
                                    <input id="email" placeholder="Email" onChange={onChangeHandle} className="form-control" required />
                                    <span className="text-danger">{data.err_email}</span>
                                </div><br />
                                <div className="form-group">
                                    <input id="designation" placeholder="Designation" onChange={onChangeHandle} className="form-control" required />
                                    <span className="text-danger">{data.err_designation}</span>
                                </div><br />
                                <div className="form-group">
                                    <input id="normalizedDegree" placeholder="Degree" onChange={onChangeHandle} className="form-control" required />
                                    <span className="text-danger">{data.err_normalizedDegree}</span>
                                </div><br />
                                <div className="form-group">
                                    <input id="normalizedBranch" placeholder="Branch" onChange={onChangeHandle} className="form-control" required />
                                    <span className="text-danger">{data.err_normalizedBranch}</span>
                                </div><br />
                                <div className="form-group">
                                    <button className="btn btn-success" onClick={submitForm}>Create</button>&nbsp;&nbsp;
                                    <Link className="btn btn-warning" to={"/professors-index-view"}>Back to List</Link>
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
export function ProfessorsEditView() {
    const location = useLocation()
    const [spinner, setSpinner] = useState(true);
    const queryParameters = new URLSearchParams(location.search)
    const navigate = useNavigate()
    const [data, setData] = useState([{
        professorId: null,
        name: null,
        email: null,
        designation: null,
        normalizedDegree: null,
        normalizedBranch: null,
        err_professorId: null,
        err_name: null,
        err_email: null,
        err_designation: null,
        err_normalizedDegree: null,
        err_normalizedBranch: null
    }])
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
        if (data[0].err_name === '' && data[0].err_email === '' && data[0].err_designation === '' && data[0].err_professorId === ''  && data[0].err_normalizedDegree === '' && data[0].err_normalizedBranch === '') {
            authService.getAccessToken().then(token => {
                authService.getUser().then(user => {
                    axios.put(`professors/${user.name}/${queryParameters.get('id')}` , {
                        professorId: data[0].professorId,
                        name: data[0].name,
                        email: data[0].email.toLowerCase(),
                        designation: data[0].designation,
                        normalizedDegree: data[0].normalizedDegree,
                        normalizedBranch: data[0].normalizedBranch,
                    },
                        { headers: !token ? {} : { 'Authorization': `Bearer ${token}` } }
                    ).then((response) => {
                        navigate('/professors-index-view')
                    }
                    ).catch((error) => {
                        console.log(error)
                    })
                })
            }
            )
        }
        else {
            alert('Invalid Data Entered');
        }
    }
    useEffect(() => {
        authService.getAccessToken().then(token => {

            axios.get(`professors/${queryParameters.get('id')}`, {
                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            }).then(response => {
                let _data = response.data
                _data.err_professorId = ''
                _data.err_name = ''
                _data.err_email = ''
                _data.err_designation = ''
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

                        <h4>Professors</h4>
                        <hr />
                        <div className="row" key={data.email}>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <input id="professorId" placeholder="ProfessorId" className="form-control" onChange={onChangeHandle} value={data.professorId} required />
                                    <span className="text-danger">{data.err_professorId}</span>
                                </div><br />
                                <div className="form-group">
                                    <input id="name" placeholder="Name" onChange={onChangeHandle} className="form-control" value={data.name} required />
                                    <span className="text-danger">{data.err_name}</span>
                                </div><br />
                                <div className="form-group">
                                    <input id="email" placeholder="Email" onChange={onChangeHandle} className="form-control" value={data.email} required />
                                    <span className="text-danger">{data.err_email}</span>
                                </div><br />
                                <div className="form-group">
                                    <input id="designation" placeholder="Designation" onChange={onChangeHandle} className="form-control" value={data.designation} required />
                                    <span className="text-danger">{data.err_designation}</span>
                                </div><br />
                                <div className="form-group">
                                    <input id="normalizedDegree" placeholder="Degree" onChange={onChangeHandle} className="form-control" value={data.normalizedDegree} required />
                                    <span className="text-danger">{data.err_normalizedDegree}</span>
                                </div><br />
                                <div className="form-group">
                                    <input id="normalizedBranch" placeholder="Branch" onChange={onChangeHandle} className="form-control" value={data.normalizedBranch} required />
                                    <span className="text-danger">{data.err_normalizedBranch}</span>
                                </div><br />
                                <div className="form-group">
                                    <button className="btn btn-success" onClick={submitForm}>Save</button>&nbsp;&nbsp;
                                    <Link className="btn btn-warning" to={"/professors-index-view"}>Back to List</Link>
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
export function ProfessorsDetailsView() {
    const location = useLocation()
    const [spinner, setSpinner] = useState(true);
    const [data1, setData] = useState(null)
    const queryParameters = new URLSearchParams(location.search)

    useEffect(() => {
        authService.getAccessToken().then(token => {

            axios.get(`professors/${queryParameters.get('id')}`, {
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
            <h4>Professors Details</h4>
            <hr />
            <dl className="row">
                <dt className="col-sm-2">
                    ProfessorId
                </dt>
                <dd className="col-sm-10">
                    {data1.professorId}
                </dd>
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
                    Designation
                </dt>
                <dd className="col-sm-10">
                    {data1.designation}
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
            <Link className='btn btn-warning' to={'/professors-edit-view?id=' + data1.email}>Edit</Link>&nbsp;
            <Link className='btn btn-primary' to={'/professors-index-view'}>Back to List</Link>
        </div>

    </React.Fragment>}
    </React.Fragment>
    )
}

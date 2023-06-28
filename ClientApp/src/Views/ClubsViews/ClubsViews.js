import React, { useState, useEffect } from 'react'
import axios from "axios";
import authService from '../../components/api-authorization/AuthorizeService';
import { Link, Route, useLocation, useNavigate } from 'react-router-dom';
import { LoadingAnimation } from '../../components/LoadingAnimation/LoadingAnimation';
import { ProgressBar } from '../../components/ProgressBar/ProgressBar';
import Select from "react-select";


export function ClubsIndexView() {
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const [spinner, setSpinner] = useState(true);
    useEffect(() => {
        authService.getAccessToken().then(token => {
            axios.get('clubs', {
                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            }).then((response) => {
                setData(response.data)
                setSpinner(false)
            }).catch((error) => {
                console.log(error.response.data);
            })
        })
    }, [data])
    return (
        spinner ? <LoadingAnimation type='fallinglines' text="Loading..." /> :
            <React.Fragment>
                <h1>Clubs</h1>

                <p style={{ textAlign: 'right' }}>

                    <Link className='btn btn-primary' to="/clubs-create-view">+ Create New</Link>&nbsp;

                </p>
                <table className="table">
                    <thead>
                        <tr>
                            <th>
                                ClubId
                            </th>
                            <th>
                                Club Name
                            </th>
                            <th>
                                ClubEmail
                            </th>
                            <th>
                                Price
                            </th>
                            <th>
                                Available Seats
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((val) => {
                            return (
                                <tr key={val.clubId}>
                                    <td>
                                        {val.clubId}
                                    </td>
                                    <td>
                                        {val.name}
                                    </td>
                                    <td>
                                        {val.clubEmail}
                                    </td>
                                    <td>
                                        {val.price}
                                    </td>
                                    <td>
                                        {val.availableSeats}
                                    </td>
                                    <td>
                                        <Link className='btn btn-primary' to={"/clubs-edit-view?id=" + val.clubId} >Edit</Link> |&nbsp;
                                        <Link className='btn btn-warning' to={"/clubs-details-view?id=" + val.clubId}>Details</Link> |&nbsp;
                                        <button className='btn btn-danger'
                                            onClick={() => {
                                                if (window.confirm(`Are you sure you want to delete this club (` + val.name + ")?")) {
                                                    authService.getAccessToken().then(token => {
                                                        axios.delete(`clubs/${val.clubId}`, {
                                                            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
                                                        }).then((response) => {
                                                            navigate("/clubs-index-view");
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
export function ClubsCreateView() {
    const [presidentOptions, setPresidentOptions] = useState([]);
    const [professorOptions, setProfessorOptions] = useState([]);
    useEffect(() => {
        authService.getAccessToken().then(token => {
            axios.get('students', {
                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            }).then((response) => {
                let _list = []
                response.data.map((val) => {
                    _list.push({ value: val.email, label: val.email })
                }
                )
                setPresidentOptions(_list)
            })
            axios.get('professors', {
                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            }).then((response) => {
                let _list = []
                response.data.map((val) => {
                    _list.push({ value: val.email, label: val.email })
                }
                )
                setProfessorOptions(_list)
            })
        })
    }, [])

    const navigate = useNavigate()
    const [data, setData] = useState([{
        name: null,
        description: null,
        president: null,
        professorIncharge: null,
        clubEmail: null,
        price: null,
        availableSeats: null,
        clubPicture: null,
        err_name: null,
        err_description: null,
        err_president: null,
        err_professorIncharge: null,
        err_clubEmail: null,
        err_price: null,
        err_availableSeats: null,
        err_clubPicture: null
    }])
    function onChangePresident(event) {
        var _data = data[0]
        if (event.value === '') {
            _data['president'] = event.value
            _data['err_president'] = `President Email is required`
            setData([_data])
        }
        else {
            _data['president'] = event.value
            _data['err_president'] = ''
            setData([_data])
        }
    }
    function onChangeProfessor(event) {
        var _data = data[0]
        if (event.value === '') {
            _data['professorIncharge'] = event.value
            _data['err_professorIncharge'] = `Professor Incharge Email is required`
            setData([_data])
        }
        else {
            _data['professorIncharge'] = event.value
            _data['err_professorIncharge'] = ''
            setData([_data])
        }
    }
    function onChangeHandle(event) {
        var _data = data[0]
        if (event.target.value === '') {
            _data[event.target.id] = event.target.value
            _data['err_' + event.target.id] = `${event.target.id} is required`
            setData([_data])
        }
        else if (event.target.id === 'clubEmail') {
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

    function readImageFile(eve) {
        if (eve.target.files.length > 0) {
            var uplodedFile = eve.target.files[0]
            var reader = new FileReader();
            reader.onloadend = function (e) {
                let _data = data[0]

                _data.clubPicture = e.target.result
                _data['err_clubPicture'] = ''
                setData([_data])
            }
            reader.readAsDataURL(uplodedFile);
        }
        console.log(data);
    }
    function submitForm() {
        if (data[0].err_name === '' && data[0].err_clubEmail === '' && data[0].err_president === '' && data[0].err_professorIncharge === '' && data[0].err_description === '' && data[0].err_price === '' && data[0].err_availableSeats === '') {
            authService.getAccessToken().then(token => {
                axios.post('clubs', {
                    clubId: 0,
                    name: data[0].name,
                    description: data[0].description,
                    president: data[0].president,
                    professorIncharge: data[0].professorIncharge,
                    clubEmail: data[0].clubEmail,
                    price: parseFloat(data[0].price),
                    availableSeats: parseInt(data[0].availableSeats),
                    clubPicture: data[0].clubPicture,
                    students: {
                        name: "string",
                        email: "string",
                        batch: "string",
                        section: "string",
                        rollNumber: 0,
                        normalizedDegree: "string",
                        normalizedBranch: "string"
                    },
                    professors: {
                        professorId: "string",
                        name: "string",
                        email: "string",
                        designation: "string",
                        normalizedDegree: "string",
                        normalizedBranch: "string"
                    }
                },
                    { headers: !token ? {} : { 'Authorization': `Bearer ${token}` } }
                ).then((response) => {
                    navigate('/clubs-index-view')
                }
                ).catch((error) => {
                    console.log(error.response.data);
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
                        <h4>Clubs</h4>
                        <hr />
                        <div className="row" key={data.clubId}>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <input id="name" className="form-control" placeholder='Club Name' onChange={onChangeHandle} required />
                                    <span className="text-danger">{data.err_name}</span>
                                </div><br />
                                <div className="form-group">
                                    <textarea id="description" className="form-control" placeholder='Club Description' onChange={onChangeHandle} required ></textarea>
                                    <span className="text-danger">{data.err_description}</span>
                                </div><br />
                                <div className="form-group">
                                    <Select id="president" options={presidentOptions} placeholder='President Email' onChange={onChangePresident} required />
                                    <span className="text-danger">{data.err_president}</span>
                                </div><br />
                                <div className="form-group">
                                    <Select id="professorIncharge" options={professorOptions} placeholder='Professor Incharge Email' onChange={onChangeProfessor} required />
                                    <span className="text-danger">{data.err_professorIncharge}</span>
                                </div><br />
                                <div className="form-group">
                                    <input id="clubEmail" className="form-control" placeholder='Club Email' onChange={onChangeHandle} required />
                                    <span className="text-danger">{data.err_clubEmail}</span>
                                </div><br />
                                <div className="form-group">
                                    <input type='number' step={'.01'} id="price" className="form-control" placeholder='Price' min="0" onChange={onChangeHandle} required />
                                    <span className="text-danger">{data.err_price}</span>
                                </div><br />
                                <div className="form-group">
                                    <input type='number' id="availableSeats" className="form-control" placeholder='Available Seats' onChange={onChangeHandle} min="1" required />
                                    <span className="text-danger">{data.err_availableSeats}</span>
                                </div><br />
                                <div className="form-group">
                                    <label style={{ fontWeight: 'bold' }}>Club Display Picture</label>
                                    <label htmlFor="image-input">
                                        <img type="image" src="https://res.cloudinary.com/dujyzevpx/image/upload/v1687345453/Images/Edit-Button_ybm8jc.png" alt="Edit Button" height="50px" width="50px" />
                                    </label>
                                    <input id="image-input" type="file" accept="image/*" onChange={readImageFile} height="10px" width="10px" hidden />
                                    <img src={data.clubPicture} />
                                </div>
                                <br />
                                
                                <div className="form-group">
                                    <button className="btn btn-success" onClick={submitForm}>Create</button>&nbsp;&nbsp;
                                    <Link className="btn btn-warning" to={"/clubs-index-view"}>Back to List</Link>
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
export function ClubsEditView() {
    const [presidentOptions, setPresidentOptions] = useState([]);
    const [professorOptions, setProfessorOptions] = useState([]);
    const [clubPictureUrl, setClubPictureUrl] = useState();
    useEffect(() => {
        authService.getAccessToken().then(token => {
            axios.get('students', {
                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            }).then((response) => {
                let _list = []
                response.data.map((val) => {
                    _list.push({ value: val.email, label: val.email })
                }
                )
                setPresidentOptions(_list)
            })
            axios.get('professors', {
                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            }).then((response) => {
                let _list = []
                response.data.map((val) => {
                    _list.push({ value: val.email, label: val.email })
                }
                )
                setProfessorOptions(_list)
            })
        })
    }, [])

    const location = useLocation()
    const [spinner, setSpinner] = useState(true);
    const queryParameters = new URLSearchParams(location.search)
    const navigate = useNavigate()
    const [data, setData] = useState([{
        name: null,
        description: null,
        president: null,
        professorIncharge: null,
        clubEmail: null,
        price: null,
        availableSeats: null,
        clubPicture: null,
        err_name: null,
        err_description: null,
        err_president: null,
        err_professorIncharge: null,
        err_clubEmail: null,
        err_price: null,
        err_availableSeats: null,
        err_clubPicture: null
    }])
    useEffect(() => {
        authService.getAccessToken().then(token => {
            axios.get(`clubs/${queryParameters.get('id')}`, {
                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            }).then((response) => {
                let _data = response.data
                _data.err_name = ''
                _data.err_description = ''
                _data.err_president = ''
                _data.err_professorIncharge = ''
                _data.err_clubEmail = ''
                _data.err_price = ''
                _data.err_availableSeats = ''
                _data.err_clubPicture = ''
                setData([_data])
                setSpinner(false)
            })
        })
    }, [])
    function onChangePresident(event) {
        var _data = data[0]
        if (event.value === '') {
            _data['president'] = event.value
            _data['err_president'] = `President Email is required`
            setData([_data])
        }
        else {
            _data['president'] = event.value
            _data['err_president'] = ''
            setData([_data])
        }
    }
    function onChangeProfessor(event) {
        var _data = data[0]
        if (event.value === '') {
            _data['professorIncharge'] = event.value
            _data['err_professorIncharge'] = `Professor Incharge Email is required`
            setData([_data])
        }
        else {
            _data['professorIncharge'] = event.value
            _data['err_professorIncharge'] = ''
            setData([_data])
        }
    }
    function onChangeHandle(event) {
        var _data = data[0]
        if (event.target.value === '') {
            _data[event.target.id] = event.target.value
            _data['err_' + event.target.id] = `${event.target.id} is required`
            setData([_data])
        }
        else if (event.target.id === 'clubEmail') {
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
    function readImageFile(eve) {
        if (eve.target.files.length > 0) {
            var uplodedFile = eve.target.files[0]
            var reader = new FileReader();
            reader.onloadend = function (e) {
                console.log(e);
                let _data = data[0]
                _data.clubPicture = e.target.result
                _data['err_clubPicture'] = ''
                setData([_data])
            }
            reader.readAsDataURL(uplodedFile);
        }
    }
    function submitForm() {
        if (data[0].err_name === '' && data[0].err_clubEmail === '' && data[0].err_president === '' && data[0].err_professorIncharge === '' && data[0].err_description === '' && data[0].err_price === '' && data[0].err_availableSeats === '') {
            authService.getAccessToken().then(token => {
                axios.put(`clubs/${queryParameters.get('id')}`, {
                    clubId: data[0].clubId,
                    name: data[0].name,
                    description: data[0].description,
                    president: data[0].president,
                    professorIncharge: data[0].professorIncharge,
                    clubEmail: data[0].clubEmail,
                    price: parseFloat(data[0].price),
                    availableSeats: parseInt(data[0].availableSeats),
                    clubPicture:data[0].clubPicture,
                    students: {
                        name: "string",
                        email: "string",
                        batch: "string",
                        section: "string",
                        rollNumber: 0,
                        normalizedDegree: "string",
                        normalizedBranch: "string"
                    },
                    professors: {
                        professorId: "string",
                        name: "string",
                        email: "string",
                        designation: "string",
                        normalizedDegree: "string",
                        normalizedBranch: "string"
                    }
                },
                    { headers: !token ? {} : { 'Authorization': `Bearer ${token}` } }
                ).then((response) => {
                    navigate('/clubs-index-view')
                }
                ).catch((error) => {
                    console.log(error.response.data);
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
                    spinner ? <LoadingAnimation type='fallinglines' text="Loading..." /> :
                        <React.Fragment>
                            <h1>Edit</h1>
                            <h4>Clubs</h4>
                            <hr />
                            <div className="row" key={data.clubId}>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <input id="name" className="form-control" placeholder='Club Name' onChange={onChangeHandle} value={data.name} required />
                                        <span className="text-danger">{data.err_name}</span>
                                    </div><br />
                                    <div className="form-group">
                                        <textarea id="description" className="form-control" placeholder='Club Description' onChange={onChangeHandle} value={data.description} required ></textarea>
                                        <span className="text-danger">{data.err_description}</span>
                                    </div><br />
                                    <div className="form-group">
                                        <Select id="president" options={presidentOptions} placeholder='President Email' onChange={onChangePresident} defaultValue={{ label: data.president, value: data.president }} required />
                                        <span className="text-danger">{data.err_president}</span>
                                    </div><br />
                                    <div className="form-group">
                                        <Select id="professorIncharge" options={professorOptions} placeholder='Professor Incharge Email' onChange={onChangeProfessor} defaultValue={{ label: data.professorIncharge, value: data.professorIncharge }} required />
                                        <span className="text-danger">{data.err_professorIncharge}</span>
                                    </div><br />
                                    <div className="form-group">
                                        <input id="clubEmail" className="form-control" placeholder='Club Email' onChange={onChangeHandle} value={data.clubEmail} required />
                                        <span className="text-danger">{data.err_clubEmail}</span>
                                    </div><br />
                                    <div className="form-group">
                                        <input type='number' step={'.01'} id="price" className="form-control" placeholder='Price' min="0" onChange={onChangeHandle} value={data.price} required />
                                        <span className="text-danger">{data.err_price}</span>
                                    </div><br />
                                    <div className="form-group">
                                        <input type='number' id="availableSeats" className="form-control" placeholder='Available Seats' onChange={onChangeHandle} min="1" value={data.availableSeats} required />
                                        <span className="text-danger">{data.err_availableSeats}</span>
                                    </div><br />
                                    <div className="form-group">
                                        <label style={{ fontWeight: 'bold' }}>Club Display Picture</label>
                                        <label for="image-input">
                                            <img type="image" src="https://res.cloudinary.com/dujyzevpx/image/upload/v1687345453/Images/Edit-Button_ybm8jc.png" alt="Edit Button" height="50px" width="50px" />
                                        </label>

                                        <input id="image-input" type="file" accept="image/*" onChange={readImageFile} height="10px" width="10px" hidden />
                                        <img src={data.clubPicture} />
                                    </div><br />
                                    <div className="form-group">
                                        <button className="btn btn-success" onClick={submitForm}>Save</button>&nbsp;&nbsp;
                                        <Link className="btn btn-warning" to={"/clubs-index-view"}>Back to List</Link>
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
export function ClubsDetailsView() {
    const location = useLocation()
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState(null)
    const queryParameters = new URLSearchParams(location.search)
    useEffect(() => {
        authService.getAccessToken().then(token => {

            axios.get(`clubs/${queryParameters.get('id')}`, {
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
                    <h4>Clubs</h4>
                    <hr />
                    <dl className="row">
                        <dt className="col-sm-3">
                            Club Picture
                        </dt>
                        <dd className="col-sm-9">
                            <img src={data.clubPicture} alt="" />
                        </dd>
                        <dt className="col-sm-3">
                            ClubId
                        </dt>
                        <dd className="col-sm-9">
                            {data.clubId}
                        </dd>
                        <dt className="col-sm-3">
                            Club Name
                        </dt>
                        <dd className="col-sm-9">
                            {data.name}
                        </dd>
                        <dt className="col-sm-3">
                            Description
                        </dt>
                        <dd className="col-sm-9">
                            {data.description}
                        </dd>
                        <dt className="col-sm-3">
                            ClubEmail
                        </dt>
                        <dd className="col-sm-9">
                            {data.clubEmail}
                        </dd>
                        <dt className="col-sm-3">
                            President Email
                        </dt>
                        <dd className="col-sm-9">
                            {data.president}
                        </dd>
                        <dt className="col-sm-3">
                            Professor Incharge Email
                        </dt>
                        <dd className="col-sm-9">
                            {data.professorIncharge}
                        </dd>
                        <dt className="col-sm-3">
                            Price
                        </dt>
                        <dd className="col-sm-9">
                            {data.price}
                        </dd>
                        <dt className="col-sm-3">
                            AvailableSeats
                        </dt>
                        <dd className="col-sm-9">
                            {data.availableSeats}
                        </dd>
                    </dl>
                </div>
                <div>
                    <Link className='btn btn-warning' to={'/clubs-edit-view?id=' + data.clubId}>Edit</Link>&nbsp;
                    <Link className='btn btn-primary' to={'/clubs-index-view'}>Back to List</Link>
                </div>
            </React.Fragment>}
        </React.Fragment>
    )
}
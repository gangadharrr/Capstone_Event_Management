import React, { useState, useEffect } from 'react'
import axios from "axios";
import authService from '../../components/api-authorization/AuthorizeService';
import { Link, Route, useLocation, useNavigate } from 'react-router-dom';
import { LoadingAnimation } from '../../components/LoadingAnimation/LoadingAnimation';
import "./CollegeEventsViews.css"

export function CollegeEventsIndexView() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [spinner, setSpinner] = useState(false);
  return (
    spinner ? <LoadingAnimation type='puff' text="Loading..." /> :
      <React.Fragment>
        <h1>Index</h1>
        <p style={{ textAlign: 'right' }}>
          <Link className='btn btn-primary' to="/college-events-create-view">+ Create New</Link>&nbsp;
        </p>
        <table class="table">
          <thead>
            <tr>
              <th>
                Event Name
              </th>
              <th>
                Origanizing Club
              </th>
              <th>
                ModeOfEvent
              </th>
              <th>
                Date Of Event
              </th>
              <th>
                AvailableSeats
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            @foreach (var item in Model) {
              <tr>
                <td>
                  Name
                </td>
                <td>
                  ResourcePerson
                </td>
                <td>
                  ModeOfEvent
                </td>
                <td>
                  StartDateTimeOfEvent
                </td>
                <td>
                  AvailableSeats
                </td>
                <td>
                  <a asp-action="Edit" asp-route-id="@item.EventId">Edit</a> |
                  <a asp-action="Details" asp-route-id="@item.EventId">Details</a> |
                  <a asp-action="Delete" asp-route-id="@item.EventId">Delete</a>
                </td>
              </tr>
            }
          </tbody>
        </table>

      </React.Fragment>
  )
}
export function CollegeEventsCreateView() {
  const [data, setData] = useState([
    {
      eventId: 0,
      clubId: 0,
      name: null,
      resourcePerson: null,
      price: 0,
      discountPrice: 0,
      modeOfEvent: null,
      startDateTimeOfEvent: null,
      endDateTimeOfEvent: null,
      lastDayToRegister: null,
      posterUrl: null,
      accessLevel: null,
      venue: null,
      availableSeats: 0,
    }
  ])
  return (
    <React.Fragment>
      {data.map((data) => {
        return (
          <React.Fragment>
            <h1>Create</h1>
            <h4>CollegeEvents</h4>
            <hr />
            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <select id="ClubId" class="form-control" asp-items="ViewBag.ClubId"></select>
                </div><br />
                <div class="form-group">
                  <input id="name" placeholder="Event Name" class="form-control" />
                  <span htmlFor="name" class="text-danger"></span>
                </div><br />
                <div class="form-group">
                  <textarea id="resourcePerson" placeholder="Resource Person Details" class="form-control" ></textarea>
                  <span htmlFor="resourcePerson" class="text-danger"></span>
                </div><br />
                <div class="form-group">
                  <input type='number' step={'.01'} id="price" className="form-control" placeholder='Price' min="0" required />
                  <span htmlFor="price" class="text-danger"></span>
                </div><br />
                <div class="form-group">
                  <input type='number' step={'.01'} id="discountPrice" className="form-control" placeholder='Discount Price' min="0" required />
                  <span htmlFor="discountPrice" class="text-danger"></span>
                </div><br />
              </div>
              <div class="col-md-4">
                <div class="form-group">

                  <input id="modeOfEvent" placeholder='Mode Of Event' class="form-control" />
                  <span htmlFor="modeOfEvent" class="text-danger"></span>
                </div><br />
                <div class="form-group">
                  <label class="control-label">Starting Date and Time of Event</label>
                  <input id="startDateTimeOfEvent" type="datetime-local" class="form-control" />
                  <span htmlFor="startDateTimeOfEvent" class="text-danger"></span>
                </div><br />
                <div class="form-group">
                  <label class="control-label">Ending Date and Time of Event</label>
                  <input id="endDateTimeOfEvent" type="datetime-local" class="form-control" />
                  <span htmlFor="endDateTimeOfEvent" class="text-danger"></span>
                </div><br />
                <div class="form-group">
                  <label class="control-label">Last Day to Register</label>
                  <input id="lastDayToRegister" type="datetime-local" class="form-control" />
                  <span htmlFor="lastDayToRegister" class="text-danger"></span>
                </div><br />
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <input id="posterUrl" placeholder='PosterUrl' class="form-control" />
                  <span htmlFor="posterUrl" class="text-danger"></span>
                </div><br />
                <div class="form-group">
                  <input id="accessLevel" placeholder='Access Level' class="form-control" />
                  <span htmlFor="accessLevel" class="text-danger"></span>
                </div><br />
                <div class="form-group">
                  <textarea id="venue" placeholder='Venue' class="form-control" ></textarea>
                  <span htmlFor="venue" class="text-danger"></span>
                </div><br />
                <div class="form-group">
                  <input id="availableSeats" placeholder='Available Seats' type="number" class="form-control" />
                  <span htmlFor="availableSeats" class="text-danger"></span>
                </div><br />
                <div class="form-group" style={{ textAlign: 'right' }}>
                  <input type="submit" value="Create" class="btn btn-primary" />&nbsp;
                  <a class="btn btn-warning" asp-action="Index">Back to List</a>
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
export function CollegeEventsEditView() {
  return (
    <div>CollegeEventsViews</div>
  )
}

export function CollegeEventsDetailsView() {
  return (
    <div>CollegeEventsViews</div>
  )
}


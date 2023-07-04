import React from 'react';
import {CollegeEventsCreateView,CollegeEventsIndexView,CollegeEventsEditView,CollegeEventsDetailsView} from "./CollegeEventsViews"
export const CollegeEventsViewsRoutes = [
    {
        path: '/college-events-index-view',
        requireAuth: true,
        element: <CollegeEventsIndexView />
    },
    {
        path: '/college-events-create-view',
        requireAuth: true,
        element: <CollegeEventsCreateView />
    },
    {
        path: '/college-events-edit-view',
        requireAuth: true,
        element: <CollegeEventsEditView />
    },
    {
        path: '/college-events-details-view',
        requireAuth: true,
        element: <CollegeEventsDetailsView />
    }
]
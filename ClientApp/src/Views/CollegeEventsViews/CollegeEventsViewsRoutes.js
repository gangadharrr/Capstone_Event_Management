import React from 'react';
import {CollegeEventsPresidentCreateView,CollegeEventsPresidentEditView,CollegeEventsPresidentDetailsView,CollegeEventsPresidentView,CollegeEventsCreateView,CollegeEventsIndexView,CollegeEventsEditView,CollegeEventsDetailsView} from "./CollegeEventsViews"
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
    },
    {
        path: '/college-events-president-view',
        requireAuth: true,
        element: <CollegeEventsPresidentView />
    },
    {
        path: '/college-events-president-create-view',
        requireAuth: true,
        element: <CollegeEventsPresidentCreateView />
    },
    {
        path: '/college-events-president-edit-view',
        requireAuth: true,
        element: <CollegeEventsPresidentEditView />
    },
    {
        path: '/college-events-president-details-view',
        requireAuth: true,
        element: <CollegeEventsPresidentDetailsView />
    }
]
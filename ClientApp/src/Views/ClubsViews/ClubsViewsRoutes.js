import React from 'react';
import { ClubsIndexView, ClubsCreateView, ClubsEditView, ClubsDetailsView } from './ClubsViews';
export const ClubsViewsRoutes = [
    {
        path: '/clubs-index-view',
        requireAuth: true,
        element: <ClubsIndexView />
    },
    {
        path: '/clubs-create-view',
        requireAuth: true,
        element: <ClubsCreateView />
    },
    {
        path: '/clubs-edit-view',
        requireAuth: true,
        element: <ClubsEditView />
    },
    {
        path: '/clubs-details-view',
        requireAuth: true,
        element: <ClubsDetailsView />
    }
]
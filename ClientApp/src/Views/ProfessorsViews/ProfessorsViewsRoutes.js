import React from 'react';
import {ProfessorsIndexView,ProfessorsCreateView,ProfessorsEditView,ProfessorsDetailsView} from './ProfessorsViews'
export const ProfessorsViewsRoutes = [
    {
        path: '/professors-index-view',
        requireAuth: true,
        element: <ProfessorsIndexView />
    },
    {
        path: '/professors-create-view',
        requireAuth: true,
        element: <ProfessorsCreateView />
    },
    {
        path: '/professors-edit-view',
        requireAuth: true,
        element: <ProfessorsEditView />
    },
    {
        path: '/professors-details-view',
        requireAuth: true,
        element: <ProfessorsDetailsView />
    }

]
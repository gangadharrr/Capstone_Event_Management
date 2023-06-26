import React from 'react';
import {StudentsCreateView,StudentsDetailsView,StudentsIndexView,StudentsEditView} from './StudentsViews';

export const StudentsViewsRoutes = [
    {
        path: '/students-index-view',
        requireAuth: true,
        element: <StudentsIndexView />
      },
      {
        path: '/students-edit-view',
        requireAuth: true,
        element: <StudentsEditView />
      },
      {
        path: '/students-details-view',
        requireAuth: true,
        element: <StudentsDetailsView />
      },
      {
        path: '/students-create-view',
        requireAuth: true,
        element: <StudentsCreateView />
      },
];



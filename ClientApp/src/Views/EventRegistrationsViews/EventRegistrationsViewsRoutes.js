import React from "react";
import {EventRegistrationsIndexView} from "./EventRegistrationsViews";
export const EventRegistrationsViewsRoutes = [
    {
        path: '/event-registrations-index-view',
        requireAuth: true,
        element: <EventRegistrationsIndexView />
    }
]
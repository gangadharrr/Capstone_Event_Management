import React from "react";
import {ClubMembersIndexView, ClubMembersDetailsView} from "./ClubMembersViews";
export const ClubMembersViewsRoutes = [
    {
        path: '/club-members-index-view',
        requireAuth: true,
        element: <ClubMembersIndexView />
    },
    {
        path: '/club-members-details-view',
        requireAuth: true,
        element: <ClubMembersDetailsView />
    }
]

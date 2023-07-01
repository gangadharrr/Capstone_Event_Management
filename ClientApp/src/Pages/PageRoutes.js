import { ClubsIndexPage } from "./Clubs/ClubsIndexPage"
import { MembersIndexPage } from "./Members/MembersIndexPage"

export const PageRoutes = [
    {
        path: '/members-index-page',
        element: <MembersIndexPage />,
    },
    {
        path: '/club-home',
        element: <ClubsIndexPage />
    },
]
import { ClubsIndexPage, } from "./Clubs/ClubsIndexPage"
import { ClubsPage} from "./Clubs/ClubsPage"
import { EventsPage} from "./CollegeEvents/EventsPage"
import { MembersIndexPage } from "./Members/MembersIndexPage"
import { CollegeEventsIndexPage } from "./CollegeEvents/CollegeEventsIndexPage"

export const PageRoutes = [
    {
        path: '/members-index-page',
        element: <MembersIndexPage />,
    },
    {
        path: '/club-home',
        element: <ClubsIndexPage />
    },
    {
        path: '/college-events-index-page',
        element: <CollegeEventsIndexPage />
    },
    {
        path: '/clubs-page',
        element: <ClubsPage />
    },
    {
        path: '/events-page',
        element: <EventsPage />
    }
]
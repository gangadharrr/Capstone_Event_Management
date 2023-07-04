import ApiAuthorzationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import {StudentsViewsRoutes} from '../src/Views/StudentsViews/StudentsViewsRoutes';
import {ProfessorsViewsRoutes} from '../src/Views/ProfessorsViews/ProfessorsViewsRoutes';
import {ClubsViewsRoutes} from '../src/Views/ClubsViews/ClubsViewsRoutes';
import {ClubMembersViewsRoutes} from "../src/Views/ClubMembersViews/ClubMembersViewsRoutes";
import {CollegeEventsViewsRoutes} from '../src/Views/CollegeEventsViews/CollegeEventsViewsRoutes';

import {PageRoutes} from './Pages/PageRoutes'



const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/counter',
    element: <Counter />
  },
  {
    path: '/fetch-data',
    element: <FetchData />
  },
  ...PageRoutes,
  ...CollegeEventsViewsRoutes,
  ...ClubMembersViewsRoutes,
  ...ClubsViewsRoutes,
  ...ProfessorsViewsRoutes,
  ...StudentsViewsRoutes,
  ...ApiAuthorzationRoutes
];

export default AppRoutes;

import ApiAuthorzationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import {StudentsViewsRoutes} from '../src/Views/StudentsViews/StudentsViewsRoutes';
import {ProfessorsViewsRoutes} from '../src/Views/ProfessorsViews/ProfessorsViewsRoutes';
import {ClubsViewsRoutes} from '../src/Views/ClubsViews/ClubsViewsRoutes';



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
  ...ClubsViewsRoutes,
  ...ProfessorsViewsRoutes,
  ...StudentsViewsRoutes,
  ...ApiAuthorzationRoutes
];

export default AppRoutes;

import ApiAuthorzationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import {StudentsCreateView,StudentsDeleteView,StudentsEditView,StudentsIndexView,StudentsDetailsView } from '../src/Views/StudentsViews/StudentsViews';


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
    requireAuth: false,
    element: <StudentsDetailsView />
  },
  {
    path: '/students-create-view',
    requireAuth: true,
    element: <StudentsCreateView />
  },
  {
    path: '/students-delete-view',
    requireAuth: true,
    element: <StudentsDeleteView />
  },
  {
    path: '/fetch-data',
    requireAuth: true,
    element: <FetchData />
  },
  ...ApiAuthorzationRoutes
];

export default AppRoutes;

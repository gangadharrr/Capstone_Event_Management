import React, { Component } from 'react';
import { Route, Router, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import { Layout } from './components/Layout';
import './custom.css';
import { QueryClient,QueryClientProvider } from 'react-query';

const queryClient=new QueryClient();

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (<QueryClientProvider client={queryClient}>

      <Layout>
        <Routes>
        
          {AppRoutes.map((route, index) => {
            const { element, requireAuth, ...rest } = route;
            return <Route key={index} {...rest} element={requireAuth ? <AuthorizeRoute {...rest} element={element} /> : element} />;
          })}
        </Routes>
      </Layout>
      </QueryClientProvider>
    );
  }
}

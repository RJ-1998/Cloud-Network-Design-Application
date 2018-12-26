import React, { Component } from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import 'filepond/dist/filepond.min.css';
import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';


class App extends Component {
  render() {
    return (
      <BrowserRouter>
      <div className="App">
        <Navbar/>
        <Switch>
          <Route exact path="/" component={Dashboard}/>
        </Switch>        
      </div>
      </BrowserRouter>
    );
  }
}

export default App;

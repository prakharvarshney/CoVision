import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ValidSessionContext from './Context/ValidSessionContext'
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <ValidSessionContext>
      <App />
    </ValidSessionContext>
  </React.StrictMode>,
  document.getElementById('root')
);


serviceWorker.unregister();

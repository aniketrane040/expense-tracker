import React from 'react';
import ReactDOM from 'react-dom';
import { SpeechProvider } from '@speechly/react-client';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers';

import App from './App';
import './index.css';

const store = createStore(reducers, compose(applyMiddleware(thunk)));

ReactDOM.render(<SpeechProvider appId="72274f35-e775-4047-84c5-599c78ff3c3c" language="en-US" >
                    <Provider store={store}>
                        <App />
                    </Provider>
                </SpeechProvider> , document.getElementById('root'));
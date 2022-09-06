import React, { Fragment } from 'react';
import ReactDOM from 'react-dom/client';
import { createGlobalStyle } from 'styled-components'
import App from './app';
import './preloader.scss';

const GlobalStyle = createGlobalStyle`
  * {
        box-sizing: border-box;
    }
  html, body, #root {
        height: 100%;
        width: 100%;
        min-height: 500px;
    }
  #root>div {
        width: 100%;
        height: 100%;
    }
    body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
`

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Fragment>
        <GlobalStyle />
        <App />
    </Fragment>

);
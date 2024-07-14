import React from 'react';
import SurveyForm from './SurveyForm';
import { Container, Typography } from '@mui/material';
import './App.css';

function App() {
  return (
    <Container className="App">
      <header className="App-header">
        <Typography variant="h4">Beacon Survey</Typography>
      </header>
      <SurveyForm />
    </Container>
  );
}

export default App;

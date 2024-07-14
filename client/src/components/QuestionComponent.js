import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';

const QuestionComponent = ({ question, value, handleChange }) => {
  return (
    <div>
      <FormControl fullWidth>
        {question.type === 'select' ? (
          <>
            <InputLabel>{question.label}</InputLabel>
            <Select
              name={question.name}
              value={value}
              onChange={handleChange}
              required
            >
              <MenuItem value=""><em>Select</em></MenuItem>
              {question.options.map((option, index) => (
                <MenuItem key={index} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </>
        ) : (
          <TextField
            fullWidth
            type={question.type}
            name={question.name}
            label={question.label}
            value={value}
            onChange={handleChange}
            required
          />
        )}
      </FormControl>
    </div>
  );
};

export default QuestionComponent;

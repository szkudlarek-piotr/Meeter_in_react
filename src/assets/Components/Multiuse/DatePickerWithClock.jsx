import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { Box } from '@mui/material';

export default function DatePickerWithClock() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ width: "80%", mx: "auto"}}>
            <DateTimePicker 
            label="Podaj datę wesela"
            sx={{width: "100%"}}
            viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
            }}
            />
        </Box>
    </LocalizationProvider>
  );
}
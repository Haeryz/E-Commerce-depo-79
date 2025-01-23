import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Box, Input, Text } from '@chakra-ui/react';

const CustomDatePicker = (props: {
    onChange?: (date: Date | null, event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
  }) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
    const handleDateChange = (date: Date | null, event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
      setSelectedDate(date);
      if (props.onChange) {
        props.onChange(date, event);
      }
    };
  
    return (
      <Box position="relative">
        <DatePicker
          {...props}
          selected={selectedDate}
          onChange={handleDateChange}
          className="custom-date-picker"
          calendarClassName="custom-calendar"
          dateFormat="MM/dd/yyyy"
          placeholderText="Hari"
          customInput={
            <Input
              value={selectedDate?.toLocaleDateString() || ''}
              placeholder="Click to select a date"
              size="sm"
              pr={10}
            />
          }
        />
        <Box position="absolute" top="50%" right={4} transform="translateY(-50%)">
          <Text fontSize="sm" color="gray.500">
            <i className="fas fa-calendar-alt"></i>
          </Text>
        </Box>
      </Box>
    );
  };

export default CustomDatePicker;
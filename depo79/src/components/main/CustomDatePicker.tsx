import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Input } from '@chakra-ui/react'; // Add this import

interface CustomDatePickerProps {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ selectedDate, onChange }) => {
  return (
    <DatePicker
      selected={selectedDate}
      onChange={onChange}
      dateFormat="yyyy/MM/dd"
      placeholderText="Select date..."
      customInput={<Input placeholder="Select date..." />}
    />
  );
};

export default CustomDatePicker;
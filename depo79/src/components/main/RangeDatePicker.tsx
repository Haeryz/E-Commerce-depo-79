import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Box, Input } from '@chakra-ui/react';

const RangeDatePicker = () => {
  const defaultStartDate = new Date("2024-08-01");
  const defaultEndDate = new Date("2024-10-01");
  const [startDate, setStartDate] = useState<Date | null>(defaultStartDate);
  const [endDate, setEndDate] = useState<Date | null>(defaultEndDate);

  const handleChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start || defaultStartDate);
    setEndDate(end || defaultEndDate);
  };

  const disabledDates = [
    new Date("2024-05-01"),
    new Date("2024-02-01"),
    new Date("2024-01-01"),
    new Date("2024-11-01"),
  ];

  return (
    <Box position="relative" width="100%">
      <DatePicker
        selected={startDate}
        startDate={startDate}
        endDate={endDate}
        onChange={handleChange}
        excludeDates={disabledDates}
        dateFormat="MM/yyyy"
        placeholderText="Select a month other than the disabled months"
        showMonthYearPicker
        selectsRange
        customInput={
          <Input 
            width="100%" 
            value={`${startDate?.toLocaleDateString() || ''} - ${endDate?.toLocaleDateString() || ''}`} 
            placeholder="Select date range" 
          />
        }
      />
    </Box>
  );
};

export default RangeDatePicker;
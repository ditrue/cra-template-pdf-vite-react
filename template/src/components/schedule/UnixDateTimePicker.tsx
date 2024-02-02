import { useEffect, useState } from "react";
import { DatePicker, DatePickerProps, TimePicker, TimePickerProps } from "antd";
import dayjs from "dayjs";

type Props = {
  id?: string;
  showTime?: boolean;
  value?: number;
  onChange?: (value?: number) => void;
  dateAllowClear?: boolean;
  timeAllowClear?: boolean;
  datePlaceholder?: string;
  timePlaceholder?: string;
};

const UnixDateTimePicker: React.FC<Props> = (props) => {
  const {
    id,
    value,
    onChange,
    showTime = true,
    dateAllowClear = false,
    timeAllowClear = false,
    datePlaceholder,
    timePlaceholder,
  } = props;

  const [date, setDate] = useState<dayjs.Dayjs | null>(null);
  const [time, setTime] = useState<dayjs.Dayjs | null>(null);

  useEffect(() => {
    const datetime = value ? dayjs.unix(value) : null;
    setDate((date) => {
      const df1 = datetime?.format('YYYY-MM-DD');
      const df2 = date?.format('YYYY-MM-DD');
      if (df1 !== df2) {
        return datetime;
      }
      return date;
    });
    setTime((time) => {
      const tf1 = datetime?.format('HH:mm');
      const tf2 = time?.format('HH:mm');
      if (tf1 !== tf2) {
        return datetime;
      }
      return time;
    });
  }, [value]);

  const getUnix = (date?: dayjs.Dayjs | null, time?: dayjs.Dayjs | null) => {
    let unix: number | undefined = undefined;
    if (date && time) {
      unix = dayjs(`${date.format('YYYY-MM-DD')} ${time.format('HH:mm:ss')}`, 'YYYY-MM-DD HH:mm:ss').unix();
    } else if (date) {
      unix = date.unix();
    }
    return unix;
  };

  const handleDateChange: DatePickerProps['onChange'] = (date) => {
    setDate(date);
    onChange?.(getUnix(date, time));
  };

  const handleTimeChange: TimePickerProps['onChange'] = (time) => {
    setTime(time);
    onChange?.(getUnix(date, time));
  };

  return (
    <div className="flex" id={id}>
      <DatePicker
        className="flex-1"
        allowClear={dateAllowClear}
        value={date}
        onChange={handleDateChange}
        placeholder={datePlaceholder}
      />
      {showTime && (
        <TimePicker
          className="w-32 ml-2"
          format="HH:mm"
          minuteStep={15}
          allowClear={timeAllowClear}
          showNow={false}
          value={time}
          onChange={handleTimeChange}
          placeholder={timePlaceholder}
        />
      )}
    </div>
  );
};

export default UnixDateTimePicker;

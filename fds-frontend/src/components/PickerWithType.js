import React from "react";
import { DatePicker, Select, Space, TimePicker } from "antd";
import { useState } from "react";
const { Option } = Select;

const TypeChanger = ({ type, onChange }) => {
  if (type === "time") return <TimePicker onChange={onChange} />;
  if (type === "date") return <DatePicker onChange={onChange} />;
  return <DatePicker picker={type} onChange={onChange} />;
};

function PickerWithType() {
  const [type, setType] = useState("time");
  return (
    <Space className="picker-with-type">
      <Select value={type} onChange={setType}>
        <Option value="time">Time</Option>
        <Option value="date">Date</Option>
        <Option value="week">Week</Option>
        <Option value="month">Month</Option>
        <Option value="quarter">Quarter</Option>
        <Option value="year">Year</Option>
      </Select>
      <TypeChanger type={type} onChange={(value) => console.log(value)} />
    </Space>
  );
}

export default PickerWithType;

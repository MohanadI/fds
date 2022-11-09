import React, { useState } from "react";
import { Checkbox, Tag, Button } from "antd";
import "./side-filters.css";

const CheckboxGroup = Checkbox.Group;

function SideFilters({ onFiltersChange }) {
  const [checkedList, setCheckedList] = useState([]);
  const [doctorCheckedList, setDoctorCheckedList] = useState([]);

  const onChange = (list) => {
    setCheckedList(list);
    onFiltersChange("PATIENT_CLUSTER_PREDICTION", list);
  };

  const onDoctorListChange = (list) => {
    setDoctorCheckedList(list);
    onFiltersChange("DOCTOR_CLUSTER_PREDICTION", list);
  };

  return (
    <div className="side-filters">
      <div className="filter-container">
        <div className="filter-title">
          {"patient intensity scale".toUpperCase()}
        </div>
        <Button
          style={{ float: "right" }}
          size="small"
          onClick={() => onChange([])}
        >
          Clear All
        </Button>
        <CheckboxGroup value={checkedList} onChange={onChange}>
          <div>
            <Checkbox value="Fraud">
              <Tag color="red">Fraud</Tag>
            </Checkbox>
          </div>
          <div style={{ marginTop: 5 }}>
            <Checkbox value="Abuse">
              <Tag color="orange">Abuse</Tag>
            </Checkbox>
          </div>
          <div style={{ marginTop: 5 }}>
            <Checkbox value="Waste">
              <Tag color="green">Waste</Tag>
            </Checkbox>
          </div>
          <div style={{ marginTop: 5 }}>
            <Checkbox value="Normal">
              <Tag color="blue">Normal</Tag>
            </Checkbox>
          </div>
        </CheckboxGroup>
      </div>
      <div className="filter-container">
        <div className="filter-title">
          {"doctor intensity scale".toUpperCase()}
        </div>
        <Button
          style={{ float: "right" }}
          size="small"
          onClick={() => onDoctorListChange([])}
        >
          Clear All
        </Button>
        <CheckboxGroup value={doctorCheckedList} onChange={onDoctorListChange}>
          <div>
            <Checkbox value="Fraud">
              <Tag color="red">Fraud</Tag>
            </Checkbox>
          </div>
          <div style={{ marginTop: 5 }}>
            <Checkbox value="Abuse">
              <Tag color="orange">Abuse</Tag>
            </Checkbox>
          </div>
          <div style={{ marginTop: 5 }}>
            <Checkbox value="Waste">
              <Tag color="green">Waste</Tag>
            </Checkbox>
          </div>
          <div style={{ marginTop: 5 }}>
            <Checkbox value="Normal">
              <Tag color="blue">Normal</Tag>
            </Checkbox>
          </div>
        </CheckboxGroup>
      </div>
    </div>
  );
}

export default SideFilters;

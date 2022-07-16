import React, { useState } from "react";
import { Select, Checkbox, Input, Tag } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import "./side-filters.css";
const { Option } = Select;
const { Search } = Input;

function SideFilters() {
  let citiesOptions = [
    {
      label: "Jerusalem",
      value: "jerusalem",
    },
    {
      label: "Jenin",
      value: "jenin",
    },
    {
      label: "Nablus",
      value: "nablus",
    },
    {
      label: "Tulkarm",
      value: "tulkarm",
    },
    {
      label: "Tubas",
      value: "tubas",
    },
    {
      label: "Qalqelieh",
      value: "qalqelieh",
    },
    {
      label: "Salfet",
      value: "salfet",
    },
    {
      label: "Ramallah & Al-Bireh",
      value: "ramBireh",
    },
    {
      label: "Beithlahem",
      value: "beithlahem",
    },
    {
      label: "Hebron",
      value: "hebron",
    },
  ];
  let customFilters = [
    {
      label: "Patient",
      value: "patient",
    },
    {
      label: "Doctor",
      value: "doctor",
    },
    {
      label: "City",
      value: "city",
    },
    {
      label: "ICD",
      value: "icd",
    },
    {
      label: "Gender",
      value: "gender",
    },
  ];

  let filtersElements = {
    patient: (
      <div key="patient" className="filter-container">
        <div className="filter-title">
          <FilterOutlined /> Patient
        </div>
        <Search placeholder="Patient" allowClear style={{ width: 200 }} />
      </div>
    ),
    doctor: (
      <div key="doctor" className="filter-container">
        <div className="filter-title">
          <FilterOutlined /> Doctor
        </div>
        <Search placeholder="Doctor" allowClear style={{ width: 200 }} />
      </div>
    ),
    city: (
      <div key="city" className="filter-container">
        <div className="filter-title">
          <FilterOutlined /> City
        </div>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Choose cities"
          optionLabelProp="label"
        >
          {citiesOptions.map((option) => {
            return (
              <Option
                key={option.value}
                value={option.value}
                label={option.label}
              >
                {option.label}
              </Option>
            );
          })}
        </Select>
      </div>
    ),
    icd: (
      <div key="icd" className="filter-container">
        <div className="filter-title">
          <FilterOutlined /> ICD
        </div>
        <Search
          placeholder="input search text"
          allowClear
          style={{ width: 200 }}
        />
      </div>
    ),
    gender: (
      <div key="gender" className="filter-container">
        <div className="filter-title">
          <FilterOutlined /> Gender
        </div>
        <div>
          <Checkbox>Male</Checkbox>
        </div>
        <div>
          <Checkbox>Female</Checkbox>
        </div>
      </div>
    ),
  };
  const [selectedFilters, setSelectedFilters] = useState([]);
  function handleChange(value) {
    let s = [];
    value.forEach((element) => {
      s.push(filtersElements[element]);
    });
    setSelectedFilters(s);
  }

  // Trascation type ( High, Medium, Low )
  return (
    <div className="side-filters">
      <div className="add-filters">
        <div className="add-filters-title">ADD FILTERS</div>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Add filters"
          onChange={handleChange}
          optionLabelProp="label"
        >
          {customFilters.map((option) => {
            return (
              <Option
                key={option.value}
                value={option.value}
                label={option.label}
              >
                {option.label}
              </Option>
            );
          })}
        </Select>
      </div>
      <div className="filter-container">
        <div className="filter-title">{"intensity scale".toUpperCase()}</div>
        <div>
          <Checkbox>
            <Tag color="red">Fraud</Tag>
          </Checkbox>
        </div>
        <div style={{ marginTop: 5 }}>
          <Checkbox>
            <Tag color="orange">Abuse</Tag>
          </Checkbox>
        </div>
        <div style={{ marginTop: 5 }}>
          <Checkbox>
            <Tag color="green">Waste</Tag>
          </Checkbox>
        </div>
        <div style={{ marginTop: 5 }}>
          <Checkbox>
            <Tag color="blue">Normal</Tag>
          </Checkbox>
        </div>
      </div>
      {selectedFilters.map((element) => {
        return element;
      })}
    </div>
  );
}

export default SideFilters;

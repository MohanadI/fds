import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Input,
  Typography,
  Divider,
  Table,
  Collapse,
  message,
  Spin,
} from "antd";
// import moment from "moment";
import { SearchOutlined } from "@ant-design/icons";
import PickerWithType from "../components/PickerWithType";

import SideFilters from "../components/side-filters";
import TimeChart from "../components/TimeChart";

import { GetPredictionsListAPI } from "../api/api";
import useInterval from "../utils/useInterval";

function Transactions() {
  const { Search } = Input;
  const { Panel } = Collapse;
  const { Title } = Typography;

  const [predictions, setPredictions] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchPatientPredictions();
  }, []);

  useInterval(() => {
    setIsFetching(true);
    fetchPatientPredictions();
  }, 60 * 1000);

  async function fetchPatientPredictions() {
    await GetPredictionsListAPI()
      .then((res) => {
        setPredictions(res.data);
        message.success("Successfully fetched transactions");
        setIsFetching(false);
      })
      .catch((err) => {
        message.error(err.message);
        setIsFetching(false);
      });
  }

  const columns = [
    {
      title: "PATIENT ID",
      dataIndex: "SUBSCRIBER_SEQ_ID",
      key: "SUBSCRIBER_SEQ_ID",
      render: (text, record) => record.SUBSCRIBER_SEQ_ID,
    },
    {
      title: "VISIT SEQ",
      dataIndex: "VISIT_SEQ",
      key: "VISIT_SEQ",
      render: (text, record) => record.VISIT_SEQ,
    },
    {
      title: "DATE_CREATED",
      dataIndex: "DATE_CREATED",
      key: "DATE_CREATED",
      render: (text, record) => record.DATE_CREATED,
    },
    {
      title: "DETAILS",
      dataIndex: "details",
      key: "details",
      render: (text, record) => {
        return (
          <Collapse defaultActiveKey={["0"]} style={{ width: "300px" }}>
            <Panel header="Show transaction details" key="1">
              Hello
            </Panel>
          </Collapse>
        );
      },
    },
  ];

  return (
    <div>
      <Spin spinning={isFetching}>
        <Row>
          <Col span={3}>
            <Title className="page-title">Transactions</Title>
          </Col>
          <Col span={1}>
            <Divider
              type="vertical"
              style={{ height: "100%", background: "#202b3c" }}
            />
          </Col>
          <Col span={16}>
            <Search
              className="search-area"
              placeholder="Search Transactions ( ClaimID, DoctorID, PatientID, ... )"
              enterButton={<SearchOutlined />}
              size="Meduim"
            />
          </Col>
          <Col span={4}>
            {/* Note : LIVE + red circle */}
            {/* from - to */}
            <PickerWithType />
          </Col>
        </Row>
        <Row style={{ marginTop: "15px" }}>
          <Col span={4}>
            {/* Add loading when filter change */}
            <SideFilters></SideFilters>
          </Col>
          <Col span={20}>
            {/* per minute */}
            {/* build create data by time interval */}
            <TimeChart data={predictions} />
            <Divider />
            <Table columns={columns} dataSource={predictions} />
          </Col>
        </Row>
      </Spin>
    </div>
  );
}

export default Transactions;

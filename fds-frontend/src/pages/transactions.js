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
  Tag,
  Timeline,
} from "antd";
// import moment from "moment";
import { SearchOutlined } from "@ant-design/icons";
import PickerWithType from "../components/PickerWithType";

import SideFilters from "../components/side-filters";
// import TimeChart from "../components/TimeChart";

import {
  GetPredictionsListAPI,
  GetTransactionsListBySubSeqAndVisitSeqAPI,
} from "../api/api";
import useInterval from "../utils/useInterval";

var filtersValues;

function Transactions() {
  const { Search } = Input;
  const { Panel } = Collapse;
  const { Title } = Typography;

  const [predictions, setPredictions] = useState([]);
  const [filteredPredictions, setFilteredPredictions] = useState([]);
  const [currentTransactions, setCurrentTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState({});
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    console.log("----------------------------------");
    console.log("fetchPatientPredictions: useEffect()");
    fetchPatientPredictions();
    
  filtersValues = {
    searchText: '',
    PATIENT_CLUSTER_PREDICTION: [],
    DOCTOR_CLUSTER_PREDICTION: []
  }
  }, []);

  useEffect(() => {
    console.log("----------------------------------");
    console.log("selectedTransaction:", selectedTransaction);
    if (selectedTransaction.SUBSCRIBER_SEQ_ID) {
      getTransactionListBySeqAndVisit(
        selectedTransaction.SUBSCRIBER_SEQ_ID,
        selectedTransaction.VISIT_SEQ
      );
    }
  }, [selectedTransaction]);

  // useInterval(() => {
  //   fetchPatientPredictions();
  // }, 60 * 1000);

  async function fetchPatientPredictions() {
    setIsFetching(true);
    try {
      await GetPredictionsListAPI()
        .then((res) => {
          if (res && res.data.length > 0) {
            setPredictions(res.data);
            setFilteredPredictions(res.data);
          }
          message.success("Successfully fetched predictions");
          setIsFetching(false);
        })
        .catch((err) => {
          message.error(err.message);
          setIsFetching(false);
        });
    } catch (error) {
      console.log(error);
    }
  }

  async function getTransactionListBySeqAndVisit(subSeq, visitSeq) {
    setIsFetching(true);
    try {
      await GetTransactionsListBySubSeqAndVisitSeqAPI(subSeq, visitSeq)
        .then((res) => {
          if (res && res.data.length > 0) {
            setCurrentTransactions(res.data);
          }
          message.success("Successfully fetched transactions");
          setIsFetching(false);
        })
        .catch((err) => {
          message.error(err.message);
          setIsFetching(false);
        });
    } catch (error) {
      console.log(error);
    }
  }

  function getPredictionTag(prediction) {
    if (prediction === "Fraud") {
      return {
        color: "red",
        text: "Fraud",
      };
    } else if (prediction === "Abuse") {
      return {
        color: "orange",
        text: "Abuse",
      };
    } else if (prediction === "Waste") {
      return {
        color: "green",
        text: "Waste",
      };
    }
    return {
      color: "blue",
      text: "Normal",
    };
  }

  const columns = [
    {
      title: "Patient ID",
      dataIndex: "SUBSCRIBER_SEQ_ID",
      key: "SUBSCRIBER_SEQ_ID",
      render: (text, record) => record.SUBSCRIBER_SEQ_ID,
    },
    {
      title: "Visit Sequence",
      dataIndex: "VISIT_SEQ",
      key: "VISIT_SEQ",
      render: (text, record) => record.VISIT_SEQ,
    },
    {
      title: "Created Date",
      dataIndex: "DATE_CREATED",
      key: "DATE_CREATED",
      render: (text, record) => record.DATE_CREATED,
    },
    {
      title: "Doctor Prediction",
      dataIndex: "DOCTOR_PREDICTION",
      key: "DOCTOR_PREDICTION",
      render: (text, record) => {
        const prediction = getPredictionTag(record.DOCTOR_CLUSTER_PREDICTION);

        return <Tag color={prediction.color}>{prediction.text}</Tag>;
      },
    },
    {
      title: "Patient Prediction",
      dataIndex: "PATIENT_PREDICTION",
      key: "PATIENT_PREDICTION",
      render: (text, record) => {
        const prediction = getPredictionTag(record.PATIENT_CLUSTER_PREDICTION);

        return <Tag color={prediction.color}>{prediction.text}</Tag>;
      },
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      render: (text, record) => {
        return (
          <Collapse
            style={{ width: "400px" }}
            onChange={(key) => {
              if (key.length !== 0) {
                setSelectedTransaction({
                  SUBSCRIBER_SEQ_ID: record.SUBSCRIBER_SEQ_ID,
                  VISIT_SEQ: record.VISIT_SEQ,
                });
              }
            }}
          >
            <Panel header="Show transaction details" key={record._id}>
              <Title style={{ fontSize: 14, marginBottom: 15 }}>
                Transaction Procedures:{" "}
              </Title>
              {currentTransactions &&
                currentTransactions.length > 0 &&
                currentTransactions.map((transaction) => {
                  return (
                    <>
                      <Timeline>
                        <Timeline.Item>
                          <b>HCP Type: </b> {transaction.HCP_Type}
                        </Timeline.Item>
                        <Timeline.Item>
                          <b>DOCTOR ID: </b> {transaction.DOCTOR_ID}
                        </Timeline.Item>
                        <Timeline.Item>
                          <b>CITY: </b> {transaction.CITY}
                        </Timeline.Item>
                        <Timeline.Item>
                          <b>BRAND: </b> {transaction.BRAND}
                        </Timeline.Item>
                      </Timeline>
                      <Divider />
                    </>
                  );
                })}
            </Panel>
          </Collapse>
        );
      },
    },
  ];

  const applyFilters = () => {
    console.log(filtersValues);
    setFilteredPredictions(predictions);

    if (filtersValues.searchText) {
      setFilteredPredictions(
        filteredPredictions?.filter(
          (p) => p.SUBSCRIBER_SEQ_ID === filtersValues.searchText || p.VISIT_SEQ === filtersValues.searchText
        )
      );
    }
    
    let filterPatient = filtersValues.PATIENT_CLUSTER_PREDICTION;
    if (filterPatient && filterPatient.length) {
      setFilteredPredictions(filteredPredictions?.filter((p) => filterPatient.includes(p.PATIENT_CLUSTER_PREDICTION)));
    }

    let filterDoctor = filtersValues.DOCTOR_CLUSTER_PREDICTION;
    if (filterDoctor && filterDoctor.length) {
      setFilteredPredictions(filteredPredictions?.filter((p) => filterDoctor.includes(p.DOCTOR_CLUSTER_PREDICTION)));
    }
  }

  const onSearchHandler = (e) => {
    const value = e.target.value || "";
    filtersValues.searchText = value;
    applyFilters();
  };

  const onFiltersChangeHandler = (filterName, value) => {
    filtersValues[filterName] = value;
    applyFilters();
  };

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
              placeholder="Search By SUBSCRIBER_SEQ_ID OR VISIT_SEQ"
              enterButton={<SearchOutlined />}
              size="small"
              onChange={onSearchHandler}
            />
          </Col>
          <Col span={4}>
            <PickerWithType />
          </Col>
        </Row>
        <Row style={{ marginTop: "15px" }}>
          <Col span={4}>
            <SideFilters onFiltersChange={onFiltersChangeHandler} />
          </Col>
          <Col span={20}>
            <Table columns={columns} dataSource={filteredPredictions} />
          </Col>
        </Row>
      </Spin>
    </div>
  );
}

export default Transactions;

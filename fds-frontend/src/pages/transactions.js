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
  getPredictionBySubscriberSeqIDAndVisitSeq,
} from "../api/api";
import useInterval from "../utils/useInterval";

function Transactions() {
  const { Search } = Input;
  const { Panel } = Collapse;
  const { Title } = Typography;

  const [predictions, setPredictions] = useState([]);
  const [filteredPredictions, setFilteredPredictions] = useState([]);
  const [currentTransactions, setCurrentTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const [filtersValues, setFiltersValues] = useState({
    searchText: '',
    PATIENT_CLUSTER_PREDICTION: [],
    DOCTOR_CLUSTER_PREDICTION: []
  });

  useEffect(() => {
    console.log("----------------------------------");
    console.log("fetchPatientPredictions: useEffect()");
    fetchPatientPredictions();
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

  async function getPredictionBySeqAndVisit(subSeq, visitSeq) {
    setIsFetching(true);
    try {
      await getPredictionBySubscriberSeqIDAndVisitSeq(subSeq, visitSeq)
        .then((res) => {
          if (res && res.predictions.length > 0) {
            setPredictions(res.predictions);
            setFilteredPredictions(res.predictions);
          }
          message.success("Successfully fetched predictions!!");
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
      title: "Visit Date",
      dataIndex: "VISIT_DATE",
      key: "VISIT_DATE",
      render: (text, record) => new Date(record.VISIT_DATE).toLocaleDateString("en-US"),
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
    }
  ];

  const applyFilters = () => {
    let pred = predictions;

    if (filtersValues.searchText) {
      pred = pred?.filter(
        (p) => p.SUBSCRIBER_SEQ_ID === filtersValues.searchText || p.VISIT_SEQ === filtersValues.searchText
      );
    }

    let filterPatient = filtersValues.PATIENT_CLUSTER_PREDICTION;
    if (filterPatient && filterPatient.length) {
      pred = pred?.filter((p) => filterPatient.includes(p.PATIENT_CLUSTER_PREDICTION));
    }

    let filterDoctor = filtersValues.DOCTOR_CLUSTER_PREDICTION;
    if (filterDoctor && filterDoctor.length) {
      pred = pred?.filter((p) => filterDoctor.includes(p.DOCTOR_CLUSTER_PREDICTION));
    }
    setFilteredPredictions(pred);
  }

  const onSearchHandler = (e) => {
    if (e === "") {
      message.error("You need to search using SUB_SEQ , VISIT_SEQ");
    } else {
      const values = e.split(",");
      if (values.length !== 2) {
        message.error("You need to search using SUB_SEQ , VISIT_SEQ");
      } else {
        const SUB_SEQ = values[0];
        const VISIT_SEQ = values[1];
        getPredictionBySeqAndVisit(
          SUB_SEQ,
          VISIT_SEQ
        );
      }
    }
  };

  const onFiltersChangeHandler = (filterName, value) => {
    const tempFilterValues = { ...filtersValues, filterName: value };
    setFiltersValues(tempFilterValues);
    applyFilters();
  };

  return (
    <div>
      <Spin spinning={isFetching}>
        <Row>
          <Col span={4}>
            <Title className="page-title">Transactions</Title>
          </Col>
          <Col span={20}>
            <Search
              className="search-area"
              placeholder="Search By SUBSCRIBER_SEQ_ID OR VISIT_SEQ"
              enterButton={<SearchOutlined />}
              size="small"
              onSearch={onSearchHandler}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: "15px" }}>
          <Col span={4}>
            <SideFilters onFiltersChange={onFiltersChangeHandler} />
          </Col>
          <Col span={20}>
            <Table
              columns={columns}
              dataSource={filteredPredictions}
              onExpand={
                (record, text) => {
                  if (record) {
                    setSelectedTransaction({
                      SUBSCRIBER_SEQ_ID: text.SUBSCRIBER_SEQ_ID,
                      VISIT_SEQ: text.VISIT_SEQ,
                    });
                  }
                }
              }
              expandable={{
                expandedRowRender: (record) =>
                (
                  <>
                    {currentTransactions &&
                      currentTransactions.length > 0 &&
                      currentTransactions.map((transaction) => (
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
                          <Divider style={{ margin: "0px 0 20px 0" }}/>
                        </>
                      ))
                    }
                  </>
                )
              }}
            />
          </Col>
        </Row>
      </Spin>
    </div>
  );
}

export default Transactions;

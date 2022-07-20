import axios from "axios";

const SERVER_URL = `${window.location.origin.replace("3000", "3007")}/`;
const PREDICTION_MODULE = "prediction/";
const TRANSACTION_MODULE = "transaction/";

console.log("----------------------------------");
console.log("SERVER_URL:", SERVER_URL);
console.log("----------------------------------");

axios.defaults.withCredentials = false;

const ApiNames = Object.freeze({
  POST_T: "Transaction",
  GET_T: "Transactions",
  GET_TRANSACTION_BY_SSI_AND_VI: "transactionsBySSIAndVI",
  POST_P: "Prediction",
  GET_P: "Predictions",
});

const GetTransactionsListAPI = () =>
  axios({
    method: "GET",
    url: `${SERVER_URL}${TRANSACTION_MODULE}${ApiNames.GET_T}`,
  });

const GetTransactionsListBySubSeqAndVisitSeqAPI = (subSeq, visitSeq) =>
  axios({
    method: "GET",
    url: `${SERVER_URL}${TRANSACTION_MODULE}${ApiNames.GET_TRANSACTION_BY_SSI_AND_VI}/${subSeq}/${visitSeq}`,
  });

const TransactionsAPI = (transactions) => {
  return axios({
    method: "POST",
    url: `${SERVER_URL}${TRANSACTION_MODULE}${ApiNames.POST_T}`,
    data: transactions,
  });
};

const GetPredictionsListAPI = () =>
  axios({
    method: "GET",
    url: `${SERVER_URL}${PREDICTION_MODULE}${ApiNames.GET_P}`,
  });

const PredictionAPI = (transaction) => {
  const data = new FormData();
  data.append("data", { ...transaction });
  return axios({
    method: "POST",
    url: `${SERVER_URL}${PREDICTION_MODULE}${ApiNames.POST_P}`,
    data,
  });
};

export {
  PredictionAPI,
  GetPredictionsListAPI,
  GetTransactionsListAPI,
  GetTransactionsListBySubSeqAndVisitSeqAPI,
  TransactionsAPI,
};

import React from "react";
import { Button, Divider } from "antd";
import { TransactionsAPI } from "../api/api";

function Dashboard() {
  const randomData = [
    {
      EP_MAN_ICO_ID: "95",
      EFFECTIVE_DATE: "01/03/2018",
      EXPIRATION_DATE: "28/02/2019",
      HCP_ID: "2",
      HOSPITAL_DOCTOR_ID: "1942",
      CLAIMING_HCP_ID: "3",
      VISIT_DATE: "01/01/2019",
      VISIT_SEQ: "11",
      CLAIM_PAYMENT_TYPE: "1",
      PAYMENT_TYPE: "NETWORK",
      HCP_TYPE_ID: "6",
      HCP_Type: "Pharmacy",
      TPYE_OF_VISIT_ID: "1",
      Type: "Regular",
      CODE: "16",
      CHAPTER: "SYMPTOMS, SIGNS, AND ILL-DEFINED CONDITIONS",
      CODE_1: "87",
      SECTIONS: "Symptoms ",
      ICD9_CODE: "789.0",
      ICD_9_Description: "ABDOMINAL PAIN*",
      ICD_9_Description_ar: "الام البطن ",
      DOCTOR_ID: "2",
      SPECIALITY_ID: "29",
      DOCTOR_SPECIALITY: "Emergency Center",
      SPECIALITY_ID_1: "1",
      DESCRIPTION: "G.P",
      GENDER_ID: "2",
      Gender: "Female",
      DEPENDENT_CODE: "3",
      AGE: "0",
      SUBSCRIBER_SEQ_ID: "95011",
      HOF_SEQ_ID: "30268",
      DEPENDANCE: "CHILD",
      CLAIMED_ITEM: "Dermacombin 15g cream",
      ID: "21614",
      MANUFACTURERS_ID: "499",
      THR_CODE: "D07C",
      THR_NAME: "Corticosteroids, Combinations W Antibiotics",
      BRAND_ID: "6279",
      BRAND: "Dermacombin",
      FORM_ID: "18",
      FORM: "Skin Cream",
      SKU_ID: "TB",
      size: "15",
      UNIT_TYPE: "Gram",
      TOTAL_QTY: "1",
      DOSAGEAGE: " Gram / Day  For   Day",
      UNIT_TYPE_ID: "8",
      EP_MDC_CPT_CODE: "",
      CITY_CODE: "1366",
      CITY: "Ramallah",
      DATE_CREATED: "01/01/2019 17:17",
      CLAIMED_VALUE: "29",
    },
  ];
  function sendNewTransaction() {
    try {
      TransactionsAPI(randomData[0]);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      Dashboard
      <Divider />
      <Button
        type="primary"
        onClick={() => {
          sendNewTransaction();
        }}
      >
        {" "}
        Generate New Transaction
      </Button>
    </div>
  );
}

export default Dashboard;

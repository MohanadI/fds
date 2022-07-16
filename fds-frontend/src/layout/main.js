import React, { useState } from "react";
import { Button, Layout, Menu, message } from "antd";
import { Routes, Route, Link } from "react-router-dom";

import Transactions from "../pages/transactions";
import { TransactionsAPI } from "../api/api";

import {
  // MailOutlined,
  CodepenCircleFilled,
  ThunderboltFilled,
} from "@ant-design/icons";

const { Header, Footer, Content } = Layout;

function Main() {
  const [isFetching, setIsFetching] = useState(false);
  async function addNewTransaction() {
    setIsFetching(true);
    const transactions = [
      {
        EP_MAN_ICO_ID: "254",
        EFFECTIVE_DATE: "01/01/2019",
        EXPIRATION_DATE: "31/12/2019",
        HCP_ID: "1448",
        CLAIMING_HCP_ID: "267",
        VISIT_DATE: "07/09/2019",
        VISIT_SEQ: "28",
        CLAIM_PAYMENT_TYPE: "2",
        PAYMENT_TYPE: "NON-NETWORK",
        HCP_TYPE_ID: "6",
        "HCP Type": "Pharmacy",
        TPYE_OF_VISIT_ID: "1",
        Type: "Regular",
        CODE: "8",
        CHAPTER: "DISEASES OF THE RESPIRATORY SYSTEM",
        CODE_1: "53",
        SECTIONS: "Acute respiratory infections ",
        ICD9_CODE: "460",
        "ICD-9 Description": "ACUTE NASOPHARYNGITIS",
        "ICD-9 Description ar": "التهاب البلعوم الانفي الحاد ",
        DOCTOR_ID: "1448",
        SPECIALITY_ID: "1",
        DOCTOR_SPECIALITY: "G.P",
        GENDER_ID: "2",
        Gender: "Female",
        DEPENDENT_CODE: "2",
        AGE: "38",
        SUBSCRIBER_SEQ_ID: "41177",
        HOF_SEQ_ID: "41034",
        DEPENDANCE: "SPOUSE",
        "CLAIMED ITEM": "Arcoxia120mg 7tab.",
        ID: "22089",
        MANUFACTURERS_ID: "136",
        THR_CODE: "M01AH",
        THR_NAME: "Coxibs",
        BRAND_ID: "3834",
        BRAND: "Arcoxia",
        FORM_ID: "1",
        FORM: "Tablet",
        SKU_ID: "BX",
        size: "7",
        UNIT_TYPE: "Tablet",
        TOTAL_QTY: "1",
        DOSAGEAGE: "1 Tablet / Day  For   ",
        UNIT_TYPE_ID: "26",
        CITY_CODE: "1366",
        CITY: "Ramallah",
        DATE_CREATED: "20/10/2019 10:09",
        CLAIMED_VALUE: "36",
      },
      {
        EP_MAN_ICO_ID: "254",
        EFFECTIVE_DATE: "01/01/2019",
        EXPIRATION_DATE: "31/12/2019",
        HCP_ID: "1448",
        CLAIMING_HCP_ID: "267",
        VISIT_DATE: "07/09/2019",
        VISIT_SEQ: "28",
        CLAIM_PAYMENT_TYPE: "2",
        PAYMENT_TYPE: "NON-NETWORK",
        HCP_TYPE_ID: "6",
        "HCP Type": "Pharmacy",
        TPYE_OF_VISIT_ID: "1",
        Type: "Regular",
        CODE: "8",
        CHAPTER: "DISEASES OF THE RESPIRATORY SYSTEM",
        CODE_1: "53",
        SECTIONS: "Acute respiratory infections ",
        ICD9_CODE: "460",
        "ICD-9 Description": "ACUTE NASOPHARYNGITIS",
        "ICD-9 Description ar": "التهاب البلعوم الانفي الحاد ",
        DOCTOR_ID: "1448",
        SPECIALITY_ID: "1",
        DOCTOR_SPECIALITY: "G.P",
        GENDER_ID: "2",
        Gender: "Female",
        DEPENDENT_CODE: "2",
        AGE: "38",
        SUBSCRIBER_SEQ_ID: "41177",
        HOF_SEQ_ID: "41034",
        DEPENDANCE: "SPOUSE",
        "CLAIMED ITEM": "Tonimer nasal gel",
        ID: "24288",
        MANUFACTURERS_ID: "588",
        THR_CODE: "R01",
        THR_NAME: "Nasal Preparations",
        BRAND_ID: "3645",
        BRAND: "Tonimer",
        FORM_ID: "33",
        FORM: "Nasal Gel",
        SKU_ID: "TB",
        size: "20",
        UNIT_TYPE: "Milliliter",
        TOTAL_QTY: "1",
        DOSAGEAGE: "1 Milliliter / Day  For   ",
        UNIT_TYPE_ID: "40",
        CITY_CODE: "1366",
        CITY: "Ramallah",
        DATE_CREATED: "20/10/2019 10:13",
        CLAIMED_VALUE: "33",
      },
      {
        EP_MAN_ICO_ID: "254",
        EFFECTIVE_DATE: "01/01/2019",
        EXPIRATION_DATE: "31/12/2019",
        HCP_ID: "1448",
        CLAIMING_HCP_ID: "1448",
        VISIT_DATE: "07/09/2019",
        VISIT_SEQ: "28",
        CLAIM_PAYMENT_TYPE: "2",
        PAYMENT_TYPE: "NON-NETWORK",
        HCP_TYPE_ID: "3",
        "HCP Type": "Doctor",
        TPYE_OF_VISIT_ID: "1",
        Type: "Regular",
        CODE: "8",
        CHAPTER: "DISEASES OF THE RESPIRATORY SYSTEM",
        CODE_1: "53",
        SECTIONS: "Acute respiratory infections ",
        ICD9_CODE: "460",
        "ICD-9 Description": "ACUTE NASOPHARYNGITIS",
        "ICD-9 Description ar": "التهاب البلعوم الانفي الحاد ",
        DOCTOR_ID: "1448",
        SPECIALITY_ID: "1",
        DOCTOR_SPECIALITY: "G.P",
        GENDER_ID: "2",
        Gender: "Female",
        DEPENDENT_CODE: "2",
        AGE: "38",
        SUBSCRIBER_SEQ_ID: "41177",
        HOF_SEQ_ID: "41034",
        DEPENDANCE: "SPOUSE",
        "CLAIMED ITEM":
          "OFFICE/OUTPATIENT VISIT, NEW (LEVEL I) , G.P Visit Fees",
        DOSAGEAGE: "  /   For   ",
        EP_MDC_CPT_CODE: "99201",
        CITY_CODE: "1372",
        CITY: "Hebron",
        DATE_CREATED: "20/10/2019 10:09",
        CLAIMED_VALUE: "40",
      },
      {
        EP_MAN_ICO_ID: "254",
        EFFECTIVE_DATE: "01/01/2019",
        EXPIRATION_DATE: "31/12/2019",
        HCP_ID: "1448",
        CLAIMING_HCP_ID: "267",
        VISIT_DATE: "07/09/2019",
        VISIT_SEQ: "28",
        CLAIM_PAYMENT_TYPE: "2",
        PAYMENT_TYPE: "NON-NETWORK",
        HCP_TYPE_ID: "6",
        "HCP Type": "Pharmacy",
        TPYE_OF_VISIT_ID: "1",
        Type: "Regular",
        CODE: "8",
        CHAPTER: "DISEASES OF THE RESPIRATORY SYSTEM",
        CODE_1: "53",
        SECTIONS: "Acute respiratory infections ",
        ICD9_CODE: "460",
        "ICD-9 Description": "ACUTE NASOPHARYNGITIS",
        "ICD-9 Description ar": "التهاب البلعوم الانفي الحاد ",
        DOCTOR_ID: "1448",
        SPECIALITY_ID: "1",
        DOCTOR_SPECIALITY: "G.P",
        GENDER_ID: "2",
        Gender: "Female",
        DEPENDENT_CODE: "2",
        AGE: "38",
        SUBSCRIBER_SEQ_ID: "41177",
        HOF_SEQ_ID: "41034",
        DEPENDANCE: "SPOUSE",
        "CLAIMED ITEM": "Augmentin 875mg 14tab.",
        ID: "21187",
        MANUFACTURERS_ID: "508",
        THR_CODE: "J01CR",
        THR_NAME: "Comb Of Penicillins ,Incl Beta-Lactamase Inhibitor",
        BRAND_ID: "6192",
        BRAND: "Augmentin",
        FORM_ID: "1",
        FORM: "Tablet",
        SKU_ID: "BX",
        size: "14",
        UNIT_TYPE: "Tablet",
        TOTAL_QTY: "1",
        DOSAGEAGE: "2 Tablet / Day  For   ",
        UNIT_TYPE_ID: "26",
        CITY_CODE: "1366",
        CITY: "Ramallah",
        DATE_CREATED: "20/10/2019 10:14",
        CLAIMED_VALUE: "39",
      },
      {
        EP_MAN_ICO_ID: "254",
        EFFECTIVE_DATE: "01/01/2019",
        EXPIRATION_DATE: "31/12/2019",
        HCP_ID: "1448",
        CLAIMING_HCP_ID: "267",
        VISIT_DATE: "07/09/2019",
        VISIT_SEQ: "28",
        CLAIM_PAYMENT_TYPE: "2",
        PAYMENT_TYPE: "NON-NETWORK",
        HCP_TYPE_ID: "6",
        "HCP Type": "Pharmacy",
        TPYE_OF_VISIT_ID: "1",
        Type: "Regular",
        CODE: "8",
        CHAPTER: "DISEASES OF THE RESPIRATORY SYSTEM",
        CODE_1: "53",
        SECTIONS: "Acute respiratory infections ",
        ICD9_CODE: "460",
        "ICD-9 Description": "ACUTE NASOPHARYNGITIS",
        "ICD-9 Description ar": "التهاب البلعوم الانفي الحاد ",
        DOCTOR_ID: "1448",
        SPECIALITY_ID: "1",
        DOCTOR_SPECIALITY: "G.P",
        GENDER_ID: "2",
        Gender: "Female",
        DEPENDENT_CODE: "2",
        AGE: "38",
        SUBSCRIBER_SEQ_ID: "41177",
        HOF_SEQ_ID: "41034",
        DEPENDANCE: "SPOUSE",
        "CLAIMED ITEM": "Cataflam 50mg 20tab.",
        ID: "21315",
        MANUFACTURERS_ID: "162",
        THR_CODE: "M01A",
        THR_NAME: "Anti-Inflamma & Anti-Rheumat Products,Non-Steroids",
        BRAND_ID: "6232",
        BRAND: "Cataflam",
        FORM_ID: "1",
        FORM: "Tablet",
        SKU_ID: "BX",
        size: "20",
        UNIT_TYPE: "Tablet",
        TOTAL_QTY: "1",
        DOSAGEAGE: "2 Tablet / Day  For   ",
        UNIT_TYPE_ID: "26",
        CITY_CODE: "1366",
        CITY: "Ramallah",
        DATE_CREATED: "20/10/2019 10:10",
        CLAIMED_VALUE: "25",
      },
    ];

    await TransactionsAPI(transactions)
        .then((res) => {
          message.success("Transaction have been added!");
          setIsFetching(false);
        })
        .catch((err) => {
          message.error(err.message);
          setIsFetching(false);
        });
  }

  return (
    <Layout>
      <Header>
        <Menu mode="horizontal" defaultSelectedKeys={["transactions"]}>
          <Menu.Item key="logo" icon={<CodepenCircleFilled />}>
            <Link to="/">FDS</Link>
          </Menu.Item>
          <Menu.Item key="transactions" icon={<ThunderboltFilled />}>
            <Link to="/">LIVE</Link>
          </Menu.Item>
          <Menu.Item key="generator">
            <Button
              type="primary"
              loading={isFetching}
              onClick={() => {
                addNewTransaction();
              }}
            >
              Generate New Transaction{" "}
            </Button>
          </Menu.Item>
        </Menu>
      </Header>
      <Content>
        <Routes>
          <Route path="/" element={<Transactions />} />
        </Routes>
      </Content>
      <Footer>Footer</Footer>
    </Layout>
  );
}

export default Main;

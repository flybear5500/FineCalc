import React, { useState  } from 'react';
import axios from "axios";
import { Form, Spin , AutoComplete, message, Button, Input } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { Chart } from "react-google-charts";
import { calcFine, searchAddress, calcAllAddress } from "./utils/APIRoutes";

const onFinish = (values) => {
  console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

function Mainform () {
  const [options, setOptions] = useState([]);
  const [colE, setColE] = useState("");
  const [colF, setColF] = useState("");
  const [colJ, setColJ] = useState("");
  const [actualEmissions, setActualEmissions] = useState("0");
  const [allowedEmissions, setAllowedEmissions] = useState("0");
  const [fineAmount, setFineAmount ] = useState("0");
  const [loading, setLoading] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);

  const data3 = [
    ["Element", "Amount", { role: "style" }],
    ["Natural Gas Use (therms)", parseFloat(colE), "#964B00"], // RGB value
  ];

  const data2 = [
    ["Element", "Amount", { role: "style" }],
    ["Allowed emissions", parseFloat(allowedEmissions), "#4285F4"], // RGB value
    ["Actual emissions", parseFloat(actualEmissions), "#EA4335"], // English color name
    ["Fine Amount", parseFloat(fineAmount), "#FBC02D"]
  ];

  const data4 = [
    ["Element", "Amount", { role: "style" }],
    ["Electricity Use - Grid Purchase (kWh)", parseFloat(colF), "#FFFF00"], // English color name
  ];

  const data5 = [
    ["Element", "Amount", { role: "style" }],
    ["Water Use (All Water Sources) (kgal)", parseFloat(colJ), "#0000FF"]
  ];

  const onSelect = async(data) => {
    //console.log('onSelect', data);
    let keydata = data;

    setActualEmissions(0);
    setAllowedEmissions(0);
    setFineAmount(0);
    setColE(0);
    setColF(0);
    setColJ(0);
    setLoading(true);
    setSelectionMode(false);

    try{
      
      const { data } = await axios.get(calcFine, { params: { key: keydata } });
      
      setTimeout(() => {
        // After 3 seconds, update state with the data from the server
        if(!data["existcsv"]){
          message.error("CSV File Not Found");
          setOptions([]);
        }
        else
        {
          if(!data["result"]){
            message.error('Your building does not meet the threshold for Local Law 97 as it’s less than 25,000 sq/ft', 2);
          }
          else
          {
            setSelectionMode(true);
            setActualEmissions(data["actualEmissions"]);
            setAllowedEmissions(data["allowedEmissions"]);
            setFineAmount(data["fineAmount"]);
            setColE(data["colE"]);
            setColF(data["colF"]);
            setColJ(data["colJ"]);
          }
        }
        setLoading(false); // Stop spinner
      }, 3000);
      
    }catch(ex){
      message.error("Network Error");
    }
  };

  const onSearch = async (searchText) => {

    try{
      
      if(!searchText){
        setOptions([]);
      }else{
        const { data } = await axios.get(searchAddress, { params: { key: searchText } });
        if(!data["existcsv"])
        {         
          message.error("CSV File Not Found");
          setOptions([]);
        }
        else
        {
          let dataArr = data["result"];
          setOptions([]);
          setOptions(dataArr.map(word => ({ value: word })))
        }
      }
      
    }catch(ex){
      message.error("Network Error");
    }

  };

  const onFineDownload = async() => {
    try {
      const response = await axios.get(calcAllAddress, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'fines.csv');
      document.body.appendChild(link);
      link.click();
    } catch (ex) {
      message.error("Network Error");
    }
  }

  return (
    <div>
      <Form
      name="basic"
      style={{
        alignItems: 'center',
        marginLeft: '35%',
        paddingTop: '3%',
        paddingBottom: '2%',
        fontSize: '18px',
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <div style={{layout: "inline", display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <Form.Item
          label={<span style={{fontSize: "20px", fontFamily: "Merriweather"}}>Address</span>}
          name="address"
          style={{ width: "80%", layout: "inline", marginBottom: '0px', fontSize: '16px' }}
        >
          <AutoComplete
            options={options}
            style={{
              width: 300,
              fontSize: "20px"
            }}
            onSelect = {onSelect}
            onSearch = {onSearch}
          ><Input style={{ fontSize: '16px' }} /></AutoComplete>
        </Form.Item>
      </div>
      {selectionMode && (
        <div>
          <Form.Item
              label={<span style={{fontSize: "20px", fontFamily: "Merriweather"}}>Your carbon emissions are</span>}
              name="carbonemissons"
              style={{ width: "80%", fontSize: "30px"}}
          ><div style={{fontSize: "18px"}}>{actualEmissions}</div></Form.Item>
          <Form.Item
              label={<span style={{fontSize: "20px", fontFamily: "Merriweather"}}>Your allowable emissions under Local Law 97 are</span>}
              name="carbonemissons"
              style={{ width: "80%"}}
          ><div style={{fontSize: "18px"}}>{allowedEmissions}</div></Form.Item>
          <Form.Item
              label={
                <span style={{fontSize: "20px", fontFamily: "Merriweather"}}>
                  {fineAmount === "0.00" 
                    ? "Based on the last available data you are likely to have no fine." 
                    : "Your potential fine based on last available data is"
                  }
                </span>
              }
              name="carbonemissions"
              style={{ width: "100%", fontSize: "24px"}}
              colon={fineAmount === "0.00" ? false : true}
          >
          <div style={{fontSize: "18px"}}>{fineAmount === "0.00" ? null : fineAmount}</div>
          </Form.Item>
        </div>
      )}
    </Form>    
    <div style={{
      display: 'grid', 
      gridTemplateColumns: '2fr 1.2fr 1.2fr 1.2fr 0.2fr', 
      alignItems: 'center', 
      gap: '20px', 
      marginLeft: "5vw", 
      
    }}>
      <Chart chartType="ColumnChart" width="100%" height="400px" data={data2} options={{vAxis: { textStyle: { color: '#000000' } } }} />
      <Chart chartType="ColumnChart" width="100%" height="400px" data={data3} options={{vAxis: { textStyle: { color: '#000000' } } }} />
      <Chart chartType="ColumnChart" width="100%" height="400px" data={data4} options={{vAxis: { textStyle: { color: '#000000' } } }} />
      <Chart chartType="ColumnChart" width="100%" height="400px" data={data5} options={{vAxis: { textStyle: { color: '#000000' } } }} />
      <Button type="primary" icon={<DownloadOutlined />} onClick={ onFineDownload } style={{backgroundColor: "rgb(249 67 67 / 79%)"}}>
        Download Fine.csv
      </Button>
    </div>
      {loading && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          backgroundColor: 'rgba(255, 255, 255, 0.8)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          zIndex: 1000 // ensure the loading overlay appears on top of all other content
        }}>
          <Spin size="large"/>
          <div style={{ color: 'black', fontSize: '20px', marginTop: '20px', textAlign: 'center',fontFamily: "Times New Roman" }}>Calculating your energy usage</div>
        </div>
      )}
  </div>
  );
}


export default Mainform;
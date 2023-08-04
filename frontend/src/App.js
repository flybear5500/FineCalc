import colorBgContainer from './logo.svg';
import './App.css';
import { Layout, Image } from 'antd';
import  Mainform  from './Mainform';
import React from 'react';
const { Header, Content, Footer } = Layout;


function App() {
  return (
      <Layout style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '100px',
            background: '#f0f0f0',
          }}
        >
          <Image src="./daisy-logo.png" height={'100%'} preview={false} style={ {padding: "20px"} }></Image>
          <div style={{margin: "25%", color: "black", fontSize: "40px", fontFamily: "Merriweather"}}>Local Law 97 Fines Calculator</div>
        </Header>
      <Content
        style={{
          padding: '0 50px',
        }}
      >
        <Layout
          style={{
            padding: '24px 0',
            background: colorBgContainer,
          }}
        >
          <Content
            style={{
              padding: '0 24px',
              minHeight: 280,
              alignItems: 'center',
              
            }}
          >
            <Mainform></Mainform>
          </Content>
        </Layout>
      </Content>
      <Footer
        style={{
          textAlign: 'center',
          backgroundColor: 'black',
          color: 'white',
          background: 'rgb(249 67 67 / 79%)',
        }}
      >
        <div style={{fontSize:'16px'}}>@Local Law 97 Fines Calculator</div>
      </Footer>
    </Layout>
  );
}

export default App;

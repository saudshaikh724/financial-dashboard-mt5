import 'bootstrap/dist/css/bootstrap.min.css';
import * as ReactBootstrap from "react-bootstrap";
import { Space, Table, Typography, Spin } from "antd";
import React, { useState, useEffect } from "react";
import SocketIO from "socket.io-client";
import HistoricalTrades from '../HistoricalTrades';
import DashboardChart from '../DashboardChart';

function Dashbaord(){
  const [symbolData, setSymbolData] = useState({});
  const [loading, setLoading] = useState(false);
  const [symbolName, setSymbolName] = useState('USDCAD.ecn');
  const [accountInfo, setAccountInfo] = useState({});
  const [openPositions, setOpenPositions] = useState([]);
 
  useEffect(() => {
    setLoading(true);
    
    const socket = SocketIO("http://127.0.0.1:6004");

    socket.on("connect", () => {
      console.log("Connected to the backend");
      socket.emit("get_symbol_data"); // Trigger the get_symbol_data event
      setLoading(false);
    });

    socket.on("disconnect", () => {
      setLoading(true);
      console.log("Disconnected from the backend");
    });

    socket.on("symbol_data", (data) => {
      console.log('Data', data);
      setSymbolData(data); // Update symbolData state with new data
      setLoading(false);
    });

    socket.on('account_info', (data) => {
      setAccountInfo(data.account_info);
      setOpenPositions(data.open_positions);
      console.log('SetAccountInfo', data)
    });

    socket.emit('get_account_info');

    return () => {
      setLoading(true);
      socket.disconnect(); // Clean up: disconnect socket on component unmount
    };
  }, []);

  const handleClick = (symbolKey) => {
    setSymbolName(symbolKey);
  };
    return(
        <>
        
            <div className="container-fluid">
            <Typography.Title level={4}>Dashboard</Typography.Title>
                <div className="row">
                    <div className="col-12">
                         <p className="f-600 font-22 ">Account Number {accountInfo.login}</p>
                    </div>

                    <div className="col-12">
                        <div className="row">
                            <div className="col-5">
                                <div className="card h-100"> 
                                        <div className="card-body p-3">
                                            <div className="row mb-2">
                                                <div className="col-8 border-right">
                                                        <p className="mb-0 font-24 f-600">Account Balance</p>
                                                        <p className="font-24 f-600">${accountInfo.balance}</p>
                                                </div>
                                                <div className="col-4">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                                <p className="mb-2 font-16">Credit</p>
                                                                <p className="mb-2 font-16">${accountInfo.credit}</p>
                                                        </div>
                                                        <div className="d-flex align-items-center justify-content-between">
                                                                <p className="mb-2 font-16">Profit/Loss</p>
                                                                <p className="mb-2 font-16">${accountInfo.profit}</p>
                                                        </div>
                                                        <div className="d-flex align-items-center justify-content-between">
                                                                <p className="mb-2 font-16">Equity</p>
                                                                <p className="mb-2 font-16">${accountInfo.equity}</p>
                                                        </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12 d-flex align-items-center justify-content-end">
                                                    <ReactBootstrap.Button bsStyle="success" bsSize="small">
                                                        View Details
                                                    </ReactBootstrap.Button>
                                                </div>
                                            </div>
                                        </div>
                                </div>
                            </div>
                            <div className="col-7">
                            <div className="card h-100"> 
                                        <div className="card-body p-3">
                                            <div className="row mb-2">
                                                <div className="col-6 ">
                                                        <p className="mb-0 font-24 f-600">Open Positions</p>
                                                        <p className="font-24 f-600">${openPositions}</p>
                                                </div>
                                                <div className="col-3 border-right">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                                <p className="mb-2 font-16">Free Margin</p>
                                                                <p className="mb-2 font-16">${accountInfo.margin_free}</p>
                                                        </div>
                                                        <div className="d-flex align-items-center justify-content-between">
                                                                <p className="mb-2 font-16">Currency</p>
                                                                <p className="mb-2 font-16">{accountInfo.currency}</p>
                                                        </div>
                                                        <div>
                                                            &nbsp;
                                                        </div>
                                                </div>
                                                <div className="col-3">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                                <p className="mb-2 font-16">Limit_Orders</p>
                                                                <p className="mb-2 font-16">${accountInfo.limit_orders}</p>
                                                        </div>
                                                        <div className="d-flex align-items-center justify-content-between">
                                                                <p className="mb-2 font-16">Leverage</p>
                                                                <p className="mb-2 font-16">${accountInfo.leverage}</p>
                                                        </div>
                                                        <div>
                                                            &nbsp;
                                                        </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12 d-flex align-items-center justify-content-end">
                                                    <ReactBootstrap.Button bsStyle="success" bsSize="small">
                                                        View Details
                                                    </ReactBootstrap.Button>
                                                </div>
                                            </div>
                                        </div>
                                </div>
                            </div>
                        </div>
                       
                    </div>  
                    
                    <div className="col-12 mt-4">
                        <div className="row">
                        <div className="col-6">
                          <Typography.Title level={5}>Market Overview</Typography.Title>
                          { symbolData[symbolName] ? <DashboardChart onDataChange={symbolData[symbolName].current} onNameChange={symbolName} onTimeChange={symbolData[symbolName].curr_time}/> : <p>failed</p> }
                        
                        </div>
                        
                        
                        <div className="col-6">
                            <Typography.Title level={5}>Market Watch</Typography.Title>
                                <div className="card h-90">
                                    <div className="card-body">
                                    <table className="symbol-table" loading={loading}>
                                    
                                    <thead>
                                      <tr>
                                        <th>Symbol</th>
                                        <th>Bid</th>
                                        <th>Ask</th>
                                        <th>Change</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {Object.keys(symbolData).map((symbolKey) => (
                                        <tr key={symbolKey} onClick={() => handleClick(symbolKey)} className="hoverable">
                                          <td>{symbolKey}</td>
                                          <td>${symbolData[symbolKey].bid}</td>
                                          <td>${symbolData[symbolKey].ask}</td>
                                          <td>
                                            {(symbolData[symbolKey].ask-symbolData[symbolKey].bid/symbolData[symbolKey].bid*100) > 0 ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke="#34B26F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                <path d="M17 6H23V12" stroke="#34B26F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                </svg>: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M23 18L13.5 8.5L8.5 13.5L1 6" stroke="#E31C41" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                        <path d="M17 18H23V12" stroke="#E31C41" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                        </svg>}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                    
                                  </table> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            
            </div>
            
        <HistoricalTrades/>
        
        </>
    );
}

export default Dashbaord;
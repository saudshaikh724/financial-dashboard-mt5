import { Space, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://127.0.0.1:6004");

function HistoricalTrades() {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    setLoading(true);

    // Fetch open positions initially
    socket.emit('get_historical_trades');

    socket.on('historical_trades', (data) => {
      setDataSource(data);
      setLoading(false);
    });

    return () => {
      socket.off('historical_trades');
    };
  }, []);

  const columns = [
    {
      title: "Ticket",
      dataIndex: "ticket",
    },
    {
      title: "Symbol",
      dataIndex: "symbol",
    },
    {
      title: "Volume",
      dataIndex: "volume",
    },
    {
      title: "Entry Price",
      dataIndex: "entry",
    },
    {
      title: "Current Price",
      dataIndex: "price",
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (type) => {
        return type === 0 ? 'Buy' : 'Sell';
      },
    },
    {
      title: "Profit",
      dataIndex: "profit",
    },
    {
      title: "Commission",
      dataIndex: "commission",
    },
    {
      title: "Swap",
      dataIndex: "swap",
    },
    {
      title: "Comment",
      dataIndex: "comment",
    },
    {
      title: "Time",
      dataIndex: "time",
      render: (time) => {
        // Convert Unix timestamp to readable format if needed
        return new Date(time * 1000).toLocaleString();
      },
    },
  ];

  return (
    <Space size={10} direction="vertical">
      <h1></h1>
      <Typography.Title level={5}>Historical Trades</Typography.Title>
      <Table
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        // size="small"
      />
    </Space>
  );
}

export default HistoricalTrades;

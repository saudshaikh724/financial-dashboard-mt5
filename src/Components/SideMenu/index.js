import {
  AppstoreOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  DashboardOutlined,
  LineChartOutlined,
  RightOutlined,
  LeftOutlined
} from "@ant-design/icons";
import { Menu, Button } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function SideMenu() {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState("/");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const pathName = location.pathname;
    setSelectedKeys(pathName);
  }, [location.pathname]);

  const navigate = useNavigate();
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="SideMenuContainer" style={{ display: 'flex', position: 'relative' }}>
      <div className={`SideMenu ${collapsed ? 'collapsed' : ''}`}>
        <Menu
          className="SideMenuVertical"
          mode="inline"
          inlineCollapsed={collapsed}
          onClick={(item) => {
            navigate(item.key);
          }}
          selectedKeys={[selectedKeys]}
          items={[
            {
              label: "Dashboard",
              icon: <DashboardOutlined />,
              key: "/",
            },
            {
              label: "Performance",
              key: "/performance",
              icon: <LineChartOutlined />,
            },
            {
              label: "Deposit",
              key: "/deposit",
              icon: <ShoppingCartOutlined />,
            },
            {
              label: "History",
              key:  "/history",
              icon: <UserOutlined />,
            },
            {
              label: "Transfer",
              key: "/transfer",
              icon: <UserOutlined />,
            },
            {
              label: "Withdrawal",
              key: "/withdrawal",
              icon: <UserOutlined />,
            },
            {
              label: "My Referral",
              key: "/myreferral",
              icon: <UserOutlined />,
            },
          ]}
        ></Menu>
      </div>
      <Button
        type="text"
        onClick={toggleCollapsed}
        className="SideMenuToggle"
        icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
        style={{
          position: 'absolute',
          top: 16,
          left: collapsed ? 71 : 188,
          transition: 'left 0.2s',
          padding: 0,
          background: 'transparent',
          border: 'none',
          width: '5px',
          height: '5px',
        }}
      />
    </div>
  );
}

export default SideMenu;

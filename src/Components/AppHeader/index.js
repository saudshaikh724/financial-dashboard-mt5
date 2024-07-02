import { BellFilled} from "@ant-design/icons";
import { Badge,Image,Space} from "antd";


function AppHeader() {
  return (
    <div className="AppHeader">
      <Image
        width={150}
        src="https://vortexfx.trade/assets/uploads/logo/logo.png"
      ></Image>
     
      <Space>
        <Badge>
          <BellFilled
            style={{ fontSize: 24 }}
          />
        </Badge>
      </Space>
    </div>
  );
}
export default AppHeader;

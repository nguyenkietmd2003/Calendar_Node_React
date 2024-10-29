import React from "react";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Avatar, Card } from "antd";
const { Meta } = Card;
const NewHomePage = (data) => {
  return (
    <Card
      style={{
        width: 300,
        height: 250,
      }}
      cover={<img alt="example" src={data?.data?.src} />}
    >
      <Meta
        description={
          <span style={{ color: "blue" }}>{data?.data?.description}</span>
        }
      />
    </Card>
  );
};
export default NewHomePage;

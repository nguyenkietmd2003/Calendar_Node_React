import React, { useEffect, useState } from "react";
import { List, Card, Image } from "antd";
import { getProductByTag } from "../../util/api";
import { useNavigate } from "react-router-dom";

const CategoryHomePage = ({ id }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchDataIpad = async (categoryId) => {
      try {
        const result = await getProductByTag(categoryId);
        setProducts(result.message);
        console.log("check data ipad: ", result.message);
      } catch (error) {
        console.log("error fetching product", error);
      }
    };
    if (id) {
      fetchDataIpad(id);
    }
  }, [id]);

  return (
    <div className="bg-slate-500 pt-3">
      <List
        grid={{ gutter: 10, column: 5 }} // Điều chỉnh số cột và khoảng cách
        dataSource={products}
        renderItem={(item) => (
          <List.Item>
            <Card
              hoverable
              cover={
                <Image
                  alt={item.title}
                  src={item.img}
                  style={{ height: "100px" }}
                />
              }
            >
              <Card.Meta
                onClick={() => {
                  navigate(`/detail-product/${item.id_product}`);
                }}
                title={item.title}
                description={`Price: ${item.price}`}
              />
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default CategoryHomePage;

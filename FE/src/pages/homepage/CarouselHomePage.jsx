import React from "react";
import { Carousel } from "antd";

const contentStyle = {
  height: "40vh",
  position: "relative",
  color: "#fff",
  textAlign: "center",
  background: "#364d79",
};

const descriptionStyle = {
  position: "absolute",
  bottom: "10px",
  left: "0",
  width: "100%",
  color: "orange",
  textAlign: "center",
  background: "rgba(0, 0, 0, 0.5)",
  padding: "10px 0",
};

const CarouselHomePage = () => (
  <Carousel
    autoplay
    style={{ width: "100%", borderRadius: 8, overflow: "hidden" }}
  >
    <div>
      <div style={contentStyle}>
        <img
          src="https://file.hstatic.net/1000198144/file/8457359_tinhte-tinhte-unbox-iphone-16-pro--13.jpg"
          alt="Image 1"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={descriptionStyle}>Mẫu Iphone 16 mới nhất</div>
      </div>
    </div>
    <div>
      <div style={contentStyle}>
        <img
          src="https://file.hstatic.net/1000198144/file/dsc02224_e9da184244ef48bea516d8748d11e3b5_1024x1024.jpg"
          alt="Image 2"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={descriptionStyle}>Kích thước màn hình iphone 16</div>
      </div>
    </div>
    <div>
      <div style={contentStyle}>
        <img
          src="https://icdn.24h.com.vn/upload/4-2024/images/2024-10-17/diem-danh-smartphone-co-lon-hieu-nang-khung-nhat-nam-2024----nh-ch---p-m--n-h--nh-2024-10-17-171732-1729160580-179-width1486height835.png"
          alt="Image 3"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={descriptionStyle}>
          Iphone loạt top mẫu điện thoại có màn hình cỡ lớn
        </div>
      </div>
    </div>
    <div>
      <div style={contentStyle}>
        <img
          src="https://file.hstatic.net/1000198144/article/cover-18_18102024064844.jpg_18102024064844_6094a7c140fe40e98cf2758f696e6528_large.jpg"
          alt="Image 4"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={descriptionStyle}>Tính năng mới trên iphone</div>
      </div>
    </div>
  </Carousel>
);

export default CarouselHomePage;

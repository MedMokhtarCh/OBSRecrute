import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import wallpaper from "../assets/wallpaper.jpg";
import wallpaper1 from "../assets/wallpaper1.jpg";
import 'bootstrap/dist/css/bootstrap.min.css';
const CarouselComponent = () => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
   
    <Carousel activeIndex={index} onSelect={handleSelect} interval={3000} fade >
      

      <Carousel.Item>
  <img
    className="d-block w-100"
    src={wallpaper1}
    alt="Second slide"
    style={{ maxHeight: "500px", objectFit: "cover",filter: "blur(4px)", }}
  />
  <Carousel.Caption
    style={{
      position: "absolute",
     
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center",
      width: "80%", // Ajuste la largeur pour éviter les coupures
      color: "white", // Assure une bonne visibilité
    }}
  >
    <h1>Find Your Dream Job Today</h1>
    <h3>Connecting Talent with Opportunities Across the Nation for Every Skill Level</h3>
  </Carousel.Caption>
</Carousel.Item>


      <Carousel.Item>
        <img
          className="d-block w-100"
          src={wallpaper1}
          alt="Second slide"
          style={{ maxHeight: "500px", objectFit: "cover" }}
        />
        <Carousel.Caption>
          <h1>Find Your Dream Job Today</h1>
          <h3>Connecting Talent with Opportunities Across the Nation for Every Skill
          Level</h3>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
 
  );
};

export default CarouselComponent;

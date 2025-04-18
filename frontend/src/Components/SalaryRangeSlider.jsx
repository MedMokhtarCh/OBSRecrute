import React, { useState } from "react";
import Slider from "rc-slider";


const SalaryFilter = () => {
  const [range, setRange] = useState([30000, 120000]);

  const handleChange = (value) => {
    setRange(value);
  };

  return (
    <div className="salary-filter-container">
      <h2 className="salary-title">Salary Range</h2>
      <div className="slider-wrapper">
        <Slider.Range
          min={0}
          max={200000}
          step={1000}
          value={range}
          onChange={handleChange}
          allowCross={false}
        />
        <div className="salary-values">
          <span>${range[0].toLocaleString()}</span>
          <span>${range[1].toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default SalaryFilter;

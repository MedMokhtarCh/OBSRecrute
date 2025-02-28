import React from 'react'

import TopCategories from '../Components/TopCategories'
import HowItWorks from '../Components/HowItWorks'
import CarouselComponent from '../Components/CarouselComponent'

const Home = () => {
  return (
    <>
    <CarouselComponent/>
  
      <TopCategories/>
      <HowItWorks/>
    </>
  )
}

export default Home

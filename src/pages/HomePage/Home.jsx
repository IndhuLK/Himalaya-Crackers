import React from 'react';
import Hero from './Hero';
import FeaturedCategories from './FeaturedCategories';
import TopSelling from './TopSelling';
import TrustBadges from './TrustBadges';
import DeliveryAreas from './DeliveryAreas';
import CTASection from './CTASection';

const Home = () => {
  return (
    <div className="scroll-smooth">
      <Hero />
      <FeaturedCategories />
      <TopSelling />
      <TrustBadges />
      <DeliveryAreas />
      <CTASection />
    </div>
  );
};

export default Home;

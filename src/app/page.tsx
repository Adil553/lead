"use client";

import { useState } from "react";

const Home = () => {
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(false);

  const toggleIsMapVisble = () => setIsMapVisible((prev) => !prev);
  const toggleFilterSheet = () => setIsFilterSheetOpen(!isFilterSheetOpen);

  return (
    <>
      <div className="container mx-auto my-0">{/* Fixed Header */}</div>
    </>
  );
};

export default Home;

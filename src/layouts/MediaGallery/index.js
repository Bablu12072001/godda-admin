import React, { useState } from "react";
import { Container, Tab, Tabs, Typography } from "@mui/material";
import PhotoGallery from "layouts/MediaGallery/PhotoGallery";
import VideoGallery from "layouts/MediaGallery/VideoGallery";
import GloriousImages from "layouts/MediaGallery/GloriousImages";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

const Index = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <DashboardLayout>
      <Container>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          centered
          indicatorColor="primary"
          textColor="primary"
          sx={{
            marginBottom: 2,
            "& .MuiTabs-flexContainer": {
              justifyContent: "space-between",
            },
          }}
        >
          <Tab
            label="Photo Gallery"
            sx={{
              minWidth: "50%",
              color: currentTab === 0 ? "#000" : "inherit",
              backgroundColor: currentTab === 0 ? "#E3F2FD" : "inherit",
              borderRadius: "5px",
            }}
          />
          <Tab
            label="Video Gallery"
            sx={{
              minWidth: "50%",
              color: currentTab === 1 ? "#000" : "inherit",
              backgroundColor: currentTab === 1 ? "#E3F2FD" : "inherit",
              borderRadius: "5px",
            }}
          />
          <Tab
            label="Glorious Moments Images"
            sx={{
              minWidth: "50%",
              color: currentTab === 2 ? "#000" : "inherit",
              backgroundColor: currentTab === 2 ? "#E3F2FD" : "inherit",
              borderRadius: "5px",
            }}
          />
        </Tabs>
        {currentTab === 0 && <PhotoGallery />}
        {currentTab === 1 && <VideoGallery />}
        {currentTab === 2 && <GloriousImages />}
      </Container>
    </DashboardLayout>
  );
};

export default Index;

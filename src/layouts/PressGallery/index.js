import React, { useState } from "react";
import { Container, Tab, Tabs, Typography } from "@mui/material";
import PhotoPress from "layouts/PressGallery/PressPhoto";
import VideoPress from "layouts/PressGallery/PressVideo";
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
            label="Press Photo"
            sx={{
              //   minWidth: "50%",
              color: currentTab === 0 ? "#000" : "inherit",
              backgroundColor: currentTab === 0 ? "#E3F2FD" : "inherit",
              borderRadius: "5px",
            }}
          />
          <Tab
            label="Press Video"
            sx={{
              //   minWidth: "50%",
              color: currentTab === 1 ? "#000" : "inherit",
              backgroundColor: currentTab === 1 ? "#E3F2FD" : "inherit",
              borderRadius: "5px",
            }}
          />
        </Tabs>
        {currentTab === 0 && <PhotoPress />}
        {currentTab === 1 && <VideoPress />}
      </Container>
    </DashboardLayout>
  );
};

export default Index;

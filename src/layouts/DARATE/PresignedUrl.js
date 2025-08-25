import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "Constants";

const MyComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${apiUrl}/jmoa_circular_resolution_notice_presigned`, {
          folder_name: "circular",
          file_name: "test.pdf",
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run effect only once

  return data;
};

export default MyComponent;

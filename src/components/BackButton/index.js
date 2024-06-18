import { Button } from "@mui/material";
import { Link } from "react-router-dom";
export default function BackButton() {
  return (
    <Link to={-1}>
      <Button style={{ marginLeft: "50px" }} color="white" variant="contained" size="sm">
        ← Back{" "}
      </Button>
    </Link>
  );
}

import axios from "axios";
import { getConfig } from "../utils/config";

export default axios.create({
  baseURL: ``,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

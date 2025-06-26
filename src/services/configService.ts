import { RESPONSE } from "@/utils/types";
import apiClient, { CONFIG_KEY } from "./apiClient";
import axios from "axios";

export const configService = {
  getConfig: async (
    storeId: number | undefined
  ): Promise<RESPONSE | undefined> => {
    if (!storeId) return;
    const response = await apiClient.post(
      "/api/blazorApi/configs",
      { storeId }, // body (correct place)
      {
        headers: {
          Authorization: CONFIG_KEY,
        },
      }
    );
    return response.data;
  },

  getLovs: async (): Promise<RESPONSE> => {
    const response = await apiClient.get("/api/blazorApi/lovs");
    return response.data;
  },
  getIpInfo: async (): Promise<RESPONSE> => {
    const response = await axios.get("http://www.geoplugin.net/json.gp");
    return response.data;
  },
};

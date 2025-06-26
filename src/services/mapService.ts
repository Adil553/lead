import { ADDRESS_RESPONSE, DISTANCE_RESPONSE, RESPONSE } from "@/utils/types";
import axios from "axios";

export const mapService = {
  getAddress: async (
    lat: number | null,
    long: number | null
  ): Promise<ADDRESS_RESPONSE> => {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${long}&zoom=18&addressdetails=1`,
      {
        headers: {
          "Accept-Language": "en",
        },
      }
    );
    return response.data;
  },
  getAddressList: async (
    query: string,
    countryCode: string
  ): Promise<RESPONSE> => {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?countrycodes=${countryCode}&addressdetails=1&q=${query}&format=jsonv2&polygon_geojson=1`,
      {
        headers: {
          "Accept-Language": "en",
        },
      }
    );
    return response.data;
  },
  getDistance: async (
    long1: number,
    lat1: number,
    long2: number,
    lat2: number
  ): Promise<DISTANCE_RESPONSE> => {
    const response = await axios.get(
      `https://router.project-osrm.org/route/v1/driving/${long1},${lat1};${long2},${lat2}?overview=full`
    );
    return response.data;
  },
};

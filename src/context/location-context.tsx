"use client";

import Spinner from "@/components/ui/spinner";
import { useGetIpInfo } from "@/hooks/useInitialData";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface LocationData {
  geoplugin_request?: string;
  geoplugin_status?: number;
  geoplugin_delay?: string;
  geoplugin_credit?: string;
  geoplugin_city?: string;
  geoplugin_region?: string;
  geoplugin_regionCode?: string;
  geoplugin_regionName?: string;
  geoplugin_areaCode?: string;
  geoplugin_dmaCode?: string;
  geoplugin_countryCode?: string;
  geoplugin_countryName?: string;
  geoplugin_inEU?: number;
  geoplugin_euVATrate?: boolean;
  geoplugin_continentCode?: string;
  geoplugin_continentName?: string;
  geoplugin_latitude?: string;
  geoplugin_longitude?: string;
  geoplugin_locationAccuracyRadius?: string;
  geoplugin_timezone?: string;
  geoplugin_currencyCode?: string;
  geoplugin_currencySymbol?: string | null;
  geoplugin_currencySymbol_UTF8?: string;
  geoplugin_currencyConverter?: number;
}

export interface UserLocation {
  userLatitude: number;
  userLongitude: number;
}

interface LocationContextType {
  ipInfo: LocationData | null;
  userLocation: UserLocation | null;
  selectedPosition: [number, number] | null;
  requestUserLocation: () => void;
  checkLocationPermission: () => Promise<PermissionState>;
  setSelectedPosition: (position: [number, number]) => void;
}

const LocationContext = createContext<LocationContextType>({
  ipInfo: null,
  userLocation: null,
  selectedPosition: null,
  requestUserLocation: () => {},
  checkLocationPermission: () => Promise.resolve("prompt"),
  setSelectedPosition: () => {},
});

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading } = useGetIpInfo() as {
    data: LocationData | undefined;
    isLoading: boolean;
    error: Error | null;
  };

  const [ipInfo, setIpInfo] = useState<LocationData | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ipInfo");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  const [userLocation, setUserLocation] = useState<UserLocation | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("userLocation");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  const [selectedPosition, setSelectedPosition] = useState<
    [number, number] | null
  >([userLocation?.userLatitude ?? 0, userLocation?.userLongitude ?? 0]);

  const checkLocationPermission = async (): Promise<PermissionState> => {
    if (typeof navigator === "undefined" || !navigator.permissions) {
      return "prompt"; // Fallback if Permissions API is not supported
    }

    try {
      const result = await navigator.permissions.query({ name: "geolocation" });
      return result.state; // 'granted' | 'prompt' | 'denied'
    } catch (error) {
      console.error("Error checking location permission:", error);
      return "prompt";
    }
  };

  // ✅ Request and persist user GPS location
  const requestUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation: UserLocation = {
          userLatitude: position.coords.latitude,
          userLongitude: position.coords.longitude,
        };
        if (selectedPosition === null || selectedPosition?.[0] === 0) {
          setSelectedPosition([
            newLocation.userLatitude,
            newLocation.userLongitude,
          ]);
        }
        setUserLocation(newLocation);
        localStorage.setItem("userLocation", JSON.stringify(newLocation));
      },
      (err) => {
        console.error("Geolocation error:", err);
      }
    );
  }, [selectedPosition]);

  // Update IP-based location
  useEffect(() => {
    if (data) {
      setIpInfo(data);
    }
  }, [data]);

  // Update localStorage when ipInfo changes
  useEffect(() => {
    if (ipInfo) {
      localStorage.setItem("ipInfo", JSON.stringify(ipInfo));
    }
  }, [ipInfo]);

  useEffect(() => {
    if (ipInfo?.geoplugin_longitude || userLocation?.userLongitude) {
      setSelectedPosition([
        userLocation?.userLatitude ??
          parseFloat(ipInfo?.geoplugin_latitude ?? "0"),
        userLocation?.userLongitude ??
          parseFloat(ipInfo?.geoplugin_longitude ?? "0"),
      ]);
    }
  }, [ipInfo, userLocation]);

  useEffect(() => {
    let permissionStatus: PermissionStatus;

    const handleChange = () => {
      if (permissionStatus.state === "granted") {
        // console.log("Location permission was granted.");
        requestUserLocation(); // Automatically fetch and store user location
      } else {
        // console.log("Location permission changed to:", permissionStatus.state);
      }
    };

    if (typeof navigator !== "undefined" && navigator.permissions) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((status) => {
          permissionStatus = status;
          permissionStatus.onchange = handleChange;
        })
        .catch((error) => {
          console.error("Failed to attach permission listener:", error);
        });
    }

    return () => {
      if (permissionStatus) {
        permissionStatus.onchange = null; // Clean up
      }
    };
  }, [requestUserLocation]);

  return isLoading ? (
    <Spinner />
  ) : (
    <LocationContext.Provider
      value={{
        ipInfo,
        userLocation,
        selectedPosition,
        requestUserLocation,
        checkLocationPermission,
        setSelectedPosition,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);

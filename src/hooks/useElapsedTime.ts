// hooks/useElapsedTime.ts
import moment from "moment";
import { useEffect, useState } from "react";

export const useElapsedTime = (requireTime: string, deliveryTime: string) => {
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    // Calculate the difference between deliveryTime and requireTime
    const calculateRemainingTime = () => {
      const currentTime = moment();
      const diffSeconds = moment(deliveryTime).diff(
        moment(currentTime),
        "seconds"
      );
      setTimeRemaining(diffSeconds > 0 ? diffSeconds : 0);
    };

    calculateRemainingTime(); // Initialize immediately
    const intervalId = setInterval(calculateRemainingTime, 1000);

    return () => clearInterval(intervalId);
  }, [requireTime, deliveryTime]);

  return {
    hours: Math.floor(timeRemaining / 3600),
    minutes: Math.floor((timeRemaining % 3600) / 60),
    seconds: timeRemaining % 60,
    timeRemaining,
  };
};

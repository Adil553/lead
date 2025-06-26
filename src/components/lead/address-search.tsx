import { useLocation } from "@/context/location-context";
import { useGetAddress, useGetAddressList } from "@/hooks/useMap";
import { ADDRESS_RESPONSE } from "@/utils/types";
import { Loader2, LocateFixed, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const AddressSearch = ({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (address: string) => void;
  disabled?: boolean;
}) => {
  const { selectedPosition, setSelectedPosition, requestUserLocation, ipInfo } =
    useLocation();

  const [searchAddress, setSearchAddress] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const listRef = useRef<HTMLUListElement>(null);

  // Add: refs for each list item
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const { data: addressList, isFetching } = useGetAddressList(
    searchAddress,
    ipInfo?.geoplugin_countryCode?.toUpperCase() || "PK"
  );

  const { data: addressData } = useGetAddress(
    selectedPosition?.[0] || 0,
    selectedPosition?.[1] || 0
  ) as { data: ADDRESS_RESPONSE | undefined };

  useEffect(() => {
    if (addressData?.display_name) {
      setSearchAddress("");
      const addressParts = addressData?.display_name;
      // Assuming the main address includes the first three parts (like society, area, and city)
      // const mainAddress = addressParts.slice(0, 2).join(",").trim();

      onChange(
        addressParts +
          ", " +
          (addressData?.address?.city ?? addressData?.address?.district ?? "")
      );
    }
  }, [addressData, onChange]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && itemRefs.current[highlightedIndex]) {
      itemRefs.current[highlightedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [highlightedIndex]);

  // Reset highlight and refs when address list changes
  useEffect(() => {
    setHighlightedIndex(-1);
    itemRefs.current = [];
  }, [addressList]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!Array.isArray(addressList) || addressList.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < addressList.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : addressList.length - 1
      );
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      onAddressClick(addressList[highlightedIndex]);
    }
  };

  const clearSearch = () => {
    setSearchAddress("");
    onChange("");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onAddressClick = (addr: any) => {
    const lat = parseFloat(addr.lat);
    const lng = parseFloat(addr.lon);
    setSelectedPosition([lat, lng]);
    onChange(addr.display_name);
    setSearchAddress("");
  };
  return (
    <div className="flex gap-2 items-start">
      <div className="relative space-y-2 w-full">
        <Textarea
          id="shownAddress"
          value={searchAddress || value}
          onChange={(e) => {
            setSearchAddress(e.target.value);
            onChange(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search for your address"
          className="resize-none pe-5"
          disabled={disabled}
        />
        {isFetching && (
          <Loader2
            className="absolute right-3 top-2.5 animate-spin"
            size={16}
          />
        )}
        {value && !isFetching && (
          <X
            className="absolute right-3 top-2.5 cursor-pointer"
            size={16}
            onClick={clearSearch}
          />
        )}
        {Array.isArray(addressList) && addressList.length > 0 && (
          <ul
            ref={listRef}
            className="mt-1 max-h-[200px] overflow-y-auto absolute w-full bg-card z-[99999] rounded-md shadow-md border hide-scrollbar"
          >
            {addressList.map((addr, index) => (
              <li
                key={index}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                onClick={() => onAddressClick(addr)}
                className={`cursor-pointer p-2 hover:bg-primary/10 border-b text-sm ${
                  index === highlightedIndex ? "bg-primary/20" : ""
                }`}
              >
                {addr.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex">
        <Button
          disabled={isFetching || disabled}
          onClick={(e) => {
            e.stopPropagation();
            requestUserLocation();
          }}
          className="w-full sm:w-auto whitespace-nowrap"
          type="button"
        >
          <LocateFixed />
          <span className="hidden md:block">Use My Location</span>
        </Button>
      </div>
    </div>
  );
};

export default AddressSearch;

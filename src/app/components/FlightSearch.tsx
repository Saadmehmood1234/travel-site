"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plane, Users, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FlightSearchProps {
  onFlightsFound: (flights: any[]) => void;
  onSearching: (searching: boolean) => void;
}

export default function FlightSearch({
  onFlightsFound,
  onSearching,
}: FlightSearchProps) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState<Date>();
  const [passengers, setPassengers] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [tripType, setTripType] = useState<"oneWay" | "roundTrip">("oneWay");
  const [returnDate, setReturnDate] = useState<Date>();

  const [suggestions, setSuggestions] = useState({ from: [], to: [] });
  const [showSuggestions, setShowSuggestions] = useState({
    from: false,
    to: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!from.trim()) {
      newErrors.from = "Please enter departure city";
    }
    if (!to.trim()) {
      newErrors.to = "Please enter destination city";
    }
    if (!departureDate) {
      newErrors.departureDate = "Please select departure date";
    } else if (departureDate < new Date()) {
      newErrors.departureDate = "Departure date cannot be in the past";
    }
    if (passengers < 1 || passengers > 9) {
      newErrors.passengers = "Number of passengers must be between 1 and 9";
    }
    if (tripType === "roundTrip" && !returnDate) {
      newErrors.returnDate = "Please select return date";
    } else if (
      tripType === "roundTrip" &&
      returnDate &&
      returnDate < departureDate!
    ) {
      newErrors.returnDate = "Return date cannot be before departure date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    onSearching(true);

    try {
      const params = new URLSearchParams({
        origin: from.toUpperCase(),
        destination: to.toUpperCase(),
        departureDate: format(departureDate!, "yyyy-MM-dd"),
        adults: passengers.toString(),
      });

      const response = await fetch(`/api/flights?${params}`);
      const data = await response.json();
console.log("Data",data)
      if (response.ok) {
        if (data.flights && data.flights.length > 0) {
          onFlightsFound(data.flights);
          toast.success(`Found ${data.flights.length} flights`);
        } else {
          onFlightsFound([]);
        }
      } else {
        toast.error(data.error || "Failed to search flights");
      }
    } catch (error) {
      toast.error("An error occurred while searching for flights");
    } finally {
      setIsLoading(false);
      onSearching(false);
    }
  };

  const fetchSuggestions = async (query: string, field: "from" | "to") => {
    if (query.length < 2) {
      setSuggestions((prev) => ({ ...prev, [field]: [] }));
      return;
    }

    try {
      const response = await fetch(
        `/api/flights/airport-suggestions?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setSuggestions((prev) => ({ ...prev, [field]: data.suggestions || [] }));
      setShowSuggestions((prev) => ({ ...prev, [field]: true }));
    } catch (error) {}
  };

  return (
    <div className="w-full max-w-4xl mx-auto sm:p-6 max-sm:mt-12">
      <Card className="bg-gradient-to-r from-primary-600/20 to-secondary-600/20 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-8 max-sm:p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Find Your Perfect Flight
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label className="text-gray-800">Trip Type</Label>
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant={tripType === "oneWay" ? "default" : "outline"}
                  onClick={() => setTripType("oneWay")}
                  className="flex-1"
                >
                  One Way
                </Button>
                <Button
                  type="button"
                  variant={tripType === "roundTrip" ? "default" : "outline"}
                  onClick={() => setTripType("roundTrip")}
                  className="flex-1"
                >
                  Round Trip
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="from" className="text-gray-800">
                From
              </Label>
              <div className="relative">
                <Plane className="absolute left-3 top-3 h-5 w-5 text-primary-600" />
                <Input
                  id="from"
                  placeholder="Departure city or airport"
                  value={from}
                  onChange={(e) => {
                    setFrom(e.target.value);
                    fetchSuggestions(e.target.value, "from");
                  }}
                  onFocus={() =>
                    setShowSuggestions((prev) => ({ ...prev, from: true }))
                  }
                  onBlur={() =>
                    setTimeout(
                      () =>
                        setShowSuggestions((prev) => ({
                          ...prev,
                          from: false,
                        })),
                      200
                    )
                  }
                  className="pl-12 bg-white/80 border-gray-300 text-gray-800 placeholder:text-gray-500 h-12"
                />
                {showSuggestions.from && suggestions.from.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    {suggestions.from.map((suggestion: any) => (
                      <div
                        key={suggestion.iataCode}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          setFrom(suggestion.iataCode);
                          setSuggestions((prev) => ({ ...prev, from: [] }));
                          setShowSuggestions((prev) => ({
                            ...prev,
                            from: false,
                          }));
                        }}
                      >
                        {suggestion.name} ({suggestion.iataCode})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to" className="text-gray-800">
                To
              </Label>
              <div className="relative">
                <Plane className="absolute left-3 top-3 h-5 w-5 text-secondary-600 rotate-90" />
                <Input
                  id="to"
                  placeholder="Destination city or airport"
                  value={to}
                  onChange={(e) => {
                    setTo(e.target.value);
                    fetchSuggestions(e.target.value, "to");
                  }}
                  onFocus={() =>
                    setShowSuggestions((prev) => ({ ...prev, to: true }))
                  }
                  onBlur={() =>
                    setTimeout(
                      () =>
                        setShowSuggestions((prev) => ({
                          ...prev,
                          to: false,
                        })),
                      200
                    )
                  }
                  className="pl-12 bg-white/80 border-gray-300 text-gray-800 placeholder:text-gray-500 h-12"
                />
                {showSuggestions.to && suggestions.to.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    {suggestions.to.map((suggestion: any) => (
                      <div
                        key={suggestion.iataCode}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          setTo(suggestion.iataCode);
                          setSuggestions((prev) => ({ ...prev, to: [] }));
                          setShowSuggestions((prev) => ({
                            ...prev,
                            to: false,
                          }));
                        }}
                      >
                        {suggestion.name} ({suggestion.iataCode})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label className="text-gray-800">Departure Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal h-12 bg-white/80 border-gray-300 hover:bg-white text-gray-800",
                      !departureDate && "text-gray-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-5 w-5 text-primary-600" />
                    {departureDate ? (
                      format(departureDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 border-gray-300 bg-white shadow-xl"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={departureDate}
                    onSelect={setDepartureDate}
                    initialFocus
                    className="rounded-md border border-gray-300"
                    classNames={{
                      months:
                        "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 bg-white p-3",
                      month: "space-y-4 bg-white",
                      caption: "flex justify-center pt-1 relative items-center",
                      caption_label: "text-sm font-medium text-gray-800",
                      nav: "space-x-1 flex items-center",
                      nav_button:
                        "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border border-gray-300 rounded text-gray-800",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex",
                      head_cell:
                        "text-gray-600 rounded-md w-9 font-normal text-[0.8rem]",
                      row: "flex w-full mt-2",
                      cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-100 [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                      day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-gray-800 hover:bg-gray-100 rounded-md",
                      day_range_end: "day-range-end",
                      day_selected:
                        "bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-600 hover:to-secondary-600 focus:bg-primary-600 focus:text-white",
                      day_today:
                        "bg-gray-100 text-gray-800 border border-primary-500",
                      day_outside:
                        "day-outside text-gray-400 opacity-50 aria-selected:bg-gray-100 aria-selected:text-gray-800 aria-selected:opacity-30",
                      day_disabled: "text-gray-400 opacity-50",
                      day_range_middle:
                        "aria-selected:bg-gray-100 aria-selected:text-gray-800",
                      day_hidden: "invisible",
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            {tripType === "roundTrip" && (
              <div className="space-y-2">
                <Label className="text-gray-800">Return Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal h-12 bg-white/80 border-gray-300 hover:bg-white text-gray-800",
                        !returnDate && "text-gray-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-5 w-5 text-primary-600" />
                      {returnDate ? (
                        format(returnDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 border-gray-300 bg-white shadow-xl"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      onSelect={setReturnDate}
                      initialFocus
                      disabled={(date) => date < departureDate!}
                      className="rounded-md border border-gray-300"
                      classNames={{
                        months:
                          "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 bg-white p-3",
                        month: "space-y-4 bg-white",
                        caption:
                          "flex justify-center pt-1 relative items-center",
                        caption_label: "text-sm font-medium text-gray-800",
                        nav: "space-x-1 flex items-center",
                        nav_button:
                          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border border-gray-300 rounded text-gray-800",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex",
                        head_cell:
                          "text-gray-600 rounded-md w-9 font-normal text-[0.8rem]",
                        row: "flex w-full mt-2",
                        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-100 [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-gray-800 hover:bg-gray-100 rounded-md",
                        day_range_end: "day-range-end",
                        day_selected:
                          "bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-600 hover:to-secondary-600 focus:bg-primary-600 focus:text-white",
                        day_today:
                          "bg-gray-100 text-gray-800 border border-primary-500",
                        day_outside:
                          "day-outside text-gray-400 opacity-50 aria-selected:bg-gray-100 aria-selected:text-gray-800 aria-selected:opacity-30",
                        day_disabled: "text-gray-400 opacity-50",
                        day_range_middle:
                          "aria-selected:bg-gray-100 aria-selected:text-gray-800",
                        day_hidden: "invisible",
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="passengers" className="text-gray-800">
                Passengers
              </Label>
              <div className="relative mt-1">
                <Users className="absolute left-3 top-3 h-5 w-5 text-primary-600" />
                <Input
                  id="passengers"
                  type="number"
                  min="1"
                  max="9"
                  value={passengers}
                  onChange={(e) => setPassengers(parseInt(e.target.value))}
                  className="pl-12 bg-white/80 border-gray-300 text-gray-800 h-12"
                />
              </div>
            </div>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
              <div className="flex items-center gap-2 text-red-700 mb-2">
                <AlertCircle className="h-5 w-5" />
                <span className="font-semibold">
                  Please fix the following errors:
                </span>
              </div>
              <ul className="list-disc list-inside text-red-600 text-sm">
                {Object.values(errors).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <Button
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white py-3 text-lg h-14 rounded-lg disabled:opacity-50"
          >
            {isLoading ? "Searching..." : "Search Flights"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

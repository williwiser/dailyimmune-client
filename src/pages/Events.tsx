import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useState, type ChangeEvent } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const Events = () => {
  const [, setEvents] = useState([]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    axios
      .get(`${BACKEND_URL}/api/v1/prayers/search?q=${query}&page=1&limit=9`, {
        withCredentials: true,
      })
      .then((response) => {
        setEvents(response.data);
      });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
      <div className=" lg:col-span-2">
        <div className="flex gap-4 items-center bg-white border rounded-md">
          <FontAwesomeIcon icon={faSearch} className="pl-4 text-gray-500" />
          <input
            type="text"
            className="w-full pr-4 py-2"
            placeholder="Search events..."
            onChange={handleSearch}
          />
        </div>
        <div className="mt-6">
          <p className="text-gray-500 px-4">No events</p>
        </div>
      </div>
    </div>
  );
};

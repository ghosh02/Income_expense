import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setEntry } from "../redux/entrySlice";

const useGetAllEntries = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
          }/api/entry/allEntry`,
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          dispatch(setEntry(response.data.entries));
        }
      } catch (error) {
        console.log(error);
      }
    };

    return fetchEntries;
  }, [dispatch]);
};

export default useGetAllEntries;

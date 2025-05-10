// hooks/useLastThreeMonthsSummary.js
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLastThreeMonthsIncome } from "../redux/entrySlice";

const useLastThreeMonthsSummary = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/entry/summary`,
          {
            withCredentials: true,
          }
        );
        dispatch(setLastThreeMonthsIncome(res.data.data));
      } catch (err) {
        setError(err);
      }
    };

    fetchSummary();
  }, [dispatch]);
};

export default useLastThreeMonthsSummary;

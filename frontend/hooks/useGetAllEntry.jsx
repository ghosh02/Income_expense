// import { useEffect } from "react";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { setLastThreeMonthsIncome } from "../redux/entrySlice";

// const useLastThreeMonthsSummary = () => {
//   const dispatch = useDispatch();

//   const fetchSummary = async () => {
//     try {
//       const res = await axios.get("http://localhost:4000/api/entry/summary", {
//         withCredentials: true,
//       });
//       dispatch(setLastThreeMonthsIncome(res.data.data));
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     fetchSummary();
//   }, [dispatch]);

//   return fetchSummary; // return fetcher
// };

// export default useLastThreeMonthsSummary;

import { useEffect, useCallback } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setEntry } from "../redux/entrySlice";

const useGetAllEntries = () => {
  const dispatch = useDispatch();

  const fetchEntries = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://spendly-lm8q.onrender.com/api/entry/allEntry",
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        dispatch(setEntry(response.data.entries));
      }
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [dispatch]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return fetchEntries;
};

export default useGetAllEntries;

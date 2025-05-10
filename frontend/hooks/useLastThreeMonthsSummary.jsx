// // hooks/useLastThreeMonthsSummary.js
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { setLastThreeMonthsIncome } from "../redux/entrySlice";

// const useLastThreeMonthsSummary = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const fetchSummary = async () => {
//       try {
//         const res = await axios.get("http://localhost:4000/api/entry/summary", {
//           withCredentials: true,
//         });
//         dispatch(setLastThreeMonthsIncome(res.data.data));
//       } catch (err) {
//         setError(err);
//       }
//     };

//     fetchSummary();
//   }, [dispatch]);
// };

// export default useLastThreeMonthsSummary;
import { useCallback, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLastThreeMonthsIncome } from "../redux/entrySlice";

const useLastThreeMonthsSummary = () => {
  const dispatch = useDispatch();

  const fetchSummary = useCallback(async () => {
    try {
      const res = await axios.get(
        "https://spendly-lm8q.onrender.com/api/entry/summary",
        {
          withCredentials: true,
        }
      );
      if (res.data) {
        dispatch(setLastThreeMonthsIncome(res.data.data));
      }
      return res;
    } catch (err) {
      console.error(err);
      return null;
    }
  }, [dispatch]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return fetchSummary;
};

export default useLastThreeMonthsSummary;

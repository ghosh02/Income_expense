// import { useEffect } from "react";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { setTotalExpense } from "../redux/entrySlice";

// const useGetTotalExpense = () => {
//   const dispatch = useDispatch();

//   const fetchExpense = async () => {
//     try {
//       const res = await axios.get("http://localhost:4000/api/entry/expense", {
//         withCredentials: true,
//       });
//       if (res.data.success) {
//         dispatch(setTotalExpense(res.data.totalExpense));
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchExpense();
//   }, [dispatch]);

//   return fetchExpense; // return fetcher
// };

// export default useGetTotalExpense;

import { useCallback, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setTotalExpense } from "../redux/entrySlice";

const useGetTotalExpense = () => {
  const dispatch = useDispatch();

  const fetchExpense = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/entry/expense", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setTotalExpense(res.data.totalExpense));
      }
      return res;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [dispatch]);

  useEffect(() => {
    fetchExpense();
  }, [fetchExpense]);

  return fetchExpense;
};

export default useGetTotalExpense;

// import { useEffect } from "react";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { setTotalIncome } from "../redux/entrySlice";

// const useGetTotalIncome = () => {
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.auth.user);

//   const fetchIncome = async () => {
//     try {
//       const res = await axios.get("http://localhost:4000/api/entry/income", {
//         withCredentials: true,
//       });
//       if (res.data.success) {
//         dispatch(setTotalIncome(res.data.totalIncome));
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     if (user) fetchIncome();
//   }, [dispatch, user]);

//   return fetchIncome; // return it so it can be manually called
// };

// export default useGetTotalIncome;

import { useCallback, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setTotalIncome } from "../redux/entrySlice";

const useGetTotalIncome = () => {
  const dispatch = useDispatch();

  const fetchIncome = useCallback(async () => {
    try {
      const res = await axios.get(
        "https://spendly-lm8q.onrender.com/api/entry/income",
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setTotalIncome(res.data.totalIncome));
      }
      return res;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [dispatch]);

  useEffect(() => {
    fetchIncome();
  }, [fetchIncome]);

  return fetchIncome;
};

export default useGetTotalIncome;

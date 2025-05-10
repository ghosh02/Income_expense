import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setTotalExpense } from "../redux/entrySlice";

const useGetTotalExpense = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/entry/expense`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setTotalExpense(res.data.totalExpense));
        }
      } catch (error) {
        console.log(error);
      }
    };

    return fetchExpense;
  }, [dispatch]);
};

export default useGetTotalExpense;

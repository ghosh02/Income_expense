import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setTotalIncome } from "../redux/entrySlice";

const useGetTotalIncome = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/entry/income`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setTotalIncome(res.data.totalIncome));
        }
      } catch (error) {
        console.log(error);
      }
    };

    return fetchIncome;
  }, [dispatch]);
};

export default useGetTotalIncome;

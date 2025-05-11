import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setAuthUser } from "../../redux/authSlice";
import { toast } from "sonner";
import useGetAllEntries from "../../hooks/useGetAllEntry";
import useGetTotalExpense from "../../hooks/useGetTotalExpense";
import useGetTotalIncome from "../../hooks/useGetTotalIncome";
import { ChevronDown, ListFilter, LogOut, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import AddEntry from "./AddEntry";
import useLastThreeMonthsSummary from "../../hooks/useLastThreeMonthsSummary";
import MonthlyBarChart from "../components/MonthlyBarChart";
import FinancialScoreCircle from "../components/FinancialScoreCircle";
import { setEntry } from "../../redux/entrySlice";

const Dashboard = () => {
  const getEntries = useGetAllEntries();
  const getIncome = useGetTotalIncome();
  const getExpense = useGetTotalExpense();
  const getSummary = useLastThreeMonthsSummary();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState(null);

  const openAddEntry = () => setShowAddModal(true);
  const closeAddEntry = () => setShowAddModal(false);
  const { user } = useSelector((state) => state.auth);
  const { entries, totalIncome, totalExpense, lastThreeMonthsIncome } =
    useSelector((state) => state.entry);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        "https://spendly-lm8q.onrender.com/api/user/logout",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setAuthUser(null));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const [filters, setFilters] = useState({
    type: "",
    paymentMethod: "",
    category: "",
    startDate: "",
    endDate: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.date);
    const fromDate = filters.startDate ? new Date(filters.startDate) : null;
    const toDate = filters.endDate ? new Date(filters.endDate) : null;

    return (
      (filters.type ? entry.type === filters.type : true) &&
      (filters.paymentMethod
        ? entry.paymentMethod === filters.paymentMethod
        : true) &&
      (filters.category ? entry.category === filters.category : true) &&
      (fromDate ? entryDate >= fromDate : true) &&
      (toDate ? entryDate <= toDate : true)
    );
  });

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const currentEntries = filteredEntries.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  const [displayData, setDisplayData] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (Array.isArray(lastThreeMonthsIncome)) {
        if (screenWidth < 640) {
          setDisplayData(lastThreeMonthsIncome.slice(-3)); // You meant 2 months here
        } else {
          setDisplayData(lastThreeMonthsIncome); // All 3 months
        }
      } else {
        setDisplayData([]); // fallback if data is not ready yet
      }
    };

    handleResize(); // Initial check

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [lastThreeMonthsIncome]);

  const confirmDelete = (id) => {
    setSelectedEntryId(id);
    setIsDialogOpen(true);
  };
  const handleDelete = async () => {
    if (!selectedEntryId) return;
    try {
      const res = await axios.delete(
        `https://spendly-lm8q.onrender.com/api/entry/delete/${id}`,
        {
          withCredentials: true,
        }
      );
      const updatedEntries = entries.filter((entry) => entry._id !== id);
      if (res.data.success) {
        dispatch(setEntry(updatedEntries));
        await Promise.all([
          getEntries(),
          getIncome(),
          getExpense(),
          getSummary(),
        ]);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Error deleting entry:", error.message);
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <div className="px-4 py-2 space-y-6">
        <div className="flex justify-between items-center">
          <img
            src="/logo.png"
            alt="logo"
            className="w-40 h-12 object-cover max-sm:hidden"
          />
          <img
            src="/logosm.png"
            alt="logo"
            className="w-25 h-10 object-cover  sm:hidden"
          />
          <div className="flex items-center gap-4">
            <Button
              className="bg-blue-800 hover:bg-blue-900 text-white cursor-pointer"
              // onClick={addEntryHandler}
              onClick={openAddEntry}
            >
              Add Entry
            </Button>
            <div className="relative inline-block text-left">
              {/* Profile and arrow */}
              <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-[2px] cursor-pointer border-2 border-gray-400 py-1 px-[6px] rounded-[8px]"
              >
                <div className="w-6 h-6 p-[12px]  bg-green-600 rounded-full flex items-center justify-center">
                  <p className="text-white text-[14px] font-medium">
                    {user.name?.charAt?.(0)?.toUpperCase()}
                  </p>
                </div>

                <ChevronDown
                  className={`text-gray-400 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>

              {/* Dropdown */}
              {isOpen && (
                <div className="absolute right-0 mt-2 w-[100px] bg-red-700 hover:bg-red-800 rounded-md border shadow-md z-10 ">
                  <button
                    onClick={logoutHandler}
                    className=" w-full px-4 py-2 text-left  text-sm   flex gap-2 items-center text-white cursor-pointer"
                  >
                    <LogOut className="text-white" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* This Month Summary */}
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-xl text-slate-800">
              Summary of {currentMonth} month
            </CardTitle>
          </CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
            <Card>
              <CardHeader>
                <CardTitle>Total Income </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold text-green-600">
                  ₹ {totalIncome}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Expense </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold text-red-600">
                  ₹ {totalExpense}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold text-blue-600">
                  ₹ {totalIncome - totalExpense}
                </p>
              </CardContent>
            </Card>
          </div>
        </Card>
        {/* <Card> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          <Card>
            {/* <div className="p-4"> */}
            <CardHeader>
              <CardTitle className="text-xl font-semibold mb-4 sm:hidden">
                Last 3 Months Summary
              </CardTitle>
              <CardTitle className="text-xl font-semibold mb-4 max-sm:hidden">
                Last 4 Months Summary
              </CardTitle>
            </CardHeader>

            <MonthlyBarChart data={displayData} />
            {/* </div> */}
          </Card>
          <Card className="">
            <CardHeader>
              <CardTitle className="text-xl font-semibold mb-4 ">
                Your Financial Score
              </CardTitle>
            </CardHeader>
            <div className="p-4 flex items-center justify-center">
              <FinancialScoreCircle
                totalIncome={totalIncome}
                totalExpense={totalExpense}
                lastThree={lastThreeMonthsIncome}
              />
            </div>
          </Card>
        </div>
        {/* </Card> */}

        <Card>
          <CardHeader>
            <CardTitle className="text-slate-800 text-xl">
              Your list of entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* grid grid-cols-1 md:grid-cols-6 */}
            <AnimatePresence>
              {isFilterOpen ? (
                <motion.div
                  key="filters"
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className=" flex flex-wrap  items-center max-md:gap-4 gap-6 mb-4">
                    <Select
                      value={filters.type}
                      onValueChange={(val) =>
                        setFilters((prev) => ({ ...prev, type: val }))
                      }
                    >
                      <SelectTrigger className=" border border-black [&>span]:text-black [&_[data-placeholder]]:text-gray-400 cursor-pointer">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem className="text-black" value="income">
                          Income
                        </SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      className="max-sm:hidden"
                      value={filters.paymentMethod}
                      onValueChange={(val) =>
                        setFilters((prev) => ({ ...prev, paymentMethod: val }))
                      }
                    >
                      <SelectTrigger className="max-sm:hidden border border-black [&>span]:text-black [&_[data-placeholder]]:text-gray-400 cursor-pointer">
                        <SelectValue placeholder="Payment method" />
                      </SelectTrigger>
                      <SelectContent className="text-black">
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={filters.category}
                      onValueChange={(val) =>
                        setFilters((prev) => ({ ...prev, category: val }))
                      }
                    >
                      <SelectTrigger className=" border border-black [&>span]:text-black [&_[data-placeholder]]:text-gray-400 cursor-pointer">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Income">Income</SelectItem>
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Housing">Housing</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Medical">Medical</SelectItem>
                        <SelectItem value="Travel">Travel</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-2 max-sm:hidden">
                      <Label className="text-black">From</Label>
                      <Input
                        className=" max-md:w-[140px] lg:w-[160px] border border-black cursor-pointer"
                        type="date"
                        value={filters.startDate}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            startDate: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center gap-2 max-sm:hidden">
                      <Label className="text-black">To</Label>
                      {/* <p>To</p> */}
                      <Input
                        className="max-md:w-[140px] lg:w-[160px] border border-black cursor-pointer"
                        type="date"
                        value={filters.endDate}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            endDate: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div
                      className="flex items-center justify-center border-1 border-black p-1 rounded-md cursor-pointer"
                      onClick={() => {
                        setIsFilterOpen(false);
                        setFilters({
                          type: "",
                          paymentMethod: "",
                          category: "",
                          startDate: "",
                          endDate: "",
                        });
                      }}
                    >
                      <X />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex items-center gap-2 mb-2 ">
                  {/* <Label className="text-black">Filter</Label> */}
                  <ListFilter
                    className="cursor-pointer"
                    onClick={() => setIsFilterOpen(true)}
                  />
                </div>
              )}
            </AnimatePresence>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="max-sm:hidden">Payment</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="max-sm:hidden">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No entries found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentEntries.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDate(entry.date)}</TableCell>
                      <TableCell className="capitalize">
                        {entry.category}
                      </TableCell>
                      <TableCell className="capitalize">{entry.type}</TableCell>
                      <TableCell className="max-sm:hidden capitalize">
                        {entry.paymentMethod}
                      </TableCell>
                      <TableCell
                        className={
                          entry.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {entry.amount}
                      </TableCell>
                      <TableCell className="max-sm:hidden">
                        {entry.description || "-"}
                      </TableCell>
                      <TableCell className="">
                        <button
                          onClick={() => confirmDelete(entry._id)}
                          className=" "
                        >
                          <Trash2 className="w-4 h-4 text-red-600 hover:text-red-800 cursor-pointer" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <div className="flex justify-end mt-4 gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>

              <Button
                variant="outline"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[450px] h-[200px] items-center justify-center">
          <style>
            {`.absolute.top-4.right-4
             {
              display: none !important;
              }`}
          </style>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this entry?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className="grid grid-cols-2 items-center gap-6">
            <Button
              className=" bg-slate-800 text-white cursor-pointer"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className=" text-white bg-red-600 hover:bg-red-800 cursor-pointer"
              // variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          {/* <div className="bg-white p-6 rounded-xl w-full max-w-xl shadow-lg"> */}
          <AddEntry onClose={closeAddEntry} />
          {/* </div> */}
        </div>
      )}
    </>
  );
};

export default Dashboard;

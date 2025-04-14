import { useState, useEffect } from "react";
import { supabase } from "../../../utils/supabase";
import styles from "./report.module.css";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Tipe data untuk laporan transaksi
type ReportItem = {
  transaction_id: string;
  product_id: string;
  quantity: number;
  price: number; // Harga jual ke customer
  subtotal: number;
  product_name: string;
  transaction_date: string;
  employee_name: string;
  buyer_name: string;
};

const Report = () => {
  const [reportData, setReportData] = useState<ReportItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("transaction_id");
  const [filterDate, setFilterDate] = useState<{ startDate: string; endDate: string }>({
    startDate: "",
    endDate: "",
  });
  const [marginProfitPercentage, setMarginProfitPercentage] = useState<number>(0.20); // Default margin 20%

  useEffect(() => {
    const fetchReportData = async () => {
      let query = supabase.rpc("get_transaction_items_with_product_name");

      if (filterDate.startDate && filterDate.endDate) {
        query = query
          .filter("transaction_date", "gte", filterDate.startDate)
          .filter("transaction_date", "lte", filterDate.endDate);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching report data:", error.message);
        return;
      }

      if (data) {
        setReportData(data);
      }
    };

    fetchReportData();
  }, [filterDate]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Penjualan");
    const excelFile = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelFile]), "laporan_penjualan.xlsx");
  };

  const filteredData = reportData.filter((item) =>
    item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedData = filteredData.sort((a, b) => {
    if (sortBy === "transaction_id") return a.transaction_id.localeCompare(b.transaction_id);
    if (sortBy === "product_name") return a.product_name.localeCompare(b.product_name);
    if (sortBy === "subtotal") return a.subtotal - b.subtotal;
    return 0;
  });

  const totalPenjualan = sortedData.reduce((total, item) => total + item.subtotal, 0);

  // Hitung total laba dengan margin laba yang diinputkan oleh user
  const totalLaba = sortedData.reduce((total, item) => {
    const profitPerItem = item.subtotal * marginProfitPercentage; // Laba per item
    return total + profitPerItem;
  }, 0);

  const formatDate = (date: string) => {
    const formattedDate = new Date(date);
    return formattedDate instanceof Date && !isNaN(formattedDate.getTime())
      ? formattedDate.toLocaleString()
      : "Tanggal tidak valid";
  };

  // Analisis produk terlaris
  const productSales = reportData.reduce((acc, item) => {
    const existing = acc.find((p) => p.product_name === item.product_name);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      acc.push({ product_name: item.product_name, quantity: item.quantity });
    }
    return acc;
  }, [] as { product_name: string; quantity: number }[]);

  const pieColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#8dd1e1", "#a4de6c", "#d0ed57"];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Laporan Penjualan</h1>

      {/* Filter Tanggal */}
      <div className={styles.filterContainer}>
        <input
          type="date"
          value={filterDate.startDate}
          onChange={(e) => setFilterDate({ ...filterDate, startDate: e.target.value })}
          className={styles.inputDate}
        />
        <span> sampai </span>
        <input
          type="date"
          value={filterDate.endDate}
          onChange={(e) => setFilterDate({ ...filterDate, endDate: e.target.value })}
          className={styles.inputDate}
        />
      </div>

      {/* Pencarian Produk */}
      <input
        type="text"
        placeholder="Cari Produk"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={styles.searchBar}
      />

      {/* Input Margin Profit */}
      <div className={styles.marginInputContainer}>
        <label htmlFor="marginProfit">Margin Laba (%)</label>
        <input
          type="number"
          id="marginProfit"
          value={marginProfitPercentage * 100} // Mengonversi ke persen untuk tampilan
          onChange={(e) => setMarginProfitPercentage(parseFloat(e.target.value) / 100)} // Mengonversi kembali ke nilai desimal
          className={styles.marginInput}
          min="0"
          max="100"
        />
      </div>

      {/* Analisis Penjualan */}
      <div className={styles.chartContainer}>
        <h2 className={styles.subtitle}>Analisis Produk Terlaris (Bar Chart)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={productSales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="product_name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantity" fill="#8884d8" name="Jumlah Terjual" />
          </BarChart>
        </ResponsiveContainer>

        <h2 className={styles.subtitle}>Analisis Produk Terlaris (Pie Chart)</h2>
        <PieChart width={400} height={300}>
          <Pie
            data={productSales}
            dataKey="quantity"
            nameKey="product_name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#82ca9d"
            label
          >
            {productSales.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      {/* Tabel Laporan */}
      {sortedData.length === 0 ? (
        <p>Data laporan tidak ditemukan.</p>
      ) : (
        <>
          <table className={styles.reportTable}>
            <thead>
              <tr>
                <th onClick={() => setSortBy("transaction_id")}>Transaction ID</th>
                <th onClick={() => setSortBy("product_name")}>Product Name</th>
                <th onClick={() => setSortBy("quantity")}>Quantity</th>
                <th onClick={() => setSortBy("price")}>Price</th>
                <th onClick={() => setSortBy("subtotal")}>Subtotal</th>
                <th>Employee Name</th>
                <th>Buyer Name</th>
                <th>Transaction Date</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item) => (
                <tr key={item.transaction_id}>
                  <td>{item.transaction_id}</td>
                  <td>{item.product_name}</td>
                  <td>{item.quantity}</td>
                  <td>Rp{item.price.toLocaleString()}</td>
                  <td>Rp{item.subtotal.toLocaleString()}</td>
                  <td>{item.employee_name}</td>
                  <td>{item.buyer_name}</td>
                  <td>{formatDate(item.transaction_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.totalContainer}>
            <h3>Total Penjualan: Rp{totalPenjualan.toLocaleString()}</h3>
            <h3>Total Laba: Rp{totalLaba.toLocaleString()}</h3> {/* Tampilkan total laba */}
          </div>
        </>
      )}
      <div className={styles.mobileMessage}>
        Tabel ini hanya dapat dilihat di desktop mode. Silakan gunakan laptop atau PC untuk melihatnya.
      </div>
      {/* Tombol Ekspor */}
      <button onClick={exportToExcel} className={styles.exportButton}>Ekspor ke Excel</button>
    </div>
  );
};

export default Report;

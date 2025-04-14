import { useState, useEffect } from "react";
import { supabase } from "../../../utils/supabase";
import styles from "./employee.module.css";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

interface Employee {
  id_employee: string;
  username_employee: string;
  password_employee: string;
  name_employee: string;
  gender_employee: string;
  position_employee: string;
  phone_number_employee: string;
}

export default function EmployeesPage() {
  const router = useRouter();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true); // ✅ untuk loading state

  useEffect(() => {
    const checkAuth = () => {
      const userCookie = Cookies.get("user");

      if (!userCookie) {
        router.push("/login");
        return;
      }

      const user = JSON.parse(userCookie);
      if (user.position !== "Manager") {
        alert("Akses ditolak. Hanya admin yang dapat mengakses halaman ini.");
        router.push("/login");
        return;
      }

      setIsAuthorized(true);
    };

    // Pastikan hanya jalan di client
    if (typeof window !== "undefined") {
      checkAuth();
      setIsChecking(false);
    }
  }, [router]);

  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployee, setNewEmployee] = useState<Omit<Employee, "id_employee">>({
    username_employee: "",
    password_employee: "",
    name_employee: "",
    gender_employee: "",
    position_employee: "",
    phone_number_employee: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null); // 🔧 identifikasi apakah sedang edit

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);   
      return () => clearTimeout(timer);
    }
    const fetchEmployees = async () => {
      const { data, error } = await supabase.from("employees").select("*");
      if (!error && data) setEmployees(data);
    };
    fetchEmployees();
  }, [notification]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setNewEmployee({
      username_employee: "",
      password_employee: "",
      name_employee: "",
      gender_employee: "",
      position_employee: "",
      phone_number_employee: "",
    });
    setEditingId(null);
  };

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    if (/\s/.test(newEmployee.username_employee)) {
      setNotification({ type: 'error', message: 'Username tidak boleh mengandung spasi.' });
      return;
    }

    setIsLoading(true);

    try {
      if (editingId) {
        // 🔁 MODE EDIT
        const { error } = await supabase
          .from("employees")
          .update(newEmployee)
          .eq("id_employee", editingId)
          .select();

        if (error) {
          setNotification({ type: 'error', message: 'Gagal mengedit data.' });
        } else {
          setEmployees(
            employees.map((emp) =>
              emp.id_employee === editingId ? { ...emp, ...newEmployee } : emp
            )
          );
          setNotification({ type: 'success', message: 'Data berhasil diperbarui.' });
          resetForm();
        }
      } else {
        // ➕ MODE TAMBAH
        const { data, error } = await supabase.from("employees").insert([newEmployee]).select();
        if (error) {
          setNotification({ type: 'error', message: 'Gagal menambahkan data.' });
        } else {
          setEmployees([...employees, ...(data ?? [])]);
          setNotification({ type: 'success', message: 'Karyawan berhasil ditambahkan.' });
          resetForm();
        }
      }
    } catch {
      setNotification({ type: 'error', message: 'Terjadi kesalahan.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (emp: Employee) => {
    setNewEmployee({
      username_employee: emp.username_employee,
      password_employee: emp.password_employee,
      name_employee: emp.name_employee,
      gender_employee: emp.gender_employee,
      position_employee: emp.position_employee,
      phone_number_employee: emp.phone_number_employee,
    });
    setEditingId(emp.id_employee);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteEmployee = async (id: string) => {
    setNotification(null); // Reset notif sebelumnya
    const { error } = await supabase.from("employees").delete().eq("id_employee", id);
  
    if (error) {
      console.error("Error deleting employee:", error);
      setNotification({ type: "error", message: "Gagal menghapus data!" });
    } else {
      setEmployees(employees.filter((emp) => emp.id_employee !== id));
      setNotification({ type: "success", message: "Berhasil menghapus data!" });
    }
  };

  if (isChecking) return <div>Loading...</div>;
  if (!isAuthorized) return null;

  return (
    <div className={styles.container}>
      {notification && (
        <div
        className={`${styles.notification} ${ notification.type === "success" ? styles.success : styles.error}`}>
        {notification.message}
      </div>
      )}

      <form onSubmit={handleAddOrUpdate} className={styles.form}>
        {/* --- form field sama seperti sebelumnya --- */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Username</label>
          <input
            type="text"
            name="username_employee"
            value={newEmployee.username_employee}
            onChange={handleChange}
            className={styles.input}
            placeholder="Username tanpa spasi"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Password</label>
          <input
            type="password"
            name="password_employee"
            value={newEmployee.password_employee}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Nama Lengkap</label>
          <input
            type="text"
            name="name_employee"
            value={newEmployee.name_employee}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Jenis Kelamin</label>
          <select
            name="gender_employee"
            value={newEmployee.gender_employee}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">-- Pilih --</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Posisi</label>
          <select
            name="position_employee"
            value={newEmployee.position_employee}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">-- Pilih --</option>
            <option value="Employee">Employee</option>
            <option value="Manager">Manager</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Nomor Telepon</label>
          <input
            type="text"
            name="phone_number_employee"
            value={newEmployee.phone_number_employee}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                handleChange(e);
              }
            }}
            className={styles.input}
            placeholder="Hanya angka"
            required
          />
        </div>

        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading
            ? "Memproses..."
            : editingId
            ? "Simpan Perubahan"
            : "Tambah Karyawan"}
        </button>
      </form>

            {/* Desktop Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Nama</th>
              <th>Gender</th>
              <th>Posisi</th>
              <th>Password</th>
              <th>No Telepon</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id_employee}>
                <td>{emp.username_employee}</td>
                <td>{emp.name_employee}</td>
                <td>{emp.gender_employee}</td>
                <td>{emp.position_employee}</td>
                <td>{emp.password_employee}</td>
                <td>{emp.phone_number_employee}</td>
                <td>
                  <button
                    onClick={() => handleEdit(emp)}
                    className={styles.deleteButton}
                    style={{ marginRight: "0.5rem", backgroundColor: "#007acc" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEmployee(emp.id_employee)}
                    className={styles.deleteButton}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className={styles.mobileCardList}>
        {employees.map((emp) => (
          <div key={emp.id_employee} className={styles.employeeCard}>
            <div><strong>Username:</strong> {emp.username_employee}</div>
            <div><strong>Nama:</strong> {emp.name_employee}</div>
            <div><strong>Gender:</strong> {emp.gender_employee}</div>
            <div><strong>Posisi:</strong> {emp.position_employee}</div>
            <div><strong>Password:</strong> {emp.password_employee}</div> {/* Tambahkan ini */}
            <div><strong>No Telp:</strong> {emp.phone_number_employee}</div>
            <div className={styles.actionButtons}>
              <button
                onClick={() => handleEdit(emp)}
                className={styles.deleteButton}
                style={{ backgroundColor: "#007acc" }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteEmployee(emp.id_employee)}
                className={styles.deleteButton}
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

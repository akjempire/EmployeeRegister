import React, { useState, useEffect } from "react";
import Employee from "./Employee";

export default function EmployeeList() {
  const [employeeList, setEmployeeList] = useState([]);

  // Fetch all employees when page loads
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    fetch("https://localhost:7212/api/Employee")
      .then((res) => res.json())
      .then((data) => {
        setEmployeeList(data);
      console.log(data);

      })
      .catch((err) => console.error("Error fetching employees:", err));
  };

  // Add or edit employee
  const addOrEditEmployee = (formData, onSuccess) => {
    fetch("https://localhost:7212/api/Employee", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Saved:", data);
        fetchEmployees(); // refresh list
        if (onSuccess) onSuccess(); // reset form from Employee
      })
      .catch((err) => console.error("Error saving employee:", err));
  };

  // Delete employee
  const deleteEmployee = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      fetch(`https://localhost:7212/api/Employee/${id}`, {
        method: "DELETE",
      })
        .then(() => {
          fetchEmployees();
        })
        .catch((err) => console.error("Error deleting employee:", err));
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-md-4">
          {/* Pass addOrEdit as prop */}
          <Employee addOrEdit={addOrEditEmployee} />
        </div>

        <div className="col-md-8">
          <h3>List of Employees</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Occupation</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employeeList.length > 0 ? (
                employeeList.map((emp, index) => (
                   <tr key={emp._id || index}>
                    <td>{emp.employeeName}</td>
                    <td>{emp.occupation}</td>
                    <td>
                      <img
                      src={emp.imageSrc || "/defaultImage.jpeg"}
                      alt={emp.employeeName}
                      style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      }}
                     />
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteEmployee(emp._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No Employees Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

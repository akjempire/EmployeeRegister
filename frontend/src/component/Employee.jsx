import React, { useState } from "react";
import defaultImage from "../assets/defaultImage.jpeg"; // Keep default image in src/assets

const initialValue = {
  employeeId: 0,
  employeeName: "",
  occupation: "",
  imageName: "",
  imageSrc: defaultImage,
  imageFile: null,
};

export default function Employee({ addOrEdit }) {
  const [values, setValues] = useState(initialValue);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const showPreview = (e) => {
    if (e.target.files && e.target.files[0]) {
      let imageFile = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (x) => {
        setValues({
          ...values,
          imageFile,
          imageSrc: x.target.result,
          imageName: imageFile.name,
        });
      };
      reader.readAsDataURL(imageFile);
    } else {
      setValues({
        ...values,
        imageFile: null,
        imageSrc: defaultImage,
        imageName: "",
      });
    }
  };

  const validate = () => {
    let temp = {};
    temp.employeeName = values.employeeName ? "" : "Employee Name is required.";
    temp.occupation = values.occupation ? "" : "Occupation is required.";
    setErrors(temp);
    return Object.values(temp).every((x) => x === "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const formData = new FormData();
      formData.append("employeeId", values.employeeId);
      formData.append("employeeName", values.employeeName);
      formData.append("occupation", values.occupation);
      formData.append("imageName", values.imageName || "");
      if (values.imageFile) {
        formData.append("imageFile", values.imageFile);
      }
      addOrEdit(formData, resetForm);
    }
  };

  const resetForm = () => {
    setValues(initialValue);
    setErrors({});
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Add Employee</h2>
      <form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <div className="card p-3 shadow-lg">
          <div className="text-center mb-3">
            <img
              src={values.imageSrc}
              alt="Employee"
              className="img-thumbnail"
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </div>

          <div className="form-group mb-3">
            <input
              type="text"
              className={`form-control ${
                errors.employeeName ? "is-invalid" : ""
              }`}
              placeholder="Employee Name"
              name="employeeName"
              value={values.employeeName}
              onChange={handleInputChange}
            />
            {errors.employeeName && (
              <div className="invalid-feedback">{errors.employeeName}</div>
            )}
          </div>

          <div className="form-group mb-3">
            <input
              type="text"
              className={`form-control ${
                errors.occupation ? "is-invalid" : ""
              }`}
              placeholder="Occupation"
              name="occupation"
              value={values.occupation}
              onChange={handleInputChange}
            />
            {errors.occupation && (
              <div className="invalid-feedback">{errors.occupation}</div>
            )}
          </div>

          <div className="form-group mb-3">
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={showPreview}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Save Employee
          </button>
        </div>
      </form>
    </div>
  );
}

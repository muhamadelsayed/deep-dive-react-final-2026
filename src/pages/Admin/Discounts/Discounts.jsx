import { useState } from "react";
import {
  Percent,
  Plus,
  Pencil,
  Trash2,
  CalendarDays,
} from "lucide-react";

function Discounts() {
  const [discounts, setDiscounts] = useState([
    {
      id: 1,
      code: "WELCOME10",
      type: "Percentage",
      value: 10,
      validTo: "2026-12-31",
      products: "All Products",
    },
    {
      id: 2,
      code: "SAVE20",
      type: "Fixed",
      value: 20,
      validTo: "2026-10-30",
      products: "Selected Products",
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    type: "Percentage",
    value: "",
    validTo: "",
    products: "All Products",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.code ||
      !formData.value ||
      !formData.validTo
    ) {
      return;
    }

    const newDiscount = {
      id: Date.now(),
      code: formData.code.toUpperCase(),
      type:
        formData.type === "Percentage"
          ? "Percentage"
          : "Fixed",
      value: Number(formData.value),
      validTo: formData.validTo,
      products: formData.products,
    };

    setDiscounts((prev) => [
      ...prev,
      newDiscount,
    ]);

    setFormData({
      code: "",
      type: "Percentage",
      value: "",
      validTo: "",
      products: "All Products",
    });

    setShowForm(false);
  };

  const handleDelete = (id) => {
    setDiscounts((prev) =>
      prev.filter(
        (discount) => discount.id !== id
      )
    );
  };

  return (
    <div className="admin-discounts-page">

      {/* Header */}
      <div className="admin-page-header">
        <div>
          <span className="admin-page-label">
            MARKETING
          </span>

          <h1>Discounts</h1>

          <p>
            Create and manage discount coupons.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-btn"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={18} />
          Create Discount
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <form
          className="admin-form-section admin-discount-form"
          onSubmit={handleSubmit}
        >

          <div className="admin-form-section-header">
            <h2>Create Discount</h2>
            <p>
              Add a new discount code for customers.
            </p>
          </div>

          <div className="admin-form-grid">

            <div className="admin-form-group">
              <label htmlFor="code">
                Discount Code
              </label>

              <input
                id="code"
                name="code"
                type="text"
                placeholder="e.g. SUMMER20"
                value={formData.code}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="type">
                Discount Type
              </label>

              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="Percentage">
                  Percentage
                </option>

                <option value="Fixed">
                  Fixed Amount
                </option>
              </select>
            </div>

            <div className="admin-form-group">
              <label htmlFor="value">
                Value
              </label>

              <input
                id="value"
                name="value"
                type="number"
                min="0"
                step="0.01"
                placeholder={
                  formData.type === "Percentage"
                    ? "10"
                    : "20.00"
                }
                value={formData.value}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="validTo">
                Valid Until
              </label>

              <input
                id="validTo"
                name="validTo"
                type="date"
                value={formData.validTo}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group full">
              <label htmlFor="products">
                Applied Products
              </label>

              <select
                id="products"
                name="products"
                value={formData.products}
                onChange={handleChange}
              >
                <option value="All Products">
                  All Products
                </option>

                <option value="Selected Products">
                  Selected Products
                </option>
              </select>
            </div>

          </div>

          <div className="admin-form-actions">

            <button
              type="button"
              className="admin-cancel-btn"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-primary-btn"
            >
              Create Discount
            </button>

          </div>

        </form>
      )}

      {/* Discounts */}
      <div className="admin-discount-grid">

        {discounts.map((discount) => (
          <div
            className="admin-discount-card"
            key={discount.id}
          >

            <div className="admin-discount-card-top">

              <div className="admin-discount-icon">
                <Percent size={20} />
              </div>

              <div className="admin-discount-actions">

                <button
                  type="button"
                  className="admin-action-btn edit"
                >
                  <Pencil size={15} />
                </button>

                <button
                  type="button"
                  className="admin-action-btn delete"
                  onClick={() =>
                    handleDelete(discount.id)
                  }
                >
                  <Trash2 size={15} />
                </button>

              </div>

            </div>

            <div className="admin-discount-code">
              {discount.code}
            </div>

            <div className="admin-discount-value">

              {discount.type === "Percentage"
                ? `${discount.value}%`
                : `$${discount.value.toFixed(2)}`}

              <span>OFF</span>

            </div>

            <div className="admin-discount-info">

              <div>
                <CalendarDays size={15} />
                <span>
                  Valid until {discount.validTo}
                </span>
              </div>

              <div>
                <Percent size={15} />
                <span>
                  {discount.products}
                </span>
              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Discounts;
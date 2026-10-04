// frontend/src/components/TicketForm.jsx

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createTicket } from "../api/ticketAPI.js";

const CATEGORIES = [
  "general",
  "hardware",
  "software",
  "network",
  "account",
  "other",
];

export default function TicketForm() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Guest";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "general",
      reportTo: "",
    },
  });

  async function submitForm(data) {
    try {
      await createTicket({ ...data, username });
      alert("Ticket successfully created!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error creating ticket:", err);
      alert("Failed to create ticket. Please try again.");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 bg-gray-100">
      <h2 className="text-3xl font-semibold mb-6">Create new ticket</h2>
      <form
        onSubmit={handleSubmit(submitForm)}
        className="space-y-4 bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <p>
          Welcome, <b>{username}</b>!
        </p>

        <label className="block">
          Title:
          <input
            type="text"
            {...register("title", { required: "Title is required" })}
            className="border border-gray-300 w-full p-2 rounded-md mt-1"
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
          )}
        </label>

        <label className="block">
          Description:
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            className="border border-gray-300 w-full p-2 rounded-md mt-1"
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </label>

        <label className="block">
          Category:
          <select
            {...register("category")}
            className="border border-gray-300 w-full p-2 rounded-md mt-1"
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          Report To:
          <select
            {...register("reportTo", { required: "Please choose a team" })}
            className="border border-gray-300 w-full p-2 rounded-md mt-1"
          >
            <option value="" disabled>
              Select a team
            </option>
            <option value="admin">Admin</option>
            <option value="support">Support</option>
          </select>
          {errors.reportTo && (
            <p className="text-red-600 text-sm mt-1">
              {errors.reportTo.message}
            </p>
          )}
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white py-2 rounded-md transition-colors"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

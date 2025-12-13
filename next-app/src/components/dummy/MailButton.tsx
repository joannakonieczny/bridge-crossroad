"use client";

import { useState } from "react";
import { sendEmailAction } from "@/services/mailer/api";

export default function SendEmailButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendEmail = async () => {
    setLoading(true);
    setMessage("");

    try {
      await sendEmailAction({
        email: "szymek.kubiczek@gmail.com",
        title: "Testowy Mail",
        body: "<b>Donna mama es chujocita</b>",
      });

      setMessage("Mail wysłany! 🎉");
    } catch (err) {
      console.error(err);
      setMessage("Błąd podczas wysyłki maila");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleSendEmail}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Wysyłanie..." : "Wyślij maila"}
      </button>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}

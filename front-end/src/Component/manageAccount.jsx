import React, { useState, useEffect } from "react";
import axios from "./../axios";
import { useTranslation } from "react-i18next";
import { Button, Table } from "react-bootstrap";

const ManageAccount = () => {
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get("/api/accounts");
        setAccounts(response.data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this account?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`/api/accounts/${id}`);
        setAccounts((prevAccounts) =>
          prevAccounts.filter((account) => account.id !== id)
        );
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  };

  const handleEdit = async (id) => {
    const newRole = prompt("Enter new role for this account:");
    if (newRole) {
      try {
        await axios.put(`/api/accounts/${id}`, { role: newRole });
        setAccounts((prevAccounts) =>
          prevAccounts.map((account) =>
            account.id === id ? { ...account, role: newRole } : account
          )
        );
      } catch (error) {
        console.error("Error updating account:", error);
      }
    }
  };

  return (
    <div
      className="account-container"
      style={{ backgroundColor: "#f7f7f7", padding: "20px" }}>
      <h1 className="text-center text-muted">{t("Manage_Accounts")}</h1>
      <Table striped bordered hover responsive variant="light">
        <thead>
          <tr>
            <th>{t("ID")}</th>
            <th>{t("Email")}</th>
            <th>{t("Role")}</th>
            <th>{t("Actions")}</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id}>
              <td>{account.id}</td>
              <td>{account.email}</td>
              <td>{account.role}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleEdit(account.id)}
                  className="mx-2">
                  {t("Edit")}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(account.id)}>
                  {t("Delete")}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ManageAccount;

'use client'

import React, { useState, useEffect } from 'react'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { firebaseConfig } from './credenciais/firebase.credenciais'

// Initialize Firebase (replace with your own config)

  
  
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function EnhancedFinanceAdmin() {
  const [transactions, setTransactions] = useState([])
  const [newTransaction, setNewTransaction] = useState({ date: '', description: '', amount: '', category: '' })
  const [budget, setBudget] = useState({ amount: 0, id: '' })
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchTransactions()
    fetchBudget()
    fetchCategories()
  }, [])

  const fetchTransactions = async () => {
    const querySnapshot = await getDocs(collection(db, "transactions"))
    const fetchedTransactions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    setTransactions(fetchedTransactions)
  }

  const fetchBudget = async () => {
    const querySnapshot = await getDocs(collection(db, "budget"))
    if (!querySnapshot.empty) {
      const budgetDoc = querySnapshot.docs[0]
      setBudget({ amount: budgetDoc.data().amount, id: budgetDoc.id })
    }
  }

  const fetchCategories = async () => {
    const querySnapshot = await getDocs(collection(db, "categories"))
    const fetchedCategories = querySnapshot.docs.map(doc => doc.data().name)
    setCategories(fetchedCategories)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewTransaction(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await addDoc(collection(db, "transactions"), newTransaction)
    setNewTransaction({ date: '', description: '', amount: '', category: '' })
    fetchTransactions()
  }

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "transactions", id))
    fetchTransactions()
  }

  const handleBudgetChange = async (e) => {
    const newBudgetAmount = parseFloat(e.target.value)
    if (budget.id) {
      await updateDoc(doc(db, "budget", budget.id), { amount: newBudgetAmount }).catch(err => console.log(err))
    } else {
      const docRef = await addDoc(collection(db, "budget"), { amount: newBudgetAmount })
      setBudget(prev => ({ ...prev, id: docRef.id }))
    }
    setBudget(prev => ({ ...prev, amount: newBudgetAmount }))
  }

  const getTotalSpent = () => {
    return transactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0)
  }

  const getCategoryData = () => {
    const categoryTotals = transactions.reduce((totals, transaction) => {
      totals[transaction.category] = (totals[transaction.category] || 0) + parseFloat(transaction.amount)
      return totals
    }, {})
    return Object.entries(categoryTotals).map(([category, total]) => ({ category, total }))
  }

  return (
    <div className="finance-admin">
      <h1>Enhanced Finance Administration</h1>

      <div className="grid">
        <div className="add-transaction">
          <h2>Add Transaction</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={newTransaction.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                name="description"
                value={newTransaction.description}
                onChange={handleInputChange}
                placeholder="Description"
                required
              />
            </div>
            <div>
              <label htmlFor="amount">Amount</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={newTransaction.amount}
                onChange={handleInputChange}
                placeholder="Amount"
                required
              />
            </div>
            <div>
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={newTransaction.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <button type="submit">Add Transaction</button>
          </form>
        </div>

        <div className="budget-overview">
          <h2>Budget Overview</h2>
          <div>
            <label htmlFor="budget">Monthly Budget</label>
            <input
              type="number"
              id="budget"
              value={budget.amount}
              onChange={handleBudgetChange}
            />
          </div>
          <div className="budget-summary">
            <p>Total Spent: ${getTotalSpent().toFixed(2)}</p>
            <p>Remaining: ${(budget.amount - getTotalSpent()).toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="transactions">
        <h2>Transactions</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{transaction.date}</td>
                  <td>{transaction.description}</td>
                  <td>${parseFloat(transaction.amount).toFixed(2)}</td>
                  <td>{transaction.category}</td>
                  <td>
                    <button onClick={() => handleDelete(transaction.id)} className="delete-btn">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="charts grid">
        <div className="chart">
          <h2>Spending Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={transactions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart">
          <h2>Spending by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getCategoryData()}
                dataKey="total"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {getCategoryData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart">
        <h2>Monthly Comparison</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={transactions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <style jsx>{`
        .finance-admin {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        h1 {
          font-size: 24px;
          margin-bottom: 20px;
        }

        h2 {
          font-size: 20px;
          margin-bottom: 15px;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .add-transaction, .budget-overview {
          background-color: #f5f5f5;
          padding: 20px;
          border-radius: 5px;
        }

        form div {
          margin-bottom: 15px;
        }

        label {
          display: block;
          margin-bottom: 5px;
        }

        input, select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        button {
          background-color: #4CAF50;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        button:hover {
          background-color: #45a049;
        }

        .budget-summary {
          background-color: #e9e9e9;
          padding: 10px;
          border-radius: 4px;
          margin-top: 15px;
        }

        .transactions {
          margin-top: 30px;
        }

        .table-container {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }

        th {
          background-color: #f2f2f2;
        }

        .delete-btn {
          background-color: #f44336;
        }

        .delete-btn:hover {
          background-color: #d32f2f;
        }

        .charts {
          margin-top: 30px;
        }

        .chart {
          background-color: #f5f5f5;
          padding: 20px;
          border-radius: 5px;
          margin-bottom: 20px;
        }

        @media (max-width: 768px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
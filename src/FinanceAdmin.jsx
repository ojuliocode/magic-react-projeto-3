'use client'

import React, { useState, useEffect } from 'react'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Initialize Firebase (replace with your own config)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export default function FinanceAdmin() {
  const [transactions, setTransactions] = useState([])
  const [newTransaction, setNewTransaction] = useState({ date: '', description: '', amount: '' })

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    const querySnapshot = await getDocs(collection(db, "transactions"))
    const fetchedTransactions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    setTransactions(fetchedTransactions)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewTransaction(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await addDoc(collection(db, "transactions"), newTransaction)
    setNewTransaction({ date: '', description: '', amount: '' })
    fetchTransactions()
  }

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "transactions", id))
    fetchTransactions()
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Finance Administration</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4 mb-4">
          <input
            type="date"
            name="date"
            value={newTransaction.date}
            onChange={handleInputChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="description"
            value={newTransaction.description}
            onChange={handleInputChange}
            placeholder="Description"
            required
            className="border p-2 rounded flex-grow"
          />
          <input
            type="number"
            name="amount"
            value={newTransaction.amount}
            onChange={handleInputChange}
            placeholder="Amount"
            required
            className="border p-2 rounded w-32"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Transaction</button>
        </div>
      </form>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Transactions</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">Description</th>
              <th className="border p-2 text-left">Amount</th>
              <th className="border p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <td className="border p-2">{transaction.date}</td>
                <td className="border p-2">{transaction.description}</td>
                <td className="border p-2">${parseFloat(transaction.amount).toFixed(2)}</td>
                <td className="border p-2">
                  <button onClick={() => handleDelete(transaction.id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Financial Overview</h2>
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
    </div>
  )
}
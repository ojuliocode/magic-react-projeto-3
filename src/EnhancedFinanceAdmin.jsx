'use client'

import React, { useState, useEffect } from 'react'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { firebaseConfig } from './credenciais/firebase.credenciais'
import * as transacaoServico from './servicos/transacao.servico'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function EnhancedFinanceAdmin() {
  const [transactions, setTransactions] = useState([])
  const [novaTransacao, setNovaTransacao] = useState({ date: '', description: '', amount: '', category: '' })
  const [orcamento, setOrcamento] = useState({ amount: 0, id: '' })
  const [categories, setCategories] = useState([])

  useEffect(() => {
    buscarTransacoes()
    buscarOrcamento()
    fetchCategories()
  }, [])

  const buscarTransacoes = async () => {
    const transacoes = await transacaoServico.buscarTransacoes(db)
    setTransactions(transacoes)
  }

  const buscarOrcamento = async () => {
    const querySnapshot = await getDocs(collection(db, "orcamento"))
    if (!querySnapshot.empty) {
      const orcamentoDoc = querySnapshot.docs[0]
      setOrcamento({ amount: orcamentoDoc.data().amount, id: orcamentoDoc.id })
    }
  }

  const fetchCategories = async () => {
    const querySnapshot = await getDocs(collection(db, "categories"))
    const fetchedCategories = querySnapshot.docs.map(doc => doc.data().name)
    setCategories(fetchedCategories)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNovaTransacao(prev => ({ ...prev, [name]: value }))
  }

  const aoAdicionarTransacao = async (e) => {
    e.preventDefault()
    await transacaoServico.criarTransacao(db, novaTransacao)
    setNovaTransacao({ date: '', description: '', amount: '', category: '' })
    buscarTransacoes()
  }

  const aoDeletarTransacao = async (transacaoId) => {
    transacaoServico.deletarTransacao(db, transacaoId)
    buscarTransacoes()
  }

  const aoMudarOrcamento = async (e) => {
    const newBudgetAmount = parseFloat(e.target.value)
    if (orcamento.id) {
      await updateDoc(doc(db, "orcamento", orcamento.id), { amount: newBudgetAmount }).catch(err => console.log(err))
    } else {
      const docRef = await addDoc(collection(db, "orcamento"), { amount: newBudgetAmount })
      setOrcamento(prev => ({ ...prev, id: docRef.id }))
    }
    setOrcamento(prev => ({ ...prev, amount: newBudgetAmount }))
  }

  const buscarTotalGasto = () => {
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
          <form onSubmit={aoAdicionarTransacao}>
            <div>
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={novaTransacao.date}
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
                value={novaTransacao.description}
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
                value={novaTransacao.amount}
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
                value={novaTransacao.category}
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

        <div className="orcamento-overview">
          <h2>Budget Overview</h2>
          <div>
            <label htmlFor="orcamento">Monthly Budget</label>
            <input
              type="number"
              id="orcamento"
              value={orcamento.amount}
              onChange={aoMudarOrcamento}
            />
          </div>
          <div className="orcamento-summary">
            <p>Total Spent: ${buscarTotalGasto().toFixed(2)}</p>
            <p>Remaining: ${(orcamento.amount - buscarTotalGasto()).toFixed(2)}</p>
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
                    <button onClick={() => aoDeletarTransacao(transaction.id)} className="delete-btn">Delete</button>
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

    </div>
  )
}
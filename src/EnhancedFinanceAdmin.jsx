"use client";

import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { firebaseConfig } from "./credenciais/firebase.credenciais";
import * as transacaoServico from "./servicos/transacao.servico";
import GastoMes from "./componentes/Graficos/GastosMes";
import Transacoes from "./componentes/Listagem/Transacoes";
import Orcamento from "./componentes/Formularios/Orcamento";
import Transacao from "./componentes/Formularios/Transacao";
import Grid from "./componentes/Graficos/Grid";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function EnhancedFinanceAdmin() {
  const [transactions, setTransactions] = useState([]);
  const [novaTransacao, setNovaTransacao] = useState({
    date: "",
    description: "",
    amount: "",
    category: "",
  });
  const [orcamento, setOrcamento] = useState({ amount: 0, id: "" });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    buscarTransacoes();
    buscarOrcamento();
    fetchCategories();
  }, []);

  const buscarTransacoes = async () => {
    const transacoes = await transacaoServico.buscarTransacoes(db);
    setTransactions(transacoes);
  };

  const buscarOrcamento = async () => {
    const querySnapshot = await getDocs(collection(db, "orcamento"));
    if (!querySnapshot.empty) {
      const orcamentoDoc = querySnapshot.docs[0];
      setOrcamento({ amount: orcamentoDoc.data().amount, id: orcamentoDoc.id });
    }
  };

  const fetchCategories = async () => {
    const querySnapshot = await getDocs(collection(db, "categories"));
    const fetchedCategories = querySnapshot.docs.map((doc) => doc.data().name);
    setCategories(fetchedCategories);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovaTransacao((prev) => ({ ...prev, [name]: value }));
  };

  const aoAdicionarTransacao = async (e) => {
    e.preventDefault();
    await transacaoServico.criarTransacao(db, novaTransacao);
    setNovaTransacao({ date: "", description: "", amount: "", category: "" });
    buscarTransacoes();
  };

  const aoDeletarTransacao = async (transacaoId) => {
    transacaoServico.deletarTransacao(db, transacaoId);
    buscarTransacoes();
  };

  const aoMudarOrcamento = async (e) => {
    const newBudgetAmount = parseFloat(e.target.value);
    if (orcamento.id) {
      await updateDoc(doc(db, "orcamento", orcamento.id), {
        amount: newBudgetAmount,
      }).catch((err) => console.log(err));
    } else {
      const docRef = await addDoc(collection(db, "orcamento"), {
        amount: newBudgetAmount,
      });
      setOrcamento((prev) => ({ ...prev, id: docRef.id }));
    }
    setOrcamento((prev) => ({ ...prev, amount: newBudgetAmount }));
  };

  const buscarTotalGasto = () => {
    return transactions.reduce(
      (sum, transaction) => sum + parseFloat(transaction.amount),
      0
    );
  };

  const getCategoryData = () => {
    const categoryTotals = transactions.reduce((totals, transaction) => {
      totals[transaction.category] =
        (totals[transaction.category] || 0) + parseFloat(transaction.amount);
      return totals;
    }, {});
    return Object.entries(categoryTotals).map(([category, total]) => ({
      category,
      total,
    }));
  };

  return (
    <div className="finance-admin">
      <h1>Enhanced Finance Administration</h1>
      <div className="grid">
        <Transacao
          aoAdicionarTransacao={aoAdicionarTransacao}
          novaTransacao={novaTransacao}
          handleInputChange={handleInputChange}
          categories={categories}
        />
        <Orcamento
          orcamento={orcamento}
          aoMudarOrcamento={aoMudarOrcamento}
          buscarTotalGasto={buscarTotalGasto}
        />
      </div>
      <Transacoes transactions={transactions} aoDeletarTransacao={aoDeletarTransacao}/>
      <div>
        <Grid transactions={transactions} getCategoryData={getCategoryData} />

        <GastoMes transactions={transactions} />
      </div>
    </div>
  );
}

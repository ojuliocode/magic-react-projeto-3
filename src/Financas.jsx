import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { firebaseConfig } from "./credenciais/firebase.credenciais";
import * as transacaoServico from "./servicos/transacao.servico";
import GastoMes from "./componentes/Graficos/GastosMes";
import Transacoes from "./componentes/Listagem/Transacoes";
import Orcamento from "./componentes/Formularios/Orcamento";
import Transacao from "./componentes/Formularios/Transacao";
import Grid from "./componentes/Graficos/Grid";
import { categorias } from "./constantes/categorias";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Financas() {
  const [transacoes, setTransacoes] = useState([]);
  const [novaTransacao, setNovaTransacao] = useState({
    data: "",
    descricao: "",
    quantia: "",
    categoria: "",
  });
  const [orcamento, setOrcamento] = useState({ quantia: 0, id: "" });

  useEffect(() => {
    buscarTransacoes();
    buscarOrcamento();
  }, []);

  const buscarTransacoes = async () => {
    const transacoes = await transacaoServico.buscarTransacoes(db);
    setTransacoes(transacoes);
  };

  const buscarOrcamento = async () => {
    const querySnapshot = await getDocs(collection(db, "orcamento"));
    if (!querySnapshot.empty) {
      const orcamentoDoc = querySnapshot.docs[0];
      setOrcamento({
        quantia: orcamentoDoc.data().quantia,
        id: orcamentoDoc.id,
      });
    }
  };

  const aoMudarInput = (e) => {
    const { name, value } = e.target;
    setNovaTransacao((anterior) => ({ ...anterior, [name]: value }));
  };

  const aoAdicionarTransacao = async (e) => {
    e.preventDefault();
    await transacaoServico.criarTransacao(db, novaTransacao);
    setNovaTransacao({ data: "", descricao: "", quantia: "", categoria: "" });
    buscarTransacoes();
  };

  const aoDeletarTransacao = async (transacaoId) => {
    transacaoServico.deletarTransacao(db, transacaoId);
    buscarTransacoes();
  };

  const aoMudarOrcamento = async (e) => {
    const newOrcamentoQuantia = parseFloat(e.target.value);
    if (orcamento.id) {
      await updateDoc(doc(db, "orcamento", orcamento.id), {
        quantia: newOrcamentoQuantia,
      }).catch((err) => console.log(err));
    } else {
      const docRef = await addDoc(collection(db, "orcamento"), {
        quantia: newOrcamentoQuantia,
      });
      setOrcamento((anterior) => ({ ...anterior, id: docRef.id }));
    }
    setOrcamento((anterior) => ({ ...anterior, quantia: newOrcamentoQuantia }));
  };

  const buscarTotalGasto = () => {
    return transacoes.reduce(
      (sum, transacao) => sum + parseFloat(transacao.quantia),
      0
    );
  };

  const getCategoriaData = () => {
    const categoriaTotals = transacoes.reduce((totals, transacao) => {
      totals[transacao.categoria] =
        (totals[transacao.categoria] || 0) + parseFloat(transacao.quantia);
      return totals;
    }, {});
    return Object.entries(categoriaTotals).map(([categoria, total]) => ({
      categoria,
      total,
    }));
  };

  return (
    <div className="finance-admin">
      <h1>Administrador de Finanças &#128181;</h1>
      <div className="grid">
        <Transacao
          aoAdicionarTransacao={aoAdicionarTransacao}
          novaTransacao={novaTransacao}
          aoMudarInput={aoMudarInput}
          categorias={categorias}
        />
        <Orcamento
          orcamento={orcamento}
          aoMudarOrcamento={aoMudarOrcamento}
          buscarTotalGasto={buscarTotalGasto}
        />
      </div>
      <Transacoes
        transacoes={transacoes}
        aoDeletarTransacao={aoDeletarTransacao}
      />
      <div>
        <Grid transacoes={transacoes} getCategoriaData={getCategoriaData} />

        <GastoMes transacoes={transacoes} />
      </div>
    </div>
  );
}

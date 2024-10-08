import GastosCategoria from "./GastosCategoria";
import GastosTempo from "./GastosTempo";

export default function Grid({ transacoes, getCategoriaData }) {
  return (
    <div className="graficos grid">
      <GastosTempo transacoes={transacoes} />

      <GastosCategoria getCategoriaData={getCategoriaData} />
    </div>
  );
}

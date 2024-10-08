import GastosCategoria from "./GastosCategoria";
import GastosTempo from "./GastosTempo";

export default function Grid({ transactions, getCategoryData }) {
  return (
    <div className="charts grid">
      <GastosTempo transactions={transactions} />

      <GastosCategoria getCategoryData={getCategoryData} />
    </div>
  );
}

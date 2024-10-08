export default function Orcamento({ orcamento, aoMudarOrcamento, buscarTotalGasto}){
    return(
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
          <p>
            Remaining: ${(orcamento.amount - buscarTotalGasto()).toFixed(2)}
          </p>
        </div>
      </div>
    )
}
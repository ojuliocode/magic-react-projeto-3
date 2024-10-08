export default function Orcamento({ orcamento, aoMudarOrcamento, buscarTotalGasto}){
    return(
        <div className="orcamento-overview">
        <h2>Orcamento</h2>
        <div>
          <label htmlFor="orcamento">Orçamento Mensal</label>
          <input
            type="number"
            id="orcamento"
            value={orcamento.quantia}
            onChange={aoMudarOrcamento}
          />
        </div>
        <div className="orcamento-summary">
          <p>Total Gasto: R${buscarTotalGasto().toFixed(2)}</p>
          <p>
            Restante a gastar: R${(orcamento.quantia - buscarTotalGasto()).toFixed(2)}
          </p>
        </div>
      </div>
    )
}
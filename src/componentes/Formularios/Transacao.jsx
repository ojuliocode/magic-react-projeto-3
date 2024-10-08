export default function Transacao({
    aoAdicionarTransacao,
    novaTransacao,
    handleInputChange,
    categorias
}){
    return(
        
        <div className="add-transacao">
          <h2>Adicionar transação</h2>
          <form onSubmit={aoAdicionarTransacao}>
            <div>
              <label htmlFor="data">Data</label>
              <input
                type="date"
                id="data"
                name="data"
                value={novaTransacao.data}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="descricao">Descricao</label>
              <input
                type="text"
                id="descricao"
                name="descricao"
                value={novaTransacao.descricao}
                onChange={handleInputChange}
                placeholder="Descricao"
                required
              />
            </div>
            <div>
              <label htmlFor="quantia">Quantia</label>
              <input
                type="number"
                id="quantia"
                name="quantia"
                value={novaTransacao.quantia}
                onChange={handleInputChange}
                placeholder="Quantia"
                required
              />
            </div>
            <div>
              <label htmlFor="categoria">Categoria</label>
              <select
                id="categoria"
                name="categoria"
                value={novaTransacao.categoria}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione a categoria</option>
                {categorias.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit">Adicionar transação</button>
          </form>
        </div>
    )
}
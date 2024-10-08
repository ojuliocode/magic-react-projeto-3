export default function Transacoes({transacoes, aoDeletarTransacao}){
    return(
        <div className="transacoes">
        <h2>Transacoes</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descricao</th>
                <th>Quantia</th>
                <th>Categoria</th>
                <th>Acao</th>
              </tr>
            </thead>
            <tbody>
              {transacoes.map((transacao) => (
                <tr key={transacao.id}>
                  <td>{transacao.data}</td>
                  <td>{transacao.descricao}</td>
                  <td>R${parseFloat(transacao.quantia).toFixed(2)}</td>
                  <td>{transacao.categoria}</td>
                  <td>
                    <button
                      onClick={() => aoDeletarTransacao(transacao.id)}
                      className="delete-btn"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
}
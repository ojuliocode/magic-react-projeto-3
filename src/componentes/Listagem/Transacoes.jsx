export default function Transacoes({transactions, aoDeletarTransacao}){
    return(
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
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.date}</td>
                  <td>{transaction.description}</td>
                  <td>${parseFloat(transaction.amount).toFixed(2)}</td>
                  <td>{transaction.category}</td>
                  <td>
                    <button
                      onClick={() => aoDeletarTransacao(transaction.id)}
                      className="delete-btn"
                    >
                      Delete
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
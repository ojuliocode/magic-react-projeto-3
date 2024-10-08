export default function Transacao({
    aoAdicionarTransacao,
    novaTransacao,
    handleInputChange,
    categories
}){
    return(
        
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
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit">Add Transaction</button>
          </form>
        </div>
    )
}
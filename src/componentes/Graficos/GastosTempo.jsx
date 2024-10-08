import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function GastosTempo({transacoes}){
    return(
        
        <div className="grafico">
        <h2>Gasto ao longo do tempo</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={transacoes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="quantia" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
}
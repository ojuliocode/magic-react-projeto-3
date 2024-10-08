import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";


export default function GastoMes({ transacoes }){
    
    return(
        <div className="grafico">
          <h2>Comparação Mensal</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transacoes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantia" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
    )
}
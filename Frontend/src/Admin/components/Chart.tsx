import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import data from '../constants/data.json';
import { ChartBarStacked } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

interface SalesData {
  date: string;
  total: number;
}

interface OrderStats {
  successful: number;
  failed: number;
  inProgress: number;
}

interface Product {
  name: string;
  quantity: number;
}

const Chart: React.FC = () => {
  const [startDate1, setStartDate1] = useState<string>('');
  const [endDate1, setEndDate1] = useState<string>('');
  const [startDate2, setStartDate2] = useState<string>('');
  const [endDate2, setEndDate2] = useState<string>('');
  const [salesData1, setSalesData1] = useState<SalesData[]>([]);
  const [salesData2, setSalesData2] = useState<SalesData[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStats>({ successful: 0, failed: 0, inProgress: 0 });
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [showSalesChart2, setShowSalesChart2] = useState<boolean>(true);

  useEffect(() => {
    const today = new Date();
    const start1 = new Date(today.getFullYear(), today.getMonth(), 1);
    const end1 = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const start2 = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const end2 = new Date(today.getFullYear(), today.getMonth(), 0);

    setStartDate1(start1.toISOString().split('T')[0]);
    setEndDate1(end1.toISOString().split('T')[0]);
    setStartDate2(start2.toISOString().split('T')[0]);
    setEndDate2(end2.toISOString().split('T')[0]);

    fetchData(start1, end1, start2, end2);
  }, []);

  const fetchData = (start1: Date, end1: Date, start2: Date, end2: Date) => {
    const startDateStr1 = start1.toISOString().split('T')[0];
    const endDateStr1 = end1.toISOString().split('T')[0];
    const startDateStr2 = start2.toISOString().split('T')[0];
    const endDateStr2 = end2.toISOString().split('T')[0];

    const filterData = (data: SalesData[], startDate: string, endDate: string) =>
      data.filter(d => d.date >= startDate && d.date <= endDate);

    const sales1 = filterData(data.september.sales, startDateStr1, endDateStr1);
    const sales2 = filterData(data.august.sales, startDateStr2, endDateStr2);

    setSalesData1(sales1);
    setSalesData2(sales2);
    setOrderStats(data.august.orderStats);
    setTopProducts(data.august.topProducts);
  };

  const handleStartDate1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate1(e.target.value);
    updateData(e.target.value, endDate1, startDate2, endDate2);
  };

  const handleEndDate1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate1(e.target.value);
    updateData(startDate1, e.target.value, startDate2, endDate2);
  };

  const handleStartDate2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate2(e.target.value);
    updateData(startDate1, endDate1, e.target.value, endDate2);
  };

  const handleEndDate2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate2(e.target.value);
    updateData(startDate1, endDate1, startDate2, e.target.value);
  };

  const updateData = (start1: string, end1: string, start2: string, end2: string) => {
    fetchData(new Date(start1), new Date(end1), new Date(start2), new Date(end2));
  };

  const salesChartData1 = {
    labels: salesData1.map(sale => sale.date),
    datasets: [
      {
        label: 'Total de ventes - Aout',
        data: salesData1.map(sale => sale.total),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const salesChartData2 = {
    labels: salesData2.map(sale => sale.date),
    datasets: [
      {
        label: 'Total de ventes - Juillet',
        data: salesData2.map(sale => sale.total),
        fill: false,
        backgroundColor: 'rgba(153,102,255,0.4)',
        borderColor: 'rgba(153,102,255,1)',
      },
    ],
  };

  const orderStatusData = {
    labels: ['Terminé', 'Echec', 'Livraison'],
    datasets: [
      {
        label: 'Order Status',
        data: [orderStats.successful, orderStats.failed, orderStats.inProgress],
        backgroundColor: ['rgba(75,192,192,0.5)', 'rgba(255,99,132,0.5)', 'rgba(255,205,86,0.5)'],
        borderColor: ['rgba(75,192,192,1)', 'rgba(255,99,132,1)', 'rgba(255,205,86,1)'],
        borderWidth: 1,
      },
    ],
  };

  const topProductsData = {
    labels: topProducts.map(product => product.name),
    datasets: [
      {
        data: topProducts.map(product => product.quantity),
        backgroundColor: [
          'rgba(75,192,192,0.5)',
          'rgba(153,102,255,0.5)',
          'rgba(255,159,64,0.5)',
          'rgba(255,99,132,0.5)',
          'rgba(255,205,86,0.5)',
        ],
        borderColor: [
          'rgba(75,192,192,1)',
          'rgba(153,102,255,1)',
          'rgba(255,159,64,1)',
          'rgba(255,99,132,1)',
          'rgba(255,205,86,1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <div>

        <div className="flex justify-center my-8">
          <button
            onClick={() => setShowSalesChart2(!showSalesChart2)}
          className="flex justify-center items-center shadow-lg gap-2 bg-teal-500 text-white py-1 rounded-sm px-2 cursor-pointer"
          >
            <ChartBarStacked />
            Comparer
          </button>
        </div>
        <h3>Total de ventes</h3>
        <div className='flex flex-col gap-y-28'>

          <div className='flex gap-4 mb-4'>
            <div style={{ width: showSalesChart2 ? '48%' : '100%', height: '400px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <input
                  type="date"
                  value={startDate1}
                  onChange={handleStartDate1Change}
                  style={{
                    marginBottom: '10px',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    width: '48%',
                    fontSize: '16px',
                  }}
                />
                <input
                  type="date"
                  value={endDate1}
                  onChange={handleEndDate1Change}
                  style={{
                    marginBottom: '10px',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    width: '48%',
                    fontSize: '16px',
                  }}
                />
              </div>
              <Line data={salesChartData1} options={{ maintainAspectRatio: false }} />
            </div>
            {showSalesChart2 && (
              <div style={{ width: '48%', height: '400px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <input
                    type="date"
                    value={startDate2}
                    onChange={handleStartDate2Change}
                    style={{
                      marginBottom: '10px',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #ccc',
                      width: '48%',
                      fontSize: '16px',
                    }}
                  />
                  <input
                    type="date"
                    value={endDate2}
                    onChange={handleEndDate2Change}
                    style={{
                      marginBottom: '10px',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #ccc',
                      width: '48%',
                      fontSize: '16px',
                    }}
                  />
                </div>
                <Line data={salesChartData2} options={{ maintainAspectRatio: false }} />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-20">
          <div style={{ width: '45%', height: '300px' }}>
            <h3>Livraisons</h3>
            <Bar data={orderStatusData} options={{ maintainAspectRatio: false }} />
          </div>
          <div style={{ width: '45%', height: '300px' }}>
            <h3>Top 5 des catégories</h3>
            <Pie data={topProductsData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chart;

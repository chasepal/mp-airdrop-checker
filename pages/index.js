import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [addresses, setAddresses] = useState('');
  const [results, setResults] = useState([]);

  const checkAddresses = async () => {
    const addressList = addresses.split('\n').filter(address => address.trim() !== '');
    const checkResults = await Promise.all(addressList.map(async (address) => {
      try {
        const response = await axios.get(`https://subapi.izumi.finance/api/v1/sub_task/merkle/?tag=MerlinSwap_Airdrop_2_esmp-2024-07-04&address=${address.trim()}`);
        const hasAirdrop = response.data.is_success && Object.keys(response.data.data).length > 0;
        let amount = null;
        if (hasAirdrop && response.data.data.amount) {
          // 将金额除以 10^18 并保留 4 位小数
          amount = (Number(response.data.data.amount) / 1e18).toFixed(4);
        }
        return { 
          address, 
          hasAirdrop, 
          amount
        };
      } catch (error) {
        return { address, hasAirdrop: false, error: error.message };
      }
    }));
    setResults(checkResults);
  };

  return (
    <div>
      <h1>MP Airdrop Checker</h1>
      <textarea
        value={addresses}
        onChange={(e) => setAddresses(e.target.value)}
        placeholder="Enter Ethereum addresses, one per line"
        rows={10}
        cols={50}
      />
      <br />
      <button onClick={checkAddresses}>Check Addresses</button>
      <div>
        <h2>Results:</h2>
        <ul>
          {results.map((result, index) => (
            <li key={index}>
              {result.address}: {result.hasAirdrop ? `Has airdrop (Amount: ${result.amount} ESMP)` : 'No airdrop'}
              {result.error && ` (Error: ${result.error})`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

import "./styles.css";
import { useState, useEffect } from "react";

export default function App() {
  const [amount, setAmount] = useState("");
  const [items, setItems] = useState([]);

  function handleConversion(item) {
    setItems((items) => [...items, item]);
  }

  return (
    <div className="App">
      <Form
        amount={amount}
        setAmount={setAmount}
        onConvert={handleConversion}
      />
      <OutputList items={items} />
    </div>
  );
}

function Form({ amount, setAmount, onConvert }) {
  const [fromCur, setFromCur] = useState("PHP");
  const [toCur, setToCur] = useState("USD");

  function handleSubmit(e) {
    e.preventDefault();

    const conversionItem = {
      amount,
      fromCur,
      toCur
    };
    onConvert(conversionItem);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select value={fromCur} onChange={(e) => setFromCur(e.target.value)}>
          <option value="PHP">PHP</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="CAD">CAD</option>
          <option value="INR">INR</option>
        </select>
        <span> => </span>
        <select value={toCur} onChange={(e) => setToCur(e.target.value)}>
          <option value="PHP">PHP</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="CAD">CAD</option>
          <option value="INR">INR</option>
        </select>
        <button type="submit">Convert</button>
      </div>
    </form>
  );
}

function OutputList({ items }) {
  const [converted, setConverted] = useState("");

  useEffect(() => {
    async function getConversion() {
      const { amount, fromCur, toCur } = items[items.length - 1];

      const res = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCur}&to=${toCur}`
      );
      const data = await res.json();

      // Extract the converted number
      const convertedNumber = data.rates[toCur];

      // Format the converted amount with currency symbol
      const formattedConvertedAmount = formatCurrency(convertedNumber, toCur);

      setConverted(formattedConvertedAmount);
    }

    if (items.length > 0) {
      getConversion();
    }
  }, [items]);

  // Currency formatting function
  function formatCurrency(amount, currency) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency
    }).format(amount);
  }

  return (
    <div>
      {converted ? (
        <h1>Output: {converted}</h1>
      ) : (
        <h1>No conversion results yet.</h1>
      )}
    </div>
  );
}

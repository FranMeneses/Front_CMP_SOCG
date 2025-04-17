import { useState, useEffect } from 'react';

export const useExchangeRates = () => {
  const [exchangeRates, setExchangeRates] = useState({
    USD: 1,
    UF: 1,
    CLP: 1,
  });

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch('https://mindicador.cl/api');
        const data = await response.json();

        const usdToClp = data.dolar.valor;
        const ufToUsd = data.uf.valor / data.dolar.valor;
        setExchangeRates({
          USD: 1,
          UF: Math.round(ufToUsd),
          CLP: usdToClp,
        });
      } catch (error) {
        console.error('Error al obtener las tasas de cambio:', error);
      }
    };

    fetchExchangeRates();
  }, []);

  return exchangeRates;
};
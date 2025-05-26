import { useState, useEffect } from 'react';
/**
 * Función para obtener las tasas de cambio de USD, UF y CLP.
 * Utiliza la API de mindicador.cl para obtener los valores actuales.
 * @returns 
 */
export const useExchangeRates = () => {
  const [exchangeRates, setExchangeRates] = useState({
    USD: 1,
    UF: 1,
    CLP: 1,
  });

  /**
   * Hook para obtener las tasas de cambio al montar el componente.
   */
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
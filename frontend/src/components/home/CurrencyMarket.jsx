import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowDownRight, FiArrowUpRight, FiClock, FiRefreshCw, FiTrendingUp } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext.jsx';

const API_URL = 'https://api.frankfurter.dev/v2/rates';
const CACHE_DURATION = 30 * 60 * 1000;

const CURRENCIES = {
  ETB: { name: 'Ethiopian Birr', flag: '🇪🇹' },
  EUR: { name: 'Euro', flag: '🇪🇺' },
  GBP: { name: 'British Pound', flag: '🇬🇧' },
  KES: { name: 'Kenyan Shilling', flag: '🇰🇪' },
  AED: { name: 'UAE Dirham', flag: '🇦🇪' },
  CNY: { name: 'Chinese Yuan', flag: '🇨🇳' },
  USD: { name: 'US Dollar', flag: '🇺🇸' },
};

const BASE_OPTIONS = ['USD', 'EUR', 'GBP'];
const formatApiDate = (date) => date.toISOString().slice(0, 10);

const normalizeRates = (rows, base) => {
  if (!Array.isArray(rows)) throw new Error('Unexpected exchange-rate response.');

  const byDate = rows.reduce((dates, row) => {
    if (!row?.date || !row?.quote || !Number.isFinite(Number(row.rate))) return dates;
    if (!dates[row.date]) dates[row.date] = {};
    dates[row.date][row.quote] = Number(row.rate);
    return dates;
  }, {});
  const dates = Object.keys(byDate).sort();
  if (!dates.length) throw new Error('No exchange rates are currently available.');

  const latestDate = dates[dates.length - 1];
  const previousDate = dates.length > 1 ? dates[dates.length - 2] : null;
  return {
    base,
    latestDate,
    previousDate,
    current: byDate[latestDate],
    previous: previousDate ? byDate[previousDate] : {},
  };
};

const CurrencyMarket = () => {
  const { isDark } = useTheme();
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRates = useCallback(async ({ force = false, signal } = {}) => {
    setLoading(true);
    setError('');
    const cacheKey = `tradextv_fx_${baseCurrency}`;

    try {
      if (!force) {
        let cached = null;
        try {
          cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
        } catch {
          localStorage.removeItem(cacheKey);
        }
        if (cached?.savedAt && Date.now() - cached.savedAt < CACHE_DURATION && cached.data) {
          setMarketData(cached.data);
          setLoading(false);
          return;
        }
      }

      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 8);
      const quotes = Object.keys(CURRENCIES).filter((code) => code !== baseCurrency);
      const params = new URLSearchParams({
        from: formatApiDate(fromDate),
        base: baseCurrency,
        quotes: quotes.join(','),
      });
      const response = await fetch(`${API_URL}?${params.toString()}`, {
        signal,
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`Exchange-rate service returned ${response.status}.`);

      const normalized = normalizeRates(await response.json(), baseCurrency);
      setMarketData(normalized);
      localStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), data: normalized }));
    } catch (requestError) {
      if (requestError.name !== 'AbortError') {
        setError('Currency rates are temporarily unavailable. Please try again.');
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [baseCurrency]);

  useEffect(() => {
    const controller = new AbortController();
    setMarketData((current) => current?.base === baseCurrency ? current : null);
    loadRates({ signal: controller.signal });
    return () => controller.abort();
  }, [loadRates]);

  const rateCards = useMemo(() => {
    if (!marketData) return [];
    return Object.entries(marketData.current)
      .filter(([code]) => CURRENCIES[code])
      .map(([code, rate]) => {
        const previousRate = marketData.previous[code];
        const change = previousRate ? ((rate - previousRate) / previousRate) * 100 : null;
        return { code, rate, change, ...CURRENCIES[code] };
      })
      .sort((a, b) => (a.code === 'ETB' ? -1 : b.code === 'ETB' ? 1 : a.code.localeCompare(b.code)));
  }, [marketData]);

  return (
    <section id="currency-rates" className={`relative overflow-hidden py-16 md:py-20 ${isDark ? 'bg-[#07101d]' : 'bg-[#f7f5ef]'}`} aria-labelledby="currency-market-title">
      <div className="pointer-events-none absolute inset-0 brand-led-ambient" aria-hidden="true" />
      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-[#B69F60]/25 bg-[#101d33] shadow-2xl shadow-[#1A3258]/20">
          <div className="h-1 bg-gradient-to-r from-[#1A3258] via-[#B69F60] to-[#A53D32]" />

          <div className="flex flex-col gap-6 border-b border-white/10 p-6 md:flex-row md:items-end md:justify-between md:p-8">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#B69F60]">
                <FiTrendingUp aria-hidden="true" /> Daily Market Pulse
              </div>
              <h2 id="currency-market-title" className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                Currency <span className="text-[#B69F60]">Rates</span>
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">
                Follow daily reference-rate movements across currencies important to Ethiopian businesses and regional trade.
              </p>
            </motion.div>

            <div className="flex flex-wrap items-center gap-2" aria-label="Select base currency">
              <span className="mr-1 text-[10px] font-bold uppercase tracking-widest text-white/40">Base</span>
              {BASE_OPTIONS.map((code) => (
                <button key={code} type="button" onClick={() => setBaseCurrency(code)} aria-pressed={baseCurrency === code}
                  className={`rounded-full border px-4 py-2 text-xs font-bold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B69F60] ${baseCurrency === code ? 'border-[#B69F60] bg-[#B69F60] text-[#101d33] shadow-lg shadow-[#B69F60]/20' : 'border-white/15 text-white/65 hover:border-[#B69F60]/60 hover:text-white'}`}>
                  {code}
                </button>
              ))}
              <button type="button" onClick={() => loadRates({ force: true })} disabled={loading}
                className="ml-1 rounded-full border border-white/15 p-2.5 text-white/60 transition hover:border-[#B69F60]/60 hover:text-[#B69F60] disabled:cursor-wait disabled:opacity-40" aria-label="Refresh currency rates">
                <FiRefreshCw className={loading ? 'animate-spin' : ''} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="p-5 md:p-8">
            {loading && !marketData ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2, 3, 4, 5].map((item) => <div key={item} className="h-36 animate-pulse rounded-2xl bg-white/5" />)}
              </div>
            ) : error && !marketData ? (
              <div className="rounded-2xl border border-[#A53D32]/40 bg-[#A53D32]/10 px-6 py-10 text-center">
                <p className="text-sm text-white/75">{error}</p>
                <button type="button" onClick={() => loadRates({ force: true })} className="mt-4 rounded-full bg-[#B69F60] px-5 py-2 text-xs font-bold text-[#101d33]">Try again</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rateCards.map((currency, index) => {
                  const isUp = currency.change !== null && currency.change >= 0;
                  return (
                    <motion.article key={currency.code} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -4 }}
                      className={`group rounded-2xl border p-5 transition-colors duration-300 ${currency.code === 'ETB' ? 'border-[#B69F60]/60 bg-[#B69F60]/10' : 'border-white/10 bg-white/[0.035] hover:border-[#B69F60]/35'}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl" aria-hidden="true">{currency.flag}</span>
                          <div><h3 className="font-bold text-white">{currency.code}</h3><p className="text-xs text-white/45">{currency.name}</p></div>
                        </div>
                        {currency.change !== null && (
                          <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${isUp ? 'bg-[#B69F60]/15 text-[#B69F60]' : 'bg-[#A53D32]/15 text-[#C8665C]'}`}>
                            {isUp ? <FiArrowUpRight aria-hidden="true" /> : <FiArrowDownRight aria-hidden="true" />}{isUp ? '+' : ''}{currency.change.toFixed(2)}%
                          </span>
                        )}
                      </div>
                      <div className="mt-5 flex items-baseline gap-2">
                        <span className="text-2xl font-black tabular-nums text-white">{currency.rate.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/35">per 1 {baseCurrency}</span>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-5 text-[10px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
              <span className="flex items-center gap-1.5"><FiClock aria-hidden="true" /> Reference date: {marketData?.latestDate || 'Loading…'}</span>
              <span>Daily reference rates via <a href="https://frankfurter.dev" target="_blank" rel="noopener noreferrer" className="text-[#B69F60] hover:underline">Frankfurter</a> · Not live trading quotes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurrencyMarket;

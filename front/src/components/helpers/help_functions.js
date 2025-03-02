export const convertCurrency = (amount, currency, USD, EUR, RUB) => {
    let res
    currency === 'USD' && (res = amount * USD)
    currency === 'EUR' && (res = amount * EUR)
    currency === 'RUB' && (res = amount * RUB / 100)
    currency === 'BYN' && (res = amount)
    return res.toFixed(2);
};
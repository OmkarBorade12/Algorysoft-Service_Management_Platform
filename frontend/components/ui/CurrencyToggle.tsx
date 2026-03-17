'use client';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { toggleCurrency } from '@/store/slices/currencySlice';

export default function CurrencyToggle() {
    const dispatch = useAppDispatch();
    const { currency } = useAppSelector(s => s.currency);

    return (
        <button
            className="currency-toggle"
            onClick={() => dispatch(toggleCurrency())}
            title="Toggle Currency"
            aria-label="Toggle INR/USD"
        >
            <span className={`currency-opt ${currency === 'INR' ? 'active' : ''}`}>₹</span>
            <span className="currency-sep">|</span>
            <span className={`currency-opt ${currency === 'USD' ? 'active' : ''}`}>$</span>
        </button>
    );
}

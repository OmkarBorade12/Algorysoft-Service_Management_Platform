import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }: PaginationProps) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 24, padding: '16px 0' }}>
            <button 
                className="berry-btn-outline" 
                disabled={currentPage === 1} 
                onClick={() => onPageChange(currentPage - 1)}
                style={{ padding: '6px 12px', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
                Prev
            </button>
            <span style={{ fontSize: '0.85rem', color: '#697586', fontWeight: 600 }}>
                Page {currentPage} of {totalPages}
            </span>
            <button 
                className="berry-btn-outline" 
                disabled={currentPage === totalPages} 
                onClick={() => onPageChange(currentPage + 1)}
                style={{ padding: '6px 12px', opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >
                Next
            </button>
        </div>
    );
}

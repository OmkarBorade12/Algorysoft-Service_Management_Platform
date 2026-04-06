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

    // Generate page numbers
    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 24, padding: '16px 0' }}>
            <button 
                className="berry-btn-outline" 
                disabled={currentPage === 1} 
                onClick={() => onPageChange(currentPage - 1)}
                style={{ padding: '6px 12px', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: '0.85rem' }}
            >
                Prev
            </button>

            {getPageNumbers().map((p, i) => (
                <button
                    key={i}
                    onClick={() => typeof p === 'number' && onPageChange(p)}
                    disabled={typeof p !== 'number'}
                    style={{
                        padding: '6px 12px',
                        minWidth: '32px',
                        border: 'none',
                        background: currentPage === p ? '#5e35b1' : (p === '...' ? 'transparent' : '#ede7f6'),
                        color: currentPage === p ? '#fff' : '#5e35b1',
                        borderRadius: '6px',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: p === '...' ? 'default' : 'pointer'
                    }}
                >
                    {p}
                </button>
            ))}

            <button 
                className="berry-btn-outline" 
                disabled={currentPage === totalPages} 
                onClick={() => onPageChange(currentPage + 1)}
                style={{ padding: '6px 12px', opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: '0.85rem' }}
            >
                Next
            </button>
        </div>
    );
}

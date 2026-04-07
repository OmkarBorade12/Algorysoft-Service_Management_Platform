'use client';
import { WHATSAPP } from '@/lib/data';
import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppFloat() {
    return (
        <a
            href={`https://wa.me/${WHATSAPP}?text=Hi! I'm looking for business web solutions from AlgorySoft.`}
            target="_blank"
            rel="noreferrer"
            className="whatsapp-float"
            aria-label="Chat on WhatsApp"
            title="Chat with us on WhatsApp"
        >
            <FaWhatsapp size={28} />
        </a>
    );
}

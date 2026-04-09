'use client';
import { FiMapPin, FiExternalLink, FiNavigation } from 'react-icons/fi';
import styles from './MapSection.module.css';

export default function MapSection() {
    const address = "RAJIV GANDHI NAGAR, GADAG, KARNATAKA India (IN), Pin Code:- 582101";
    const encodedAddress = encodeURIComponent(address);
    // Standard Google Maps search URL
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    
    // Standard iframe embed URL (search query based)
    const embedUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

    return (
        <section className={styles.mapSection}>
            <div className="container">
                <div className="section-header" style={{ marginBottom: '40px' }}>
                    <div>
                        <span className="badge badge-category" style={{ marginBottom: '12px' }}>Find Us</span>
                        <h2 className="section-title">Our <span>Headquarters</span></h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '8px' }}>
                            Visit our main office in Gadag, Karnataka.
                        </p>
                    </div>
                    <a 
                        href={googleMapsUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="view-all-link"
                        style={{ alignSelf: 'center' }}
                    >
                        View on Maps <FiExternalLink style={{ marginLeft: '4px' }} />
                    </a>
                </div>

                <div className={styles.mapContainer}>
                    <iframe
                        title="AlgorySoft Office Map"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        src={embedUrl}
                        loading="lazy"
                        allowFullScreen
                    ></iframe>
                </div>
                
                {/* Office Info Card - Now below the map */}
                <div 
                    className={styles.infoCard}
                    onClick={() => window.open(googleMapsUrl, '_blank')}
                >
                    <div className={styles.iconWrapper}>
                        <FiMapPin size={28} />
                    </div>
                    <div className={styles.content}>
                        <div className={styles.title}>Registered Office</div>
                        <div className={styles.addressText}>{address}</div>
                    </div>
                    <div className={styles.directionBtn}>
                        <FiNavigation />
                        Get Directions
                    </div>
                </div>
            </div>
        </section>
    );
}

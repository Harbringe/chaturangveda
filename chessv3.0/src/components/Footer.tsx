'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
} from 'react-icons/fa';
import styles from './Footer.module.css';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Coaches', href: '/coaches' },
  { label: 'Curriculum', href: '/curriculum' },
  { label: 'Blog', href: '/blogs' },
];

const programLinks = [
  { label: 'Free Trial Class', href: '/book-free-trial' },
  { label: 'Group Classes', href: '/services' },
  { label: 'Private 1-on-1', href: '/services' },
  { label: 'Become a Coach', href: '/become-a-coach' },
  { label: 'Contact Us', href: '/contact' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerTop}>
          {/* Brand */}
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
              <Image
                src="/logo.png"
                alt="Chaturangveda"
                width={40}
                height={40}
                className={styles.footerLogoImg}
              />
              <div className={styles.footerLogoText}>
                <span className={styles.footerLogoTitle}>Chaturangveda</span>
                <span className={styles.footerLogoSub}>New Era in Teaching Chess</span>
              </div>
            </div>
            <p className={styles.footerDescription}>
              Expert online chess coaching for children worldwide — India, USA, UK, Australia, UAE, New Zealand, Netherlands and beyond — by FIDE-rated coaches.
            </p>
            <div className={styles.footerSocials}>
              <a href="https://wa.me/+917569194709" className={styles.socialLink} aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className={styles.socialLink} aria-label="YouTube">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.footerColumn}>
            <h4>Quick Links</h4>
            <ul>
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div className={styles.footerColumn}>
            <h4>Programs</h4>
            <ul>
              {programLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className={styles.footerColumn}>
            <h4>Contact</h4>
            <ul>
              <li><a href="tel:+917569194709">+91 75691 94709</a></li>
              <li>
                <a href="https://wa.me/+917569194709" target="_blank" rel="noopener noreferrer">
                  WhatsApp Us
                </a>
              </li>
              <li><span>Hyderabad, India</span></li>
              <li><span>Online · Available Worldwide</span></li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© {currentYear} Chaturangveda. All rights reserved.</p>
          <div className={styles.footerBottomLinks}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

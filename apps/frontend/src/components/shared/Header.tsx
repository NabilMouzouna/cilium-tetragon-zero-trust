import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Code, Search, UserCircle } from 'lucide-react';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <div className={styles.leftSection}>
            <Link to="/" className={styles.brandLink}>
              <Code className={styles.brandIcon} />
              <span className={styles.brandName}>
                NubleNews
              </span>
            </Link>
            <nav className={styles.navbarNav}>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/news"
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                }
              >
                News
              </NavLink>
            </nav>
          </div>

          <div className={styles.rightSection}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search..."
                className={styles.searchInput}
              />
              <Search className={styles.searchIcon} />
            </div>
            <button className={styles.userButton}>
              <UserCircle className={styles.userIcon} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

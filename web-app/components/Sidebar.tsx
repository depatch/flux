import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Sidebar.module.css';

const Sidebar: React.FC = () => {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>
                <div className={styles.logo}>
                    <Link href="/" className={styles.logo}>
                        <img src={'/svgs/flux_icon.svg'} alt={'Flux Network Logo'} width={32} height={32}/>
                    </Link>
                </div>
                <div className={styles.notification}>
                    <Image src="/svgs/bell.svg" alt="Notifications" width={20} height={20} />
                </div>
            </div>

            <button className={styles.createButton}>
                <Image src="/svgs/plus.svg" alt="Plus" width={16} height={16} />
                Create project
            </button>

            <nav className={styles.nav}>
                <Link href="/my-projects" className={`${styles.navItem} ${styles.active}`}>
                    <Image src="/svgs/projects.svg" alt="My Projects" width={20} height={20} />
                    <span>My Projects</span>
                </Link>
                <Link href="/my-contributions" className={styles.navItem}>
                    <Image src="/svgs/contributions.svg" alt="My Contributions" width={20} height={20} />
                    <span>My Contributions</span>
                </Link>
                <Link href="/merits" className={styles.navItem}>
                    <Image src="/svgs/merit.svg" alt="Merits" width={20} height={20} />
                    <span>My Merits</span>
                </Link>
                <Link href="/discover-projects" className={styles.navItem}>
                    <Image src="/svgs/discover.svg" alt="Discover projects" width={20} height={20} />
                    <span>Discover projects</span>
                </Link>
            </nav>
        </aside>
    );
};

export default Sidebar;


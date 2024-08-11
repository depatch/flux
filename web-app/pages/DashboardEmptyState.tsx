import React from 'react';
import Sidebar from '../components/Sidebar';
import styles from './DashboardEmptyState.module.css';
import Image from 'next/image';
import Link from "next/link";

interface DashboardEmptyStateProps {
    username: string;
    walletAddress: string;
    userType: string;
}

const DashboardEmptyState: React.FC<DashboardEmptyStateProps> = ({
                                                                     username,
                                                                     walletAddress,
                                                                     userType
                                                                 }) => {
    // Wallet address'in geçerli olduğundan emin olalım
    const displayWalletAddress = walletAddress
        ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
        : 'Not connected';

    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.main}>
                <header className={styles.header}>
                    <div className={styles.userInfo}>
                        <div className={styles.avatar}>
                            <Image src="/svgs/Avatar.svg" alt="Avatar" width={32} height={32}/>
                        </div>
                        <h2 className={styles.username}>aysipixie</h2>
                        <span className={styles.userType}>Entrepreneur</span>
                    </div>
                    <button
                        className={styles.walletButton}
                        onClick={() => console.log('Wallet button clicked')}
                    >
                        <span>{displayWalletAddress}</span>
                        <Image src="/svgs/arrow_below.svg" alt="Wallet" width={16} height={16}/>
                    </button>
                </header>
                <h1 className={styles.title}>My projects</h1>
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 5V19H5V5H19ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z" fill="currentColor"/>
                            <path d="M14 17H7V15H14V17ZM17 13H7V11H17V13ZM17 9H7V7H17V9Z" fill="currentColor"/>
                        </svg>
                    </div>
                    <h2 className={styles.emptyTitle}>Create your first project</h2>
                    <p className={styles.emptyDescription}>As an entrepreneur, create your first project so that developers can contribute to it.</p>
                    <Link href="/create-project">
                        <button className={styles.createButton}>
                            <Image src="/svgs/plus.svg" alt="Plus" width={16} height={16} />
                            Create project
                        </button>
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default DashboardEmptyState;
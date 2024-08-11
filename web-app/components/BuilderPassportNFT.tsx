import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './BuilderPassportNFT.module.css';

interface BuilderPassportNFTProps {
    passportId: string;
    worldIdProof: string;
    nftOwnerAddress: string;
    username: string;
}

const BuilderPassportNFT: React.FC<BuilderPassportNFTProps> = ({
                                                                   passportId,
                                                                   worldIdProof,
                                                                   nftOwnerAddress,
                                                                   username
                                                               }) => {
    return (
        <div className={styles.container}>
            <div className={styles.nftCard}>
                <div className={styles.cardHeader}>
                    <div>
                        <div className={styles.cardTitle}>Flux Club</div>
                        <div className={styles.cardSubtitle}>Builder Passport</div>
                    </div>
                    <Image src="/svgs/ticket.svg" alt="Ticket" width={24} height={24} />
                </div>
                <div className={styles.cardImage}>
                    <Image src="/svgs/flux_icon.svg" alt="Passport" width={130.53} height={180} />
                </div>
                <div className={styles.cardFooter}>
                    <div className={styles.githubInfo}>
                        <div className={styles.githubInfoHeader}>
                            <Image src="/svgs/github_logo.svg" alt="GitHub" width={20} height={20}/>
                            <div>Github account</div>
                        </div>
                        <span>{username}</span>
                    </div>
                    <div className={styles.cardInfo}>
                        <div>Builder Passport ID</div>
                        <div>{passportId}</div>
                    </div>
                    <div className={styles.cardInfo}>
                        <div>World ID proof</div>
                        <div>{worldIdProof}</div>
                    </div>
                    <div className={styles.cardInfo}>
                        <div>NFT owner address</div>
                        <div>{nftOwnerAddress}</div>
                    </div>
                </div>
            </div>
            <div className={styles.content}>
                <h1 className={styles.title}>Here is your Builder Passport to access the Flux Club</h1>
                <p className={styles.description}>
                    Welcome to Flux club, where developers and entrepreneurs produce, contribute and earn together.
                </p>
                <Link href="/DashboardEmptyState">
                    <button className={styles.button}>Let's dive in</button>
                </Link>
            </div>
        </div>
    );
};

export default BuilderPassportNFT;
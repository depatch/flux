import React from 'react';
import Layout from "../components/layout";
import BuilderPassportNFT from "../components/BuilderPassportNFT";
import { useAuth } from '../context/AuthContext';

const BuilderPassportNFTPage: React.FC = () => {
    const { worldIdNullifier, githubUsername, walletAddress } = useAuth();

    return (
        <Layout>
            <BuilderPassportNFT
                passportId={`BP${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`}
                worldIdProof={worldIdNullifier || 'Not verified'}
                nftOwnerAddress={walletAddress || 'Not connected'}
                username={githubUsername || 'Unknown User'}
            />
        </Layout>
    );
};

export default BuilderPassportNFTPage;
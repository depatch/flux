import React, { useState, useEffect } from 'react';
import styles from './SignUpCard.module.css';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import { ConnectButton } from "thirdweb/react";
import { createThirdwebClient, defineChain, getContract } from "thirdweb";
import { createWallet } from "thirdweb/wallets";
import { signIn, useSession } from "next-auth/react";
import { FaGlobe, FaGithub } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string,
});

const ourChain = defineChain({
  id: 34986,
  chainId: 34986,
  name: "Flux Network",
  rpc: "https://fluxerpc.d3patch.com/",
  nativeCurrency: {
    name: "Flux",
    symbol: "FLUX",
    decimals: 18
  },
});

const contract = getContract({ 
  client, 
  chain: ourChain,
  address: "0x9a556a2eCfeeA9d17a557Da4179cFa76f9111d22"
});

const SignUpCard: React.FC = () => {
  const router = useRouter();
  const { 
    walletStep, setWalletStep,
    worldIdStep, setWorldIdStep,
    githubStep, setGithubStep,
    worldIdNullifier, setWorldIdNullifier,
    setWorldIDInfo,
    githubUsername, setGithubUsername,
    walletAddress, setWalletAddress
  } = useAuth();
  const { data: session, status } = useSession();
  const [isMinting, setIsMinting] = useState(false);
  const { mutate: sendTransaction } = useSendTransaction();

  useEffect(() => {
    console.log('Session status:', status);
    console.log('Session data:', session);
    
    if (typeof window !== 'undefined') {
      const storedNullifier = localStorage.getItem('worldIdNullifier');
      if (storedNullifier) {
        setWorldIdNullifier(storedNullifier);
        setWorldIdStep({ isCompleted: true, isLoading: false });
      }
    }
    
    if (status === 'authenticated' && session?.user?.name) {
      console.log('Github login successful');
      setGithubUsername(session.user.name);
      setGithubStep({ isCompleted: true, isLoading: false });
    }
  }, [status, session, setWorldIdNullifier, setWorldIdStep, setGithubStep, setGithubUsername]);

  const handleWorldIdLogin = async () => {
    setWorldIdStep({ ...worldIdStep, isLoading: true });
  };

  const handleGithubLogin = async () => {
    console.log('Attempting Github login');
    setGithubStep({ ...githubStep, isLoading: true });
    try {
      const result = await signIn('github', { callbackUrl: '/SignUpPage', redirect: false });
      console.log('Github login result:', result);
      if (result?.error) {
        console.error('Github login error:', result.error);
        setGithubStep({ isCompleted: false, isLoading: false });
      }
    } catch (error) {
      console.error('Github login error:', error);
      setGithubStep({ isCompleted: false, isLoading: false });
    }
  };

  const onSuccess = async (proof: any) => {
    console.log('World ID verification successful');
    setWorldIdStep({ isCompleted: true, isLoading: false });
    const nullifier = proof.nullifier_hash;
    const truncatedNullifier = `${nullifier.slice(0, 6)}...${nullifier.slice(-4)}`;
    setWorldIdNullifier(truncatedNullifier);
    setWorldIDInfo({
      nullifier_hash: proof.nullifier_hash,
      merkle_root: proof.merkle_root,
      proof: proof.proof
    });
    
    localStorage.setItem('worldIdNullifier', truncatedNullifier);
  };
  
  const wallets = [createWallet("io.metamask")];

  const allStepsCompleted = walletStep.isCompleted && worldIdStep.isCompleted && githubStep.isCompleted;

  const handleMint = async () => {
    if (!allStepsCompleted) return;

    setIsMinting(true);
    try {
      const transaction = prepareContractCall({
        contract,
        method: "function mintTo(address _to, string _uri) returns (uint256 tokenIdMinted)",
        params: [walletAddress!, ""]
      });
      
      sendTransaction(transaction);
      
      console.log('Mint successful');
      await router.push('/BuilderPassportNFTPage');
    } catch (error) {
      console.error('Mint error:', error);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className={styles.signUpCard}>
      <h2 className={styles.title}>
        Complete the steps to get<br/>
        <span className={styles.titleHighlight}>Builder Passport</span>
      </h2>

      <div className={styles.progressContainer}>
        <span className={styles.progressText}>{[walletStep, worldIdStep, githubStep].filter(step => step.isCompleted).length} / 3</span>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{width: `${([walletStep, worldIdStep, githubStep].filter(step => step.isCompleted).length / 3) * 100}%`}}></div>
        </div>
      </div>

      <div className={styles.steps}>
        <ConnectButton
          client={client}
          wallets={wallets}
          chains={[ourChain]}
          theme={"dark"}
          connectModal={{ size: "compact" }}
          onConnect={(wallet) => {
            console.log('Wallet connected:', wallet);
            setWalletStep({ isCompleted: true, isLoading: false });
            setWalletAddress(wallet.getAccount()?.address!);
          }}
        />
        
        {!worldIdStep.isCompleted ? (
          <IDKitWidget
            app_id="app_93febf77ef85fd5a27845bce7eb7e27b"
            action="auth"
            verification_level={VerificationLevel.Device}
            onSuccess={onSuccess}
            autoClose={true}
            advanced={{self_hosted: false}}
            onError={(error) => {
              console.error('World ID verification error:', error);
            }}
            handleVerify={async (proof) => {
              console.log('World ID proof:', proof);
            }}
          >
            {({ open }) => (
              <button 
                onClick={() => {
                  handleWorldIdLogin();
                  open();
                }}
                disabled={!walletStep.isCompleted || worldIdStep.isCompleted || worldIdStep.isLoading}
                className={`${styles.stepButton} ${worldIdStep.isCompleted ? styles.completed : ''} ${worldIdStep.isLoading ? styles.loading : ''}`}
              >
                <span>Verify with World ID</span>
                <FaGlobe />
              </button>
            )}
          </IDKitWidget>
        ) : (
          <div className={`${styles.stepButton} ${styles.completed}`}>
            <span>World ID: {worldIdNullifier}</span>
            <Image src="/svgs/check.svg" alt="Completed" width={24} height={24} />
          </div>
        )}
        
        {!githubStep.isCompleted ? (
          <button 
            onClick={handleGithubLogin} 
            disabled={!worldIdStep.isCompleted || githubStep.isCompleted || githubStep.isLoading}
            className={`${styles.stepButton} ${githubStep.isCompleted ? styles.completed : ''} ${githubStep.isLoading ? styles.loading : ''}`}
          >
            <span>Connect GitHub account</span>
            <FaGithub />
          </button>
        ) : (
          <div className={`${styles.stepButton} ${styles.completed}`}>
            <span>GitHub: {githubUsername || 'Connected'}</span>
            <Image src="/svgs/check.svg" alt="Completed" width={24} height={24} />
          </div>
        )}
      </div>

      <button
        onClick={handleMint}
        disabled={!allStepsCompleted || isMinting}
        className={`${styles.mintButton} ${allStepsCompleted ? styles.active : styles.disabled}`}
      >
        {isMinting ? (
          <>
            <span>Minting...</span>
            <div className={styles.loadingIndicator}></div>
          </>
        ) : (
          'Mint Builder Password'
        )}
      </button>
    </div>
  );
};

export default SignUpCard;
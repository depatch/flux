import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface StepState {
  isCompleted: boolean;
  isLoading: boolean;
}

interface WorldIDInfo {
  nullifier_hash: string;
  merkle_root: string;
  proof: string;
}

interface AuthContextType {
  walletStep: StepState;
  setWalletStep: React.Dispatch<React.SetStateAction<StepState>>;
  worldIdStep: StepState;
  setWorldIdStep: React.Dispatch<React.SetStateAction<StepState>>;
  githubStep: StepState;
  setGithubStep: React.Dispatch<React.SetStateAction<StepState>>;
  mintStep: StepState;
  setMintStep: React.Dispatch<React.SetStateAction<StepState>>;
  worldIdNullifier: string | null;
  setWorldIdNullifier: React.Dispatch<React.SetStateAction<string | null>>;
  worldIDInfo: WorldIDInfo | null;
  setWorldIDInfo: React.Dispatch<React.SetStateAction<WorldIDInfo | null>>;
  githubUsername: string | null;
  setGithubUsername: React.Dispatch<React.SetStateAction<string | null>>;
  walletAddress: string | null;
  setWalletAddress: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [walletStep, setWalletStep] = useState<StepState>({ isCompleted: false, isLoading: false });
  const [worldIdStep, setWorldIdStep] = useState<StepState>({ isCompleted: false, isLoading: false });
  const [githubStep, setGithubStep] = useState<StepState>({ isCompleted: false, isLoading: false });
  const [mintStep, setMintStep] = useState<StepState>({ isCompleted: false, isLoading: false });
  const [worldIdNullifier, setWorldIdNullifier] = useState<string | null>(null);
  const [worldIDInfo, setWorldIDInfo] = useState<WorldIDInfo | null>(null);
  const [githubUsername, setGithubUsername] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.name) {
      setGithubUsername(session.user.name);
      setGithubStep({ isCompleted: true, isLoading: false });
    }
  }, [session]);

  return (
    <AuthContext.Provider value={{
      walletStep, setWalletStep,
      worldIdStep, setWorldIdStep,
      githubStep, setGithubStep,
      mintStep, setMintStep,
      worldIdNullifier, setWorldIdNullifier,
      worldIDInfo, setWorldIDInfo,
      githubUsername, setGithubUsername,
      walletAddress, setWalletAddress
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
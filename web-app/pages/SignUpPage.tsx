import React from 'react';
import SignUpCard from '../components/SignUpCard';
import Layout from "../components/layout";
import styles from './SignUpPage.module.css';

const SignUpPage: React.FC = () => {
  return (
    <Layout>
      <div className={styles.main}>
        <SignUpCard/>
      </div>
    </Layout>
  );
};

export default SignUpPage;
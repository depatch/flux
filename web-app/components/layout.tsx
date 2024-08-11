import Header from "./header"
import Footer from "./footer"
import styles from './layout.module.css';
import type { ReactNode } from "react"

import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin', 'latin-ext'] })

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={[styles.mainLayout, inter.className].join(' ')}>
      <Header />
      
      <main className={styles.main}>
        {children}
      </main>
      
      <Footer />
    </div>
  )
}

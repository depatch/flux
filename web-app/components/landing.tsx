// import next/link
import Link from 'next/link'
import styles from './landing.module.css'

export default function Landing() {
  return (
    <>
      <div className={styles.landingTop}>
        <h1 className={styles.bigHeader}>Make your contributons count</h1>
        <h2 className={styles.smallHeader}>have your attestations ready for upcoming airdrops <strong>Superchain</strong></h2>
        
        <Link href="/SignUpPage">
          <button className={styles.button}>
            Become a builder
          </button>
        </Link>
      </div>
      
      <div className={styles.landingBottom}></div>
    </>
  )
}

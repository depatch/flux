import styles from "./footer.module.css"
import packageJSON from "../package.json"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        Flux Network @ 2024
      </div>
      
      <div>
        {packageJSON.version}
      </div>
    </footer>
  )
}

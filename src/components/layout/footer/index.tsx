import styles from "./footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logo}>Contact US
        <a href="#">scriptio12@gmail.com</a>
        </div>
        <div className={styles.copyright}>
          &copy; {new Date().getFullYear()} MyWebsite. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

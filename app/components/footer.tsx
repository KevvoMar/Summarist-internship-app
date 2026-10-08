import styles from "./footer.module.css"

export default function Footer() {
    return(
        <section id={styles.footer}>
            <div className="container">
                <div className="row">
                    <div className={styles.footer__topWrapper}>
                        <div className={styles.footer__block}>
                            <div className={styles.footer__linkTitle}>Actions</div>
                            <div>
                            <div className={styles.footer__linkWrapper}>
                                <a className={styles.footer__link}>Summarist Magazine</a>
                            </div>
                            <div className={styles.footer__linkWrapper}>
                                <a className={styles.footer__link}>Cancel Subscription</a>
                            </div>
                            <div className={styles.footer__linkWrapper}>
                                <a className={styles.footer__link}>Help</a>
                            </div>
                            <div className={styles.footer__linkWrapper}>
                                <a className={styles.footer__link}>Contact us</a>
                            </div>
                            </div>
                        </div>
                        <div className={styles.footer__block}>
                            <div className={styles.footer__linkTitle}>Useful Links</div>
                            <div>
                            <div className={styles.footer__linkWrapper}>
                                <a className={styles.footer__link}>Pricing</a>
                            </div>
                            <div className={styles.footer__linkWrapper}>
                                <a className={styles.footer__link}>Summarist Business</a>
                            </div>
                            <div className={styles.footer__linkWrapper}>
                                <a className={styles.footer__link}>Gift Cards</a>
                            </div>
                            <div className={styles.footer__linkWrapper}>
                                <a className={styles.footer__link}>Authors & Publishers</a>
                            </div>
                            </div>
                        </div>
                        <div className={styles.footer__block}>
                            <div className={styles.footer__linkTitle}>Company</div>
                            <div>
                            <div className={styles.footer__linkWrapper}>
                                <a className={styles.footer__link}>About</a>
                            </div>
                            <div className={styles.footer__linkWrapper}>
                                <a className={styles.footer__link}>Careers</a>
                            </div>
                            <div className={styles.footer__linkWrapper}>
                                <a className={styles.footer__link}>Partners</a>
                            </div>
                            <div className={styles.footer__linkWrapper}>
                                <a className={styles.footer__link}>Code of Conduct</a>
                            </div>
                            </div>
                        </div>
                        <div className={styles.footer__block}>
                            <div className={styles.footer__linkTitle}>Other</div>
                            <div>
                            <div className={styles.footer__linkWrapper}>
                                <a className={styles.footer__link}>Sitemap</a>
                            </div>
                            <div className={styles.footer__linkWrapper}>
                                <a className={styles.footer__link}>Legal Notice</a>
                            </div>
                            <div className={styles.footer__linkWrapper}>
                                <a className={styles.footer__link}>Terms of Service</a>
                            </div>
                            <div className={styles.footer__linkWrapper}>
                                <a className={styles.footer__link}>Privacy Policies</a>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.footer__copyrightWrapper}>
                        <div className={styles.footer__copyright}>
                            Copyright &copy; 2023 Summarist.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
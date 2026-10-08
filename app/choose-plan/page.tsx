"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Footer from "../components/footer";
import { IoDocumentTextSharp } from "react-icons/io5";
import { RiPlantFill } from "react-icons/ri";
import { FaHandshake } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

export default function ChoosePlan() {
  const [selectedPlan, setSelectedPlan] = useState<"yearly" | "monthly" | null>(null);
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const isYearly = selectedPlan === "yearly";
  const isMonthly = selectedPlan === "monthly";

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <>
        <div className="skeleton" style={{ width: "100%", height: "260px" }}></div>
        <div className="container">
          <div className="row">
            <section style={{ width: "100%" }}>
              <div className="skeleton" style={{ width: "100%", height: "120px", marginBottom: "20px" }}></div>
              <div className="skeleton" style={{ width: "100%", height: "140px", marginBottom: "20px" }}></div>
              <div className="skeleton" style={{ width: "100%", height: "140px", marginBottom: "20px" }}></div>
              <div className="skeleton" style={{ width: "100%", height: "120px", marginBottom: "20px" }}></div>
              <div className="skeleton" style={{ width: "100%", height: "80px", marginBottom: "12px" }}></div>
              <div className="skeleton" style={{ width: "100%", height: "80px", marginBottom: "12px" }}></div>
              <div className="skeleton" style={{ width: "100%", height: "80px", marginBottom: "12px" }}></div>
              <div className="skeleton" style={{ width: "100%", height: "80px", marginBottom: "12px" }}></div>
            </section>
          </div>
        </div>
        <Footer />
      </>
    );
  }

    async function handleStart() {
    if (!selectedPlan) return;

    const MONTHLY_STRIPE_LINK = "https://buy.stripe.com/test_14A00cbI2fwJcPj41paAw02";
    const YEARLY_STRIPE_LINK = "https://buy.stripe.com/test_8x2eV68vQ5W95mR9lJaAw01";

    if (selectedPlan === "monthly") {
      window.location.href = MONTHLY_STRIPE_LINK;
    } else if (selectedPlan === "yearly") {
      window.location.href = YEARLY_STRIPE_LINK;
    }
  }


  return (
    <>
      <div className={styles.header__wrapper}>
        <div className={styles.header}>
          <h1 className={styles.header__title}>
            Get unlimited access to many amazing books to read
          </h1>
          <h2 className={styles.header__subtitle}>
            Turn ordinary moments into amazing learning opportunities
          </h2>
          <img className={styles.header__img} src="/assets/pricing-top.png" />
        </div>
      </div>
      <div className="container">
        <div className="row">
          <section className={styles.choose__plan}>
            <div className={styles.features__wrapper}>
              <div className={styles.feature}>
                <IoDocumentTextSharp className={styles.feature__icon} />
                <p className={styles.feature__details}>
                  <b>Key ideas in a few minutes</b> with many books to read
                </p>
              </div>
              <div className={styles.feature}>
                <RiPlantFill className={styles.feature__icon} />
                <p className={styles.feature__details}>
                  <b>3 million</b> people growing with Summarist everyday
                </p>
              </div>
              <div className={styles.feature}>
                <FaHandshake className={styles.feature__icon} />
                <p className={styles.feature__details}>
                  <b>Precise recommendations</b> collections curated by experts
                </p>
              </div>
            </div>
            <h1 className={styles.plans__heading}>Choose the plan that fits you</h1>
            <div
              className={`${styles.plan} ${styles.plan__yearly} ${isYearly ? styles.activeBorder : ""
                }`}
              onClick={() => setSelectedPlan("yearly")}
            >
              <div className={styles.circle__outline}>
                <div
                  className={`${styles.circle__inner} ${styles.circle__yearly} ${isYearly ? styles.activeCircle : ""
                    }`}
                ></div>
              </div>
              <div className={styles.plan__details}>
                <h2 className={styles.plan__title}>Premium Plus Yearly</h2>
                <p className={styles.plan__price}>$99.99/year</p>
                <p className={styles.plan__trial}>7-day free trial included</p>
              </div>
            </div>
            <div className={styles.seperator}>
              <div className={styles.or__stripe}></div>
              <p className={styles.or}>or</p>
              <div className={styles.or__stripe}></div>
            </div>
            <div
              className={`${styles.plan} ${styles.plan__monthly} ${isMonthly ? styles.activeBorder : ""
                }`}
              onClick={() => setSelectedPlan("monthly")}
            >
              <div className={styles.circle__outline}>
                <div
                  className={`${styles.circle__inner} ${styles.circle__monthly} ${isMonthly ? styles.activeCircle : ""
                    }`}
                ></div>
              </div>
              <div className={styles.plan__details}>
                <h2 className={styles.plan__title}>Premium Monthly</h2>
                <p className={styles.plan__price}>$9.99/month</p>
                <p className={styles.plan__trial}>No trial included</p>
              </div>
            </div>
            <div className={styles.plan__card}>
              <button
                className={`btn ${styles.start__btn}`}
                onClick={handleStart}
                disabled={!selectedPlan}
              >
                {isYearly && "Start your free 7-day trial"}
                {isMonthly && "Start your first month"}
                {!selectedPlan && "Choose a plan"}
              </button>
              <p className={styles.plan__cardText}>
                {isYearly &&
                  "Cancel your trial at any time before it ends, and you won't be charged."}
                {isMonthly &&
                  "30-day money back guarantee, no questions asked."}
                {!selectedPlan &&
                  "Select a plan above to see details."}
              </p>
            </div>
            <div className={styles.question}>
              <div
                className={styles.question__header}
                onClick={() => toggleQuestion(0)}
              >
                <h1 className={styles.question__title}>
                  How does the free 7-day trial work?
                </h1>
                <IoIosArrowDown
                  className={`${styles.question__icon} ${openQuestion === 0 ? styles.iconOpen : ""
                    }`}
                />
              </div>
              <div
                className={`${styles.question__answerWrapper} ${openQuestion === 0 ? styles.answerOpen : ""
                  }`}
              >
                <p className={styles.question__answer}>
                  Begin your complimentary 7-day trial with a Summarist annual membership.
                  You are under no obligation to continue your subscription, and you will only be billed when the trial period expires.
                  With Premium access, you can learn at your own pace and as frequently as you desire, and you may terminate your subscription prior to the conclusion of the 7-day free trial.
                </p>
              </div>
            </div>
            <div className={styles.question}>
              <div
                className={styles.question__header}
                onClick={() => toggleQuestion(1)}
              >
                <h1 className={styles.question__title}>
                  Can I switch subscriptions from monthly to yearly, or yearly to monthly?
                </h1>
                <IoIosArrowDown
                  className={`${styles.question__icon} ${openQuestion === 1 ? styles.iconOpen : ""
                    }`}
                />
              </div>
              <div
                className={`${styles.question__answerWrapper} ${openQuestion === 1 ? styles.answerOpen : ""
                  }`}
              >
                <p className={styles.question__answer}>
                  While an annual plan is active, it is not feasible to switch to a monthly plan.
                  However, once the current month ends, transitioning from a monthly plan to an annual plan is an option.
                </p>
              </div>
            </div>
            <div className={styles.question}>
              <div
                className={styles.question__header}
                onClick={() => toggleQuestion(2)}
              >
                <h1 className={styles.question__title}>
                  What's included in the Premium plan?
                </h1>
                <IoIosArrowDown
                  className={`${styles.question__icon} ${openQuestion === 2 ? styles.iconOpen : ""
                    }`}
                />
              </div>
              <div
                className={`${styles.question__answerWrapper} ${openQuestion === 2 ? styles.answerOpen : ""
                  }`}
              >
                <p className={styles.question__answer}>
                  Premium membership provides you with the ultimate Summarist experience,
                  including unrestricted entry to many best-selling books high-quality audio, the ability to download titles for offline reading, and the option to send your reads to your Kindle.
                </p>
              </div>
            </div>
            <div className={styles.question}>
              <div
                className={styles.question__header}
                onClick={() => toggleQuestion(3)}
              >
                <h1 className={styles.question__title}>
                  Can I cancel during my trial or subscription?
                </h1>
                <IoIosArrowDown
                  className={`${styles.question__icon} ${openQuestion === 3 ? styles.iconOpen : ""
                    }`}
                />
              </div>
              <div
                className={`${styles.question__answerWrapper} ${openQuestion === 3 ? styles.answerOpen : ""
                  }`}
              >
                <p className={styles.question__answer}>
                  You will not be charged if you cancel your trial before its conclusion.
                  While you will not have complete access to the entire Summarist library, you can still expand your knowledge with one curated book per day.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
"use client";

import { useState } from "react";
import Login from "./components/login";
import styles from "./page.module.css";
import { AiFillFileText, AiFillBulb, AiFillAudio } from "react-icons/ai";
import { BsStarFill, BsStarHalf } from "react-icons/bs";
import { BiCrown } from "react-icons/bi";
import { RiLeafLine } from "react-icons/ri";
import StatisticsHeadings from "./components/statisticsHeadings";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [loginOrigin, setLoginOrigin] = useState<string | null>(null);

  const statsSet1 = [
    "Enhance your knowledge",
    "Achieve greater success",
    "Improve your health",
    "Develop better parenting skills",
    "Increase happiness",
    "Be the best version of yourself!"
  ];

  const statsSet2 = [
    "Expand your learning",
    "Accomplish your goals",
    "Strengthen your vitality",
    "Become a better caregiver",
    "Improve your mood",
    "Maximize your abilities"
  ];

  return (
    <>
      <Navbar onLoginClick={() => {
        setLoginOrigin("/");
        setShowLogin(true);
      }} />
      <section id={styles.landing}>
        <div className="container">
          <div className="row">
            <div className={styles.landing__wrapper}>
              <div className={styles.landing__content}>
                <div className={styles.landing__content__title}>
                  Gain more knowledge <br className={styles.removeTablet}/>
                  in less time
                </div>
                <div className={styles.landing__content__subtitle}>
                  Great summaries for busy people,
                  <br className={styles.removeTablet} />
                  individuals who barely have time to read,
                  <br className={styles.removeTablet} />
                  and even people who don’t like to read.
                </div>
                <button 
                  className={`btn ${styles.home__ctaBtn}`}
                  onClick={() => {
                    setLoginOrigin("/");
                    setShowLogin(true);
                  }}
                >
                  Login
                </button>
                {showLogin && (
                  <Login 
                    onClose={() => setShowLogin(false)}
                    origin={loginOrigin}
                  />
                )}
              </div>
              <figure className={styles.landing__imageMask}>
                <img src="/assets/landing.png" alt="landing" />
              </figure>
            </div>
          </div>
        </div>
      </section>
      <section id={styles.features}>
        <div className="container">
          <div className="row">
            <div className={styles.section__title}>Understand books in few minutes</div>
            <div className={styles.features__wrapper}>
              <div className={styles.features}>
                <div className={styles.features__icon}>
                  <AiFillFileText />
                </div>
                <div className={styles.features__title}>Read or listen</div>
                <div className={styles.features__subtitle}>
                  Save time by getting the core ideas from the best books.
                </div>
              </div>
              <div className={styles.features}>
                <div className={styles.features__icon}>
                  <AiFillBulb />
                </div>
                <div className={styles.features__title}>Find your next read</div>
                <div className={styles.features__subtitle}>
                  Explore book lists and personalized recommendations.
                </div>
              </div>
              <div className={styles.features}>
                <div className={styles.features__icon}>
                  <AiFillAudio />
                </div>
                <div className={styles.features__title}>Briefcasts</div>
                <div className={styles.features__subtitle}>
                  Gain valuable insights from briefcasts
                </div>
              </div>
            </div>
            <div className={styles.statistics__wrapper}>
              <div className={styles.statistics__contentHeader}>
                <StatisticsHeadings items={statsSet1} />
              </div>
              <div className={styles.statistics__contentDetails}>
                <div className={styles.statistics__data}>
                  <div className={styles.statistics__dataNumber}>93%</div>
                  <div className={styles.statistics__dataTitle}>
                    of Summarist members <b>significantly increase</b> reading
                    frequency.
                  </div>
                </div>
                <div className={styles.statistics__data}>
                  <div className={styles.statistics__dataNumber}>96%</div>
                  <div className={styles.statistics__dataTitle}>
                    of Summarist members <b>establish better</b> habits.
                  </div>
                </div>
                <div className={styles.statistics__data}>
                  <div className={styles.statistics__dataNumber}>90%</div>
                  <div className={styles.statistics__dataTitle}>
                    have made <b>significant positive</b> change to their lives.
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.statistics__wrapper}>
              <div
                className={`${styles["statistics__contentDetails"]} ${styles["statistics__contentDetails__second"]}`}
              >
                <div className={styles.statistics__data}>
                  <div className={styles.statistics__dataNumber}>91%</div>
                  <div className={styles.statistics__dataTitle}>
                    of Summarist members <b>report feeling more productive</b> 
                    after incorporating the service into their daily routine.
                  </div>
                </div>
                <div className={styles.statistics__data}>
                  <div className={styles.statistics__dataNumber}>94%</div>
                  <div className={styles.statistics__dataTitle}>
                    of Summarist members have <b>noticed an improvement</b> in
                    their overall comprehension and retention of information.
                  </div>
                </div>
                <div className={styles.statistics__data}>
                  <div className={styles.statistics__dataNumber}>88%</div>
                  <div className={styles.statistics__dataTitle}>
                    of Summarist members <b>feel more informed</b> about current
                    events and industry trends since using the platform.
                  </div>
                </div>
              </div>
              <div className={`${styles["statistics__contentHeader"]} ${styles["statistics__contentHeader__second"]}`}>
                <StatisticsHeadings items={statsSet2} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id={styles.reviews}>
        <div className="row">
          <div className="container">
            <div className={styles.section__title}>What our members say</div>
            <div className={styles.reviews__wrapper}>
              <div className={styles.review}>
                <div className={styles.review__header}>
                  <div className={styles.review__name}>Hanna M.</div>
                  <div className={styles.review__stars}>
                    <BsStarFill /><BsStarFill /><BsStarFill /><BsStarFill /><BsStarFill />
                  </div>
                </div>
                <div className={styles.review__body}>
                  This app has been a <b>game-changer</b> for me! It's saved me so
                  much time and effort in reading and comprehending books. Highly
                  recommend it to all book lovers.
                </div>
              </div>
              <div className={styles.review}>
                <div className={styles.review__header}>
                  <div className={styles.review__name}>David B.</div>
                  <div className={styles.review__stars}>
                    <BsStarFill /><BsStarFill /><BsStarFill /><BsStarFill /><BsStarFill />
                  </div>
                </div>
                <div className={styles.review__body}>
                  I love this app! It provides
                  <b>concise and accurate summaries</b> of books in a way that is
                  easy to understand. It's also very user-friendly and intuitive.
                </div>
              </div>
              <div className={styles.review}>
                <div className={styles.review__header}>
                  <div className={styles.review__name}>Nathan S.</div>
                  <div className={styles.review__stars}>
                    <BsStarFill /><BsStarFill /><BsStarFill /><BsStarFill /><BsStarFill />
                  </div>
                </div>
                <div className={styles.review__body}>
                  This app is a great way to get the main takeaways from a book
                  without having to read the entire thing.
                  <b>The summaries are well-written and informative.</b>
                  Definitely worth downloading.
                </div>
              </div>
              <div className={styles.review}>
                <div className={styles.review__header}>
                  <div className={styles.review__name}>Ryan R.</div>
                  <div className={styles.review__stars}>
                    <BsStarFill /><BsStarFill /><BsStarFill /><BsStarFill /><BsStarFill />
                  </div>
                </div>
                <div className={styles.review__body}>
                  If you're a busy person who
                  <b>loves reading but doesn't have the time</b> to read every
                  book in full, this app is for you! The summaries are thorough
                  and provide a great overview of the book's content.
                </div>
              </div>
            </div>
            <div className={styles.reviews__btnWrapper}>
              <button 
                className={`btn ${styles.home__ctaBtn}`}
                onClick={() => {
                  setLoginOrigin("/");
                  setShowLogin(true);
                }}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </section>
      <section id={styles.numbers}>
        <div className="container">
          <div className="row">
            <div className={styles.section__title}>Start growing with Summarist now</div>
            <div className={styles.numbers__wrapper}>
              <div className={styles.numbers}>
                <div className={styles.numbers__icon}>
                  <BiCrown />
                </div>
                <div className={styles.numbers__title}>3 Million</div>
                <div className={styles.numbers__subTitle}>Downloads on all platforms</div>
              </div>
              <div className={styles.numbers}>
                <div className={`${styles["numbers__icon"]} ${styles["numbers__starIcon"]}`}>
                  <BsStarFill />
                  <BsStarHalf />
                </div>
                <div className={styles.numbers__title}>4.5 Stars</div>
                <div className={styles.numbers__subTitle}>
                  Average ratings on iOS and Google Play
                </div>
              </div>
              <div className={styles.numbers}>
                <div className={styles.numbers__icon}>
                  <RiLeafLine />
                </div>
                <div className={styles.numbers__title}>97%</div>
                <div className={styles.numbers__subTitle}>
                  Of Summarist members create a better reading habit
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
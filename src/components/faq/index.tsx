import React from "react";
import Accordion from "../Accordion";
import Fagimg from 'assets/icons/faq.png'

const questionsAnswers = [
  {
    question: "What’s the difference between a Public Sale and Private Sale?",
    answer:
      "In the current IDO format. There is a brand new Private Sale. To participate, participants will have to meet certain requirements presented on the IDO card. Each eligible participant will be able to commit any amount of ETH up to the maximum commit limit, which is published along with the IDO voting proposal. The Private Sale has no participation fee.In the Public Sale, everyone with an active AncoraFinance profile can commit. However the maximum amount of ETH users can commit, is equal to the number of iETH they have.Learn more about iETH here And there’s a fee for participation: see below.",
  },
  {
    question: "Which sale should I commit to? Can I do both?",
    answer:
      "You can choose one or both at the same time! We recommend you to check if you are eligible to participate in the Private Sale first. In the Public Sale, if the amount you commit is too small, you may not receive a meaningful amount of IDO tokens.Just remember you need an active AncoraFinance Profile in order to participate.",
  },
  {
    question: "How much is the participation fee?",
    answer: `There’s only a participation fee for the Private Sale: there’s no fee for the Private Sale.

    The participation fee decreases in cliffs, based on the percentage of overflow from the Private Sale” portion of the IDO. Note: Fees may vary between different IDOs. To learn more about the participation fees, please refer to the details in the IDO proposal (vote) for the specifics of the IDO you want to take part in.`,
  },
  {
    question: "Where does the participation fee go?",
    answer: `The ETH from the participation fee will be burnt as part of the weekly token burn.`,
  },
  {
    question: "How can I get an achievement for participating in the IDO?",
    answer: `You need to contribute a minimum of about 0.1 ETH to either sale. You can contribute to one or both, it doesn’t matter: only your overall contribution is counted for the achievement.`,
  },
  {
    question: "What is the difference between an IDO and a cIDO? ",
    answer: `cIDOs are a new subtype of IDOs, designed to reward our loyal community, and also introduce our community to projects with slightly smaller raises. Learn more about cIDO`,
  },
];

const Faq = () => {
  return (
    <div className="faq-area pb-100">
      <div className="container">
        <div className="section-title">
          <span className="sub-title dark-green-color">
            Frequently Ask & Question
          </span>
          <h2 className="nunito-font">
            Dedicated to help anything people’s needs
          </h2>
        </div>
        <div className="row align-items-center">
        <div className="col-lg-6 col-md-12">
            <div className="faq-image style-three" data-aos="fade-up">
              <img  src={Fagimg} alt="images" />

            </div>
          </div>
          <div className="col-lg-6 col-md-12">
            <div className="faq-accordion">
              <div className="accordion" id="faqAccordion">
                <Accordion questionsAnswers={questionsAnswers} />
              </div>
            </div>
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default Faq;
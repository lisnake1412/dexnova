import React from "react";
import Accordion from "../Accordion";
import Fagimg from 'assets/icons/faq.png'

const questionsAnswers = [
  {
    question: "What’s the difference between a Public Sale and Private Sale?",
    answer:
      "In the current IFO format. There is a brand new Private Sale. To participate, participants will have to meet certain requirements presented on the IFO card. Each eligible participant will be able to commit any amount of CAKE up to the maximum commit limit, which is published along with the IFO voting proposal. The Private Sale has no participation fee.In the Public Sale, everyone with an active PancakeSwap profile can commit. However the maximum amount of CAKE users can commit, is equal to the number of iCAKE they have.Learn more about iCAKE here And there’s a fee for participation: see below.",
  },
  {
    question: "Which sale should I commit to? Can I do both?",
    answer:
      "You can choose one or both at the same time! We recommend you to check if you are eligible to participate in the Private Sale first. In the Public Sale, if the amount you commit is too small, you may not receive a meaningful amount of IFO tokens.Just remember you need an active PancakeSwap Profile in order to participate.",
  },
  {
    question: "How much is the participation fee?",
    answer: `There’s only a participation fee for the Public Sale: there’s no fee for the Private Sale.

    The participation fee decreases in cliffs, based on the percentage of overflow from the “Public Sale” portion of the IFO. Note: Fees may vary between different IFOs. To learn more about the participation fees, please refer to the details in the IFO proposal (vote) for the specifics of the IFO you want to take part in.`,
  },
  {
    question: "Where does the participation fee go?",
    answer: `The CAKE from the participation fee will be burnt as part of the weekly token burn.`,
  },
  {
    question: "How can I get an achievement for participating in the IFO?",
    answer: `You need to contribute a minimum of about 10 USD worth of CAKE to either sale. You can contribute to one or both, it doesn’t matter: only your overall contribution is counted for the achievement.`,
  },
  {
    question: "What is the difference between an IFO and a cIFO? ",
    answer: `cIFOs are a new subtype of IFOs, designed to reward our loyal community, and also introduce our community to projects with slightly smaller raises. Learn more about cIFO`,
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
import "../styles/components/quick-start.scss";
import NodeImage1 from "../assets/NodeImage1.svg";
import NodeImage2 from "../assets/NodeImage2.svg";
import NodeImage3 from "../assets/NodeImage3.svg";


const QuickStart = () => {
  const steps = [
    {
      id: 1,
      title: "Setup Node",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      icon: <img src={NodeImage1} alt="" />,
    },
    {
      id: 2,
      title: "Integrate Wallet",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      icon: <img src={NodeImage2} alt="" />,
    },
    {
      id: 3,
      title: "Stake & Go Live",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      icon: <img src={NodeImage3} alt="" />,
    },
  ];

  return (
    <section className="quick-start">
      <div className="quick-start__container">
        <div className="quick-start__header">
          <h2 className="common-heading">Quick Start Guide</h2>
        </div>
        <div className="stepsWrapper">
          {steps.map((step, index) => (
            <div key={step.id} className={`card ${[`card${index + 1}`]}`}>
              <div className="iconWrapper">{step.icon}</div>
              <div className="textWrapper">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickStart;

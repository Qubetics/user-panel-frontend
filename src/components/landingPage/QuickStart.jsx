import "../../styles/components/landingPage/quick-start.scss";
import NodeImage1 from "../../assets/NodeImage1.svg";
import NodeImage2 from "../../assets/NodeImage2.svg";
import NodeImage3 from "../../assets/NodeImage3.svg";

const QuickStart = () => {
  const steps = [
    {
      id: 1,
      title: "Setup Node",
      description:
        "Download the shell file, add your node info (IP, wallet, region), and follow the setup guide to get started.",
      icon: <img src={NodeImage1} alt="" />,
    },
    {
      id: 2,
      title: " Deploy & Validate",
      description:
        "Run the deployment script on your local machine or cloud server. We automatically check connectivity, bandwidth, and wallet address.",
      icon: <img src={NodeImage2} alt="" />,
    },
    {
      id: 3,
      title: "Stake & Go Live",
      description:
        "Once your node goes live on the dVPN app, users can connect and you can start earning as a node operator",
      icon: <img src={NodeImage3} alt="" />,
    },
  ];

  return (
    <>
      <section className="quick-start">
        <div className="quick-start__container">
          <div className="quick-start__header">
            <h2 className="">Set Up Your Node in 3 Easy Steps</h2>
          </div>
          <div className="stepsWrapper">
            {steps.map((step, index) => (
              <div key={step.id} className={`card ${[`card${index + 1}`]}`}>
                <div className="iconWrapper">{step.icon}</div>
                <div className="textWrapper">
                  <h4>{step.title}</h4>
                  <h6>{step.description}</h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default QuickStart;

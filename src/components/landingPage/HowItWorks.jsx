import {
  DownloadIcon,
  GlobeIcon,
  Share2Icon,
} from "../../assets/StoreAsset/StoreAsset";
import "../../styles/components/landingPage/how-it-works.scss";
import downloanIcon from '../../assets/downloanIcon.svg';
import connectIcon from '../../assets/connectIcon.svg';
import browseIcon from '../../assets/browseIcon.svg';

const HowItWorks = () => {
  const steps = [
    {
      icon: downloanIcon,
      title: "Download the Wallet App",
      description: "Get the Qubetics Wallet App and install it in seconds",
    },
    {
      icon: connectIcon,
      title: "Connect to a Node",
      description:
        "Launch the app, choose a secure node from the global network, and connect",
    },
    {
      icon: browseIcon,
      title: " Browse Anonymously",
      description:
        "You’re now protected — surf the web with privacy, freedom, and no restrictions",
    },
  ];

  return (
    <section className="how-it-works">
      <div className="how-it-works__container">
        <div className="how-it-works__header">
          <h2>How dVPN Works</h2>
        </div>

        <div className="process-flow">
          {/* SVG dashed path */}
          <div className="process-flow-borderback">
            <svg width="963" height="98" viewBox="0 0 963 98" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.12793 43.9221C54.6564 88.3922 148.249 136.902 468.327 44.7084C576.476 -0.84573 773.111 -26.8769 962.1 51.216" stroke="#A0A0A0" stroke-dasharray="6 6" />
            </svg>
          </div>

          <div className="process-flow__steps">
            {steps.map((step, idx) => (
              <div className="step" key={idx}>
                <div className="step__icon">
                  {/* <div>{step.icon}</div> */}
                  <img src={step.icon} alt='work-icon' />
                </div>
                <h4 className="step__title">{step.title}</h4>
                <h6 className="step__desc">{step.description}</h6>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

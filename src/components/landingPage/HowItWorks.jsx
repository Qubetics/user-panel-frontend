import {
  DownloadIcon,
  GlobeIcon,
  Share2Icon,
} from "../../assets/StoreAsset/StoreAsset";
import "../../styles/components/landingPage/how-it-works.scss";

const HowItWorks = () => {
  const steps = [
    {
      icon: <DownloadIcon className="w-6 h-6 text-white" />,
      title: "Download the dVPN App",
      description: "Get the Qubetics dVPN App and install it in seconds.",
    },
    {
      icon: <Share2Icon className="w-6 h-6 text-white" />,
      title: "Connect to a Node",
      description:
        "Launch the app, choose a secure node from the global network, and connect.",
    },
    {
      icon: <GlobeIcon className="w-6 h-6 text-white" />,
      title: " Browse Anonymously",
      description:
        "You’re now protected — surf the web with privacy, freedom, and no restrictions.",
    },
  ];

  return (
    <section className="how-it-works">
      <div className="how-it-works__container">
        <div className="how-it-works__header">
          <h2 className="common-heading">How dVPN Works</h2>
        </div>

        <div className="process-flow">
          {/* SVG dashed path */}
          <svg
            className="process-flow__curve"
            viewBox="0 0 800 100"
            preserveAspectRatio="none"
          >
            <path
              d="M 50 50 Q 200 0, 400 50 Q 600 100, 750 50"
              stroke="#555"
              strokeWidth="2"
              strokeDasharray="6 6"
              fill="none"
            />
          </svg>

          <div className="process-flow__steps">
            {steps.map((step, idx) => (
              <div className="step" key={idx}>
                <div className="step__icon">
                  <div>{step.icon}</div>
                </div>
                <h3 className="step__title">{step.title}</h3>
                <p className="step__desc">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

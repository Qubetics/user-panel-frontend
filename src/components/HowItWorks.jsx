import { GiftIcon, RocketIcon, Share2Icon } from "../assets/StoreAsset/StoreAsset";
import "../styles/components/how-it-works.scss";

const HowItWorks = () => {
  const steps = [
    {
      icon: <RocketIcon className="w-6 h-6 text-white" />,
      title: "Session Initiation",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
      icon: <Share2Icon className="w-6 h-6 text-white" />,
      title: "Bandwidth Sharing",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
      icon: <GiftIcon className="w-6 h-6 text-white" />,
      title: "Rewards",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
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

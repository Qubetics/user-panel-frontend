import "../../styles/components/ButtonCustom.scss";

function ButtonCustom(props) {
  const {
    label,
    onClick,
    type,
    className,
    regularBtn,
    grayBtn,
    redBtn,
    disabled,
    tabIndex,
    children,
    id,
    icon,
    title,
  } = props;
  return (
    <button
      className={`customButton ${className ? className : ""} ${
        regularBtn ? "customButton-regular" : ""
      } ${grayBtn ? "customButton-gray" : ""} ${
        redBtn ? "customButton-red" : ""
      }`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      tabIndex={tabIndex}
      id={id}
      title={disabled ? title : ""}
    >
      {children} {label}
      {icon && <span>{icon}</span>}
    </button>
  );
}

export default ButtonCustom;

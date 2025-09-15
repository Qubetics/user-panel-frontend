import React from "react";
import { CheckOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useState } from "react";
import { Copyicon } from "../../assets/SvgIcon/SvgIcon";

export default function CopyText({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <>
      <Tooltip
        title={copied ? " Copied" : "Copy"}
        className="copyIconToolTip"
      >
        <div
        onClick={handleCopyClick}
        style={{cursor: "pointer"}}
        >
        {copied ? <CheckOutlined /> : <Copyicon />}
        </div>
      </Tooltip>
    </>
  );
}

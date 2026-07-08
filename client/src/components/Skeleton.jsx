import React from "react";

const baseSkeletonStyle = {
  borderRadius: "6px",
  position: "relative",
  overflow: "hidden",
};

function SkeletonBase({ style, className, children, ...rest }) {
  return (
    <div
      className={`skeleton${className ? " " + className : ""}`}
      style={{ ...baseSkeletonStyle, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}

export function SkeletonBox({ style, className, w = "100%", h = "16px" }) {
  return (
    <SkeletonBase
      className={className}
      style={{ ...style, width: w, height: h, display: "block" }}
    />
  );
}

export function SkeletonText({ style, className, lines = 3, lineHeight = "14px", gap = "8px" }) {
  return (
    <div className={`skeleton-text${className ? " " + className : ""}`} style={{ display: "flex", flexDirection: "column", gap, ...style }}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBase
          key={i}
          style={{
            height: lineHeight,
            width: i === lines - 1 ? "60%" : "100%",
            borderRadius: "4px",
          }}
        />
      ))}
    </div>
  );
}

export function SkeletonCircle({ style, className, size = "40px" }) {
  return (
    <SkeletonBase
      className={className}
      style={{ ...style, width: size, height: size, borderRadius: "50%", flexShrink: 0 }}
    />
  );
}

export function SkeletonTable({ style, className, rows = 4, cols = 4 }) {
  return (
    <div className={`skeleton-table${className ? " " + className : ""}`} style={{ display: "flex", flexDirection: "column", gap: "8px", ...style }}>
      {Array.from({ length: rows }).map((_, ri) => (
        <div key={ri} style={{ display: "flex", gap: "12px" }}>
          {Array.from({ length: cols }).map((_, ci) => (
            <SkeletonBase
              key={ci}
              style={{
                flex: 1,
                height: "14px",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

const Skeleton = ({ type = "box", style, className, ...props }) => {
  const common = { style, className };
  switch (type) {
    case "text":
      return <SkeletonText {...common} {...props} />;
    case "circle":
      return <SkeletonCircle {...common} {...props} />;
    case "table":
      return <SkeletonTable {...common} {...props} />;
    case "box":
    default:
      return <SkeletonBox {...common} {...props} />;
  }
};

Skeleton.Box = SkeletonBox;
Skeleton.Text = SkeletonText;
Skeleton.Circle = SkeletonCircle;
Skeleton.Table = SkeletonTable;

export default Skeleton;

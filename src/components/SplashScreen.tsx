import { useEffect, useState } from "react";
import logo from "/logo.png";

interface Props {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: Props) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");

  useEffect(() => {
    // fade + grow in: 1400ms
    const holdTimer = setTimeout(() => setPhase("hold"), 1400);
    // hold: 1200ms
    const outTimer = setTimeout(() => setPhase("out"), 2600);
    // fade out: 900ms, then notify parent
    const doneTimer = setTimeout(onDone, 3500);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(outTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  const styles: Record<string, React.CSSProperties> = {
    overlay: {
      position: "fixed",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#ffffff",
      zIndex: 9999,
      transition: "opacity 900ms ease",
      opacity: phase === "out" ? 0 : 1,
    },
    logo: {
      width: 180,
      height: 180,
      objectFit: "contain",
      transition:
        "opacity 1400ms ease, transform 1400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
      opacity: phase === "in" ? 0 : 1,
      transform: phase === "in" ? "scale(0.6)" : "scale(1)",
    },
  };

  return (
    <div style={styles.overlay}>
      <img src={logo} alt="DC Stock" style={styles.logo} />
    </div>
  );
}

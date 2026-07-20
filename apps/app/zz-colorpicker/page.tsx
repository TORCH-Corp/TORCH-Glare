"use client";

import { useEffect, useRef, useState } from "react";
import { ColorPicker } from "@/components/ColorPicker";

export default function ZzColorPickerHarness() {
  const [color, setColor] = useState("#3B82F680");
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const t = setTimeout(() => ref.current?.click(), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ padding: 40, minHeight: "100vh", background: "#1b1b1f" }}>
      <div style={{ width: 320 }}>
        <ColorPicker
          ref={ref}
          value={color}
          onChange={setColor}
          presets={["#3B82F6", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B", "#EF4444"]}
        />
      </div>
      <p style={{ color: "#fff", marginTop: 12, fontFamily: "monospace" }}>value: {color}</p>
    </div>
  );
}

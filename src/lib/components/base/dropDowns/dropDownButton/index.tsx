import React, { HTMLAttributes, ReactNode, useRef } from "react";
import "./style.scss";

interface Props extends HTMLAttributes<HTMLDivElement> {
  component_size?: "S" | "M" | "L"; // this props will change the button style size see on figma design file
  component_label: string;
  drop_down_list_child: ReactNode; // this will show drop down list if you pass it
}

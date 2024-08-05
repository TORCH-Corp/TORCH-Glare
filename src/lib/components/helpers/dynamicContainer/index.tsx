import React, { CSSProperties, ReactNode, useRef } from 'react';
import './style.scss';
import useDirectionCalc from '@hooks/useDirectionCalc';

interface Props {
  children: ReactNode;
  active: boolean; // if the component is active will be visible
  onClick?: () => void;
  style?: CSSProperties; // Fixed type
}


// this component is used with and dropdown menu to change the direction when hit the viewport
export const DynamicContainer: React.FC<Props> = ({ children, style, active, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);

  // useDirectionCalc hook used to change the direction of the child based on the viewport
  const dir = useDirectionCalc({
    ElementRef: ref,
    dirClasses: {
      left: '',
      right: '',
      top: 'Dynamic-Container-top',
      bottom: '',
    },
  });

  return (
    <section
      onClick={onClick}
      ref={ref}
      className={`Dynamic-Container ${dir}`}
      style={{ display: active ? 'flex' : 'none', ...style }}
    >
      {children}
    </section>
  );
};

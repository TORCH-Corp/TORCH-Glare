import React, { ReactNode, useRef } from 'react';
import './style.scss';
import useDirectionCalc from '../../../hooks/useDirectionCalc';

interface Props {
  children: ReactNode;
  active: boolean;
  onClick?: () => void;
}

export const DynamicContainer: React.FC<Props> = ({ children, active, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);

  const dir = useDirectionCalc({
    ElementRef: ref,
    dirClasses: {
      left: '',
      right: '',
      top: 'Dynamic-Container-top',
      bottom: '',
    },
    isElementActive: active,
    trigger: children,
  });

  return (
    <section
      onClick={onClick}
      ref={ref}
      className={`Dynamic-Container ${dir}`}
      style={{ display: active ? 'flex' : 'none' }}
    >
      {children}
    </section>
  );
};

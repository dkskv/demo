import { CSSProperties, useCallback } from "react";

interface IProps {
  value: number;
  onChange(v: number): void;
  min?: number;
  max?: number;
  style?: CSSProperties;
}

export const InputNumber: React.FC<IProps> = ({
  value,
  onChange,
  min,
  max,
  style,
}) => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Number(event.target.value));
    },
    [onChange]
  );

  return (
    <input
      type="number"
      value={value}
      onChange={handleChange}
      min={min}
      max={max}
      style={style}
    />
  );
};

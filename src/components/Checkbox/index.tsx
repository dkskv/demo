interface IProps {
  label: string;
  value: boolean;
  onChange(value: boolean): void;
}

export const Checkbox: React.FC<IProps> = ({ label, value, onChange }) => {
  return (
    <span>
      <input
        checked={value}
        type="checkbox"
        onChange={({ target: { checked } }) => {
          onChange(checked);
        }}
      />
      {label}
    </span>
  );
};

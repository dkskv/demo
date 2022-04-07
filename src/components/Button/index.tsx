interface IProps {
  onClick(): void;
  disabled?: boolean;
}

const Button: React.FC<IProps> = ({ children, disabled = false, onClick }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;

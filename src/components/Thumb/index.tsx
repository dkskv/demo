import { useTheme } from "../../decorators/theme";

interface IProps {
  size?: number;
}

export const Thumb: React.FC<IProps> = ({ size = 10 }) => {
  const theme = useTheme();

  return (
    <div
      style={{
        width: size,
        height: size,
        border: `1px solid ${theme.strokeColor}`,
        borderRadius: theme.smallBorderRadius,
        background: theme.handleColor,
      }}
    />
  );
};

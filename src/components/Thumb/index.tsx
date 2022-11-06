import { useTheme } from "../../decorators/theme";

export const Thumb: React.FC<{}> = () => {
  const theme = useTheme();

  return (
    <div
      style={{
        width: "10px",
        height: "10px",
        border: `1px solid ${theme.strokeColor}`,
        borderRadius: theme.smallBorderRadius,
        background: theme.handleColor,
      }}
    />
  );
};

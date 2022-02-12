import { useCallback, useState } from "react";

interface IStatelessProps<T, U> {
  value: T;
  onChange(value: T, options?: U): void;
}

interface IStatefulProps<T, U> {
  initialValue: T;
  onChange?: IStatelessProps<T, U>["onChange"];
}

export default function makeStateful<P extends IStatelessProps<T, U>, T, U>(
  Component: React.ComponentType<P>
) {
  return function ({
    initialValue,
    onChange,
    ...restProps
  }: Omit<P, keyof IStatelessProps<T, U>> & IStatefulProps<T, U>) {
    const [value, setValue] = useState(initialValue);

    const handleChange = useCallback(
      (value: T, options: U) => {
        setValue(value);
        onChange?.(value, options);
      },
      [onChange]
    );

    const newProps = {
      ...restProps,
      value,
      onChange: handleChange,
    } as unknown as P;

    return <Component {...newProps} />;
  };
}

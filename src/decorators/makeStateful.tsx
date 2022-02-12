import { useCallback, useState } from "react";

interface IStatelessProps<T> {
  value: T;
  onChange(value: T): void;
}

interface IStatefulProps<T> {
  initialValue: T;
  onChange?: IStatelessProps<T>["onChange"];
}

export default function makeStateful<P extends IStatelessProps<V>, V>(
  Component: React.ComponentType<P>
) {
  return function ({
    initialValue,
    onChange,
    ...restProps
  }: Omit<P, keyof IStatelessProps<V>> & IStatefulProps<V>) {
    const [value, setValue] = useState(initialValue);

    const handleChange = useCallback(
      (value: V) => {
        setValue(value);
        onChange?.(value);
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

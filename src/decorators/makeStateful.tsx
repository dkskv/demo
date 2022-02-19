import { has } from "ramda";
import { useCallback, useState } from "react";

interface IStatelessProps<T, U> {
  value: T;
  onChange(value: T, options?: U): void;
}

interface IStatefulProps<T, U> extends Partial<IStatelessProps<T, U>> {
  initialValue: T;
}

export default function makeStateful<P extends IStatelessProps<T, U>, T, U>(
  Component: React.ComponentType<P>
) {
  return function (
    props: Omit<P, keyof IStatelessProps<T, U>> & IStatefulProps<T, U>
  ) {
    const { initialValue, onChange, value: propsValue, ...restProps } = props;
    const isStateful = !has("value", props);

    if (has("value", props) && has("initialValue", props)) {
      console.error(
        "both arguments 'value' and 'initialValue' cannot be passed at the same time"
      );
    }

    const [stateValue, setStateValue] = useState(props.initialValue);

    const handleChange = useCallback(
      (nextValue: T, options: U) => {
        isStateful && setStateValue(nextValue);

        onChange?.(nextValue, options);
      },
      [isStateful, onChange]
    );

    const newProps = {
      ...restProps,
      value: isStateful ? stateValue : propsValue,
      onChange: handleChange,
    } as unknown as P;

    return <Component {...newProps} />;
  };
}

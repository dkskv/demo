import { has } from "ramda";
import { useCallback, useState } from "react";

interface IStatelessProps<V, O> {
  value: V;
  onChange(value: V, options: O): void;
}

interface IStatefulProps<V> {
  initialValue: V;
}

/**
 * Добавляет возможность переместить управление состоянием внутрь компонента
 * - Принимает компонент с обязательными пропсами: value и onChange.
 * - Возвращает компонент с необязательными пропсами: value, onChange, initialValue
 */
export default function makeStateful<V, O, RestProps>(
  Component: React.ComponentType<RestProps & IStatelessProps<V, O>>
) {
  return function (
    props: React.PropsWithChildren<
      Omit<RestProps, keyof IStatelessProps<V, O>> &
        Partial<IStatelessProps<V, O> & IStatefulProps<V>>
    >
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
      (nextValue: V, options: O) => {
        isStateful && setStateValue(nextValue);

        onChange?.(nextValue, options);
      },
      [isStateful, onChange]
    );

    const value = isStateful ? stateValue : propsValue;

    if (value === undefined) {
      throw new Error(
        "At least one argument 'value' or 'initialValue' must be passed"
      );
    }

    const newProps = {
      ...(restProps as RestProps),
      value,
      onChange: handleChange,
    };

    return <Component {...newProps} />;
  };
}

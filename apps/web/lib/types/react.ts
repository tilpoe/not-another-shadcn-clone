/**
 * Alias for state setter.
 */
export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

/**
 * Alias for state tuple.
 */
export type State<T> = [T, SetState<T>];

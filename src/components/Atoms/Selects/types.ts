import type { OnChangeFn } from "$nodeModules/bits-ui/dist/internal";
import type { Selected } from "bits-ui";

export type SelectType<T> = Selected<T> | Selected<T>[] | undefined;
export type SelectHandlerType<T> = OnChangeFn<SelectType<T>> | undefined;

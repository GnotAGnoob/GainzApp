import {
	toast as toaster,
	type Renderable,
	type ToastOptions,
	type ValueOrFunction,
	type DefaultToastOptions,
} from "svelte-french-toast";

const opts: ToastOptions = {
	duration: 3000,
	style: "",
	position: "bottom-center",
};

const handler = (originalFunction: typeof toaster.success) => {
	return (message: Renderable, options?: ToastOptions) => {
		return originalFunction(message, { ...opts, ...options });
	};
};

const promiseHandler = (originalFunction: typeof toast.promise) => {
	const newStuff: typeof originalFunction = (promise, msgs, options) => {
		return originalFunction(promise, msgs, { ...opts, ...options });
	};

	return newStuff;
};

const toast = Object.assign((message: Renderable, opts: ToastOptions) => toaster(message, opts), toaster);

toast.success = handler(toaster.success);
toast.error = handler(toaster.error);
toast.loading = handler(toaster.loading);
toast.custom = handler(toaster.custom);
toast.promise = promiseHandler(toaster.promise);

export default toast;

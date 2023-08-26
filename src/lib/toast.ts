import { toast as toaster, type Renderable, type ToastOptions } from "svelte-french-toast";

const handler = (originalFunction: typeof toaster.success) => {
	return (message: Renderable, options?: ToastOptions) => {
		const opts: ToastOptions = {
			duration: 3000,
			style: "",
		};
		return originalFunction(message, { ...opts, ...options });
	};
};

const toast = Object.assign((message: Renderable, opts: ToastOptions) => toaster(message, opts), toaster);

toast.success = handler(toaster.success);
toast.error = handler(toaster.error);
toast.loading = handler(toaster.loading);
toast.custom = handler(toaster.custom);

export default toast;

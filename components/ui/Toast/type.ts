export type Status = "success" | "error";

export interface ToastBoxProps {
	id: number;
	message: string;
	status?: Status;
}

export interface ToastItem extends ToastBoxProps {
	duration?: number;
}

export interface ToastContent {
	message: string;
	status?: Status;
	duration?: number;
}

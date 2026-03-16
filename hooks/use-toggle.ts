import { useState, useCallback } from "react";

type UseToggle = {
	isOpen: boolean;
	toggle: () => void;
	open: () => void;
	close: () => void;
};

const useToggle = (init = false): UseToggle => {
	const [isOpen, setIsOpen] = useState(init);
	const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);
	return { isOpen, toggle, open, close };
};
export default useToggle;

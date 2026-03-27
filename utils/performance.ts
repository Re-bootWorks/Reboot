/**
 * 연이은 호출 중 마지막 호출만 실행
 * @example
 * const debouncedFn = debounce(() => {
 *   console.log('debounced');
 * }, 300);
 * debouncedFn();
 */
export function debounce<T extends (...args: never[]) => unknown>(cb: T, time = 300) {
	let timerId: ReturnType<typeof setTimeout> | null = null;
	return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
		clearTimeout(timerId!);
		timerId = setTimeout(() => {
			cb.apply(this, args);
		}, time);
	};
}
/**
 * 호출 후 일정 시간 동안 재호출 방지
 * @example
 * const throttledFn = throttle(() => {
 *   console.log('throttled');
 * }, 300);
 * throttledFn();
 */
export function throttle<T extends (...args: never[]) => unknown>(cb: T, time = 300) {
	let timerId: ReturnType<typeof setTimeout> | null = null;
	return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
		if (timerId) return;
		cb.apply(this, args);
		timerId = setTimeout(() => {
			timerId = null;
		}, time);
	};
}

import { renderHook, act } from "@testing-library/react";
import useInputImage from "./useInputImage";

beforeEach(() => {
	jest.spyOn(URL, "revokeObjectURL").mockImplementation(jest.fn());
	jest.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url");
});

afterEach(() => {
	jest.restoreAllMocks();
});

function setup(props: Partial<Parameters<typeof useInputImage>[0]> = {}) {
	const inputRef = { current: document.createElement("input") };
	const { result } = renderHook(() => useInputImage({ inputRef, ...props }));
	return { result, inputRef };
}

describe("useInputImage 커스텀 훅 테스트", () => {
	const defaultUrl = "https://example.com/img.jpg";
	const mockValue = "C:\\fakepath\\img.jpg";

	test("초기 previewUrl은 defaultUrl과 동일해야 함", () => {
		const { result } = setup({ defaultUrl });

		expect(result.current.previewUrl).toBe(defaultUrl);
	});

	test("resetFile 호출 시 previewUrl이 null이 되고 input value가 초기화됨", () => {
		const { result, inputRef } = setup({ defaultUrl });
		inputRef.current.value = mockValue;

		act(() => result.current.resetFile());

		expect(result.current.previewUrl).toBeNull();
		expect(inputRef.current.value).toBe("");
	});

	test("resetFile 호출 시 onChange 콜백이 실행됨", () => {
		const onChange = jest.fn();
		const { result, inputRef } = setup({ onChange });

		act(() => result.current.resetFile());

		expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ target: inputRef.current }));
	});
});

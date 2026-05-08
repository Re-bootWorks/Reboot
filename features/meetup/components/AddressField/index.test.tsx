import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddressField, { type AddressValues } from ".";
import type { KakaoPlaceItem } from "../../types";

const searchInputPlaceholder = "건물, 지번 또는 도로명 검색";
const detailInputPlaceholder = "상세 주소";
const listboxRole = "listbox";

const mockAddressNamePartial = "역삼";
const mockAddressName = "서울 강남구 역삼동 123";
const mockPlace: KakaoPlaceItem = {
	id: "1",
	address_name: mockAddressName,
	road_address_name: "서울 강남구 테헤란로 123",
	place_name: "테스트 장소",
	x: "127.0276",
	y: "37.4979",
	category_group_code: "",
	category_group_name: "",
	category_name: "",
	distance: "",
	phone: "",
	place_url: "",
};
function createDefaultValue(): AddressValues {
	return {
		addressName: "",
		addressDetail: "",
		latitude: 0,
		longitude: 0,
		region: "",
	};
}

const mockHandleShowToast = jest.fn();
jest.mock("@/providers/toast-provider", () => ({
	useToast: () => ({ handleShowToast: mockHandleShowToast }),
}));

describe("AddressField 컴포넌트 테스트", () => {
	let getKakaoPlaceFn: jest.Mock;
	let setIsComboOpened: jest.Mock;

	beforeEach(() => {
		jest.clearAllMocks();
		jest.useFakeTimers();
		getKakaoPlaceFn = jest.fn().mockResolvedValue([mockPlace]);
		setIsComboOpened = jest.fn();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	test("주소 입력 포커스 시 setIsComboOpened(true)가 호출되어야 함", async () => {
		const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
		render(
			<AddressField
				isComboOpened={false}
				setIsComboOpened={setIsComboOpened}
				value={createDefaultValue()}
				getKakaoPlaceFn={getKakaoPlaceFn}
			/>,
		);

		const addressInput = screen.getByPlaceholderText(searchInputPlaceholder);
		await user.click(addressInput);

		expect(setIsComboOpened).toHaveBeenCalledWith(true);
	});

	test("isComboOpened가 true여도 검색어가 없으면 콤보박스가 표시되지 않아야 함", () => {
		render(
			<AddressField
				isComboOpened={true}
				setIsComboOpened={setIsComboOpened}
				value={createDefaultValue()}
				getKakaoPlaceFn={getKakaoPlaceFn}
			/>,
		);

		const listbox = screen.queryByRole(listboxRole);
		expect(listbox).not.toBeInTheDocument();
	});

	test("isComboOpened가 true이고 검색 결과가 있으면 콤보박스가 표시되어야 함", async () => {
		const setValue = jest.fn();
		render(
			<AddressField
				isComboOpened={true}
				setIsComboOpened={setIsComboOpened}
				value={createDefaultValue()}
				setValue={setValue}
				getKakaoPlaceFn={getKakaoPlaceFn}
			/>,
		);

		const addressInput = screen.getByPlaceholderText(searchInputPlaceholder);
		fireEvent.change(addressInput, { target: { value: mockAddressNamePartial } });
		jest.advanceTimersByTime(200);

		await waitFor(() => {
			expect(getKakaoPlaceFn).toHaveBeenCalledWith(mockAddressNamePartial);
			expect(screen.getByRole(listboxRole)).toBeInTheDocument();
			expect(screen.getByText(mockAddressName)).toBeInTheDocument();
		});
	});

	test("콤보박스 항목 클릭 시 주소가 선택되고 콤보박스가 닫혀야 함", async () => {
		const setValue = jest.fn();
		render(
			<AddressField
				isComboOpened={true}
				setIsComboOpened={setIsComboOpened}
				value={createDefaultValue()}
				setValue={setValue}
				getKakaoPlaceFn={getKakaoPlaceFn}
			/>,
		);

		const addressInput = screen.getByPlaceholderText(searchInputPlaceholder);
		fireEvent.change(addressInput, { target: { value: mockAddressNamePartial } });
		jest.advanceTimersByTime(200);

		await waitFor(() => {
			expect(screen.getByRole(listboxRole)).toBeInTheDocument();
		});

		fireEvent.click(screen.getByText(mockAddressName));

		expect(setValue).toHaveBeenCalledWith(
			expect.objectContaining({
				addressName: mockAddressName,
				latitude: 37.4979,
				longitude: 127.0276,
			}),
		);
		expect(setIsComboOpened).toHaveBeenCalledWith(false);
	});

	test("상세 주소 변경 시 setValue가 호출되어야 함", async () => {
		const setValue = jest.fn();
		render(
			<AddressField
				isComboOpened={false}
				setIsComboOpened={setIsComboOpened}
				value={createDefaultValue()}
				setValue={setValue}
				getKakaoPlaceFn={getKakaoPlaceFn}
			/>,
		);

		const detailInput = screen.getByPlaceholderText(detailInputPlaceholder);
		fireEvent.change(detailInput, { target: { value: "5층" } });

		expect(setValue).toHaveBeenCalled();
	});

	test("카카오 API 에러 시 에러 토스트가 표시되어야 함", async () => {
		getKakaoPlaceFn.mockRejectedValue(new Error("API 오류"));
		const setValue = jest.fn();

		render(
			<AddressField
				isComboOpened={true}
				setIsComboOpened={setIsComboOpened}
				value={createDefaultValue()}
				setValue={setValue}
				getKakaoPlaceFn={getKakaoPlaceFn}
			/>,
		);

		const addressInput = screen.getByPlaceholderText(searchInputPlaceholder);
		fireEvent.change(addressInput, { target: { value: mockAddressNamePartial } });
		jest.advanceTimersByTime(200);

		await waitFor(() => {
			expect(mockHandleShowToast).toHaveBeenCalledWith({
				message: "API 오류",
				status: "error",
			});
		});
	});

	test("onValuesChange 콜백이 호출되어야 함", async () => {
		const onValuesChange = jest.fn();

		render(
			<AddressField
				isComboOpened={false}
				setIsComboOpened={setIsComboOpened}
				value={createDefaultValue()}
				onValuesChange={onValuesChange}
				getKakaoPlaceFn={getKakaoPlaceFn}
			/>,
		);

		const mockAddressDetail = "테스트 주소 상세";
		const detailInput = screen.getByPlaceholderText(detailInputPlaceholder);
		fireEvent.change(detailInput, { target: { value: mockAddressDetail } });

		expect(onValuesChange).toHaveBeenCalledWith(
			expect.objectContaining({ addressDetail: mockAddressDetail }),
		);
	});
});

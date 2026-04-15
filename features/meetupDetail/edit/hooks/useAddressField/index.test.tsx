import EditFormDataProvider, {
	useEditFormData,
} from "@/features/meetupDetail/edit/providers/EditFormDataProvider";
import { act, renderHook } from "@testing-library/react";
import { useAddressField } from "@/features/meetupDetail/edit/hooks/useAddressField/index";
import { mockEditInitialData } from "@/features/meetupDetail/testUtils";

const wrapper = ({ children }: { children: React.ReactNode }) => (
	<EditFormDataProvider isOpen={true} initialData={mockEditInitialData}>
		{children}
	</EditFormDataProvider>
);

const useAddressWithData = () => {
	const { setAddressValue } = useAddressField();
	const { data } = useEditFormData();
	return { setAddressValue, data };
};

// ─────────────────────────────────────────────
// useAddressField
// ─────────────────────────────────────────────
describe("모임 수정 폼의 주소 필드 상태 관리 훅", () => {
	describe("addressValue", () => {
		it("initialData의 주소 관련 필드를 올바르게 반환한다", () => {
			const { result } = renderHook(() => useAddressField(), { wrapper });
			expect(result.current.addressValue._addressName).toBe("서울시 광진구 자양동 123-45");
			expect(result.current.addressValue._addressDetail).toBe("3층");
			expect(result.current.addressValue.latitude).toBe(37.5407);
			expect(result.current.addressValue.longitude).toBe(127.0693);
			expect(result.current.addressValue.region).toBe("건대입구");
		});
	});

	describe("setAddressValue - 객체 직접 전달", () => {
		it("새로운 주소 객체를 전달하면 addressValue가 업데이트된다", () => {
			const { result } = renderHook(() => useAddressField(), { wrapper });
			act(() => {
				result.current.setAddressValue({
					_addressName: "서울시 강남구 테헤란로 123",
					_addressDetail: "5층",
					latitude: 37.5,
					longitude: 127.0,
					region: "강남구",
				});
			});
			expect(result.current.addressValue._addressName).toBe("서울시 강남구 테헤란로 123");
			expect(result.current.addressValue._addressDetail).toBe("5층");
			expect(result.current.addressValue.region).toBe("강남구");
		});

		it("address 필드가 _addressName과 _addressDetail을 ', '로 조합해 업데이트된다", () => {
			const { result } = renderHook(() => useAddressWithData(), { wrapper });
			act(() => {
				result.current.setAddressValue({
					_addressName: "서울시 강남구 테헤란로 123",
					_addressDetail: "5층",
					latitude: 37.5,
					longitude: 127.0,
					region: "강남구",
				});
			});
			expect(result.current.data.address).toBe("서울시 강남구 테헤란로 123, 5층");
		});
	});

	describe("setAddressValue - 함수 전달", () => {
		it("함수를 전달하면 이전 값을 기반으로 addressValue가 업데이트된다", () => {
			const { result } = renderHook(() => useAddressField(), { wrapper });
			act(() => {
				result.current.setAddressValue((prev) => ({
					...prev,
					_addressDetail: "10층",
				}));
			});
			expect(result.current.addressValue._addressDetail).toBe("10층");
			expect(result.current.addressValue._addressName).toBe("서울시 광진구 자양동 123-45");
		});
	});
});

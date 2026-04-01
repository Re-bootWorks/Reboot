"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Script from "next/script";
import IcCopy from "@/components/ui/icons/IcCopy";
import { useToast } from "@/providers/toast-provider";

interface KakaoMapProps {
	address: string;
	latitude: number;
	longitude: number;
}

const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

export default function KakaoMap({ address, latitude, longitude }: KakaoMapProps) {
	const mapRef = useRef<HTMLDivElement>(null);
	const [isScriptLoaded, setIsScriptLoaded] = useState(false);

	const { handleShowToast } = useToast();

	const initMap = useCallback(() => {
		if (!mapRef.current || !window.kakao) return;

		window.kakao.maps.load(() => {
			const coords = new window.kakao.maps.LatLng(latitude, longitude);

			const map = new window.kakao.maps.Map(mapRef.current!, {
				center: coords,
				level: 3,
			});

			new window.kakao.maps.Marker({
				position: coords,
				map,
			});
		});
	}, [latitude, longitude]);

	useEffect(() => {
		if (isScriptLoaded && window.kakao?.maps) {
			initMap();
		}
	}, [isScriptLoaded, initMap]);

	const handleCopyAddress = async () => {
		await navigator.clipboard.writeText(address);
		handleShowToast({ message: "주소가 복사되었습니다!", status: "success" });
	};

	if (!KAKAO_JS_KEY) {
		return (
			<div className="flex h-65 w-full items-center justify-center rounded-3xl bg-gray-100 md:h-88">
				<span className="text-sm text-gray-400 md:text-lg">지도를 불러올 수 없어요.</span>
			</div>
		);
	}

	return (
		<div className="flex h-65 w-full flex-col md:h-88">
			<Script
				src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&autoload=false`}
				strategy="afterInteractive"
				onReady={() => {
					setIsScriptLoaded(true);
				}}
			/>

			{/* 지도가 그려질 영역 */}
			<div className="h-54 w-full overflow-hidden rounded-t-lg border-t border-r border-l border-gray-200 md:h-70 md:rounded-t-4xl">
				<div ref={mapRef} className="h-full w-full" />
			</div>

			{/* 주소 텍스트 + 복사 버튼 */}
			<div className="flex h-fit w-full items-center gap-2.5 overflow-hidden rounded-b-2xl border-r border-b border-l border-slate-300 bg-white px-4 py-3.5 md:rounded-b-4xl md:px-8 md:py-5.5">
				<div className="flex h-fit w-fit items-center gap-2.5 md:gap-3">
					<span className="text-xs font-medium text-black md:text-lg">{address}</span>
					<button
						type="button"
						onClick={handleCopyAddress}
						className={
							"flex h-fit w-fit cursor-pointer items-center gap-0.5 text-xs font-medium text-purple-600 md:text-sm"
						}>
						<IcCopy size="xxs" className="md:h-5 md:w-5" />
						<span>복사</span>
					</button>
				</div>
			</div>
		</div>
	);
}

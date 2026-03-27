declare namespace kakao.maps {
	// 지도 객체 타입
	interface Map {
		setCenter(latLng: LatLng): void;
	}

	// 지도 생성자 타입 (new kakao.maps.Map(...))
	interface MapConstructor {
		new (container: HTMLElement, options: MapOptions): Map;
	}

	// 좌표 객체 타입
	interface LatLng {
		getLat(): number;
		getLng(): number;
	}

	// 좌표 생성자 타입
	interface LatLngConstructor {
		new (lat: number, lng: number): LatLng;
	}

	// 마커 객체 타입
	interface Marker {
		setMap(map: Map | null): void;
	}

	// 마커 생성자 타입
	interface MarkerConstructor {
		new (options: MarkerOptions): Marker;
	}

	// 지도 옵션 타입
	interface MapOptions {
		center: LatLng;
		level: number;
	}

	// 마커 옵션 타입
	interface MarkerOptions {
		position: LatLng;
		map?: Map;
	}

	const Map: MapConstructor;
	const LatLng: LatLngConstructor;
	const Marker: MarkerConstructor;

	function load(callback: () => void): void;
}

interface Window {
	kakao: typeof kakao;
}

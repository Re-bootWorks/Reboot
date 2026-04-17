/**
 * 테스트 환경에서 MSW 핸들러가 올바른 절대 URL로 등록되도록 환경변수를 설정
 *
 * mocks/constants.ts의 BASE_URL은 모듈 로드 시점에 NEXT_PUBLIC_API_URL을 읽어 확정됨
 * setupFiles는 모든 모듈 import보다 먼저 실행되므로, 이 파일에서 환경변수를 설정해야
 * MSW 핸들러가 "http://localhost/api/..." 형태의 절대 URL로 등록됨
 */
process.env.NEXT_PUBLIC_API_URL = "http://localhost/api";


export const LOCAL_STORAGE_KEY = 'characterRanksData';
export const SKILL_CALCULATOR_SETTINGS_KEY = 'skillCalculatorSettings';
export const MESSAGE_DISPLAY_DURATION = 3000; // 메시지 자동 사라짐 시간 (ms)

// --- Rank --- //
export const RANK_MIN = 1;
export const RANK_MAX = 100;

// --- Skill Calculator Input Constants ---
export const MIN_RANK_MIN = 1;
export const MAX_RANK_MIN = 80;
export const DEFAULT_RANK_MIN = 1; // blank 시 이 값으로 되돌림

export const MIN_RANK_MAX = 60;
export const MAX_RANK_MAX = 100;
export const DEFAULT_RANK_MAX = 100; // blank 시 이 값으로 되돌림

export const INCREMENT_MIN_RANK = 1;
export const INCREMENT_MAX_RANK = 10;
export const INCREMENT_DEFAULT_RANK = 1; // blank 시 이 값으로 되돌림

export const MIN_TARGET_VALUE = 10; // manual-x-input 및 자동 입력 시작값의 최소
export const MAX_TARGET_VALUE = 140; // manual-x-input 및 자동 입력 끝나는값의 최대

// 자동 입력 모달의 기본값 (이름 변경됨)
export const DEFAULT_AUTO_INPUT_START = 80;
export const DEFAULT_AUTO_INPUT_END = 140;
export const DEFAULT_AUTO_INPUT_INCREMENT = 5;

// 자동 입력 테이블 X축 생성 개수 제한 (새로 추가됨)
export const MIN_X_VALUES_COUNT = 5;
export const MAX_X_VALUES_COUNT = 25;

// blank 시 되돌릴 특정 값 (InputNumberElement의 fallbackValueOnBlank로 사용)
// null은 previousValue 또는 defaultValue로 되돌림을 의미
export const FALLBACK_RANK_INPUT_ON_BLANK = null; // rank-min, max, increment는 이전 값으로 되돌림

// 사용자 요청에 따라 변경됨: auto-input 필드들도 previousValue 로직을 따르도록 null로 설정
export const FALLBACK_AUTO_INPUT_START_ON_BLANK = null;
export const FALLBACK_AUTO_INPUT_END_ON_BLANK = null;
export const FALLBACK_AUTO_INPUT_INCREMENT_ON_BLANK = null;

export const FALLBACK_MANUAL_X_ON_BLANK = 0; // manual-x-input blank 시 0으로
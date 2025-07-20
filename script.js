// ===============================================
// 1. 전역 변수 및 DOM 요소 가져오기
// ===============================================

// 게임에 필요한 변수들
let currentScore = 0; // 현재 점수
let foundItemsCount = 0; // 찾은 아이템 개수
let timeLeft = 20; // 남은 시간 (초)
let timerInterval; // 타이머를 저장할 변수 (나중에 멈출 때 사용)
let currentStage = 0; // 현재 게임 단계 (0: 도시, 1: 바다, 2: 정글)
let playerName = ''; // 플레이어 닉네임

// 각 페이지 DOM 요소 (HTML에서 id로 가져옴)
const startPage = document.getElementById('start-page');
const gamePage = document.getElementById('game-page');
const resultPage = document.getElementById('result-page');
const rankingPage = document.getElementById('ranking-page');

// 시작 페이지 요소들
const nicknameInput = document.getElementById('nickname-input');
const startGameButton = document.getElementById('start-game-button');

// 게임 페이지 요소들
const gameTitle = document.getElementById('game-title');
const timerDisplay = document.getElementById('time-left');
const scoreDisplay = document.getElementById('current-score');
const foundCountDisplay = document.getElementById('current-found-count');
const gameArea = document.getElementById('game-area');

// 결과 페이지 요소들
const finalNicknameDisplay = document.getElementById('final-nickname');
const finalScoreDisplay = document.getElementById('final-score');
const materialCardsContainer = document.getElementById('material-cards');
const viewRankingButton = document.getElementById('view-ranking-button');

// 랭킹 페이지 요소들
const rankingList = document.getElementById('ranking-list');
const restartGameButton = document.getElementById('restart-game-button');

// ===============================================
// 2. 게임 데이터 설정
// ===============================================

// 각 스테이지(장소)별 게임 정보
const stages = [
    {
        name: "도시",
        background: "images/city-background.jpg", // 나중에 추가할 이미지 경로
        items: [ // 각 아이템의 위치 (퍼센트)
            { id: 'plastic-bottle', top: '15%', left: '20%', type: 'plastic' },
            { id: 'can-soda', top: '30%', left: '70%', type: 'can' },
            { id: 'newspaper', top: '60%', left: '10%', type: 'paper' },
            { id: 'old-cloth', top: '75%', left: '50%', type: 'cloth' },
            { id: 'milk-carton', top: '10%', left: '80%', type: 'paper' },
            { id: 'plastic-bag', top: '45%', left: '5%', type: 'plastic' },
            { id: 'broken-glass', top: '50%', left: '90%', type: 'plastic' }, // 유리병도 플라스틱류로 간주
            { id: 'pizza-box', top: '80%', left: '30%', type: 'paper' },
            { id: 'coffee-cup', top: '25%', left: '40%', type: 'paper' },
            { id: 'battery', top: '65%', left: '65%', type: 'can' } // 건전지는 캔류로 간주
        ]
    },
    {
        name: "바다",
        background: "images/ocean-background.jpg",
        items: [
            { id: 'fishing-net', top: '10%', left: '15%', type: 'plastic' },
            { id: 'plastic-straw', top: '25%', left: '60%', type: 'plastic' },
            { id: 'buoy', top: '40%', left: '85%', type: 'plastic' },
            { id: 'water-bottle', top: '55%', left: '25%', type: 'plastic' },
            { id: 'old-tire', top: '70%', left: '55%', type: 'can' }, // 타이어는 캔류로 간주
            { id: 'plastic-sandal', top: '20%', left: '40%', type: 'plastic' },
            { id: 'snack-bag', top: '80%', left: '5%', type: 'plastic' },
            { id: 'rope', top: '35%', left: '50%', type: 'cloth' },
            { id: 'detergent-bottle', top: '60%', left: '75%', type: 'plastic' },
            { id: 'drink-can', top: '5%', left: '5%', type: 'can' }
        ]
    },
    {
        name: "정글",
        background: "images/jungle-background.jpg",
        items: [
            { id: 'plastic-wrap', top: '5%', left: '80%', type: 'plastic' },
            { id: 'aluminum-foil', top: '20%', left: '10%', type: 'can' },
            { id: 'cardboard-box', top: '35%', left: '70%', type: 'paper' },
            { id: 'old-tent', top: '50%', left: '30%', type: 'cloth' },
            { id: 'plastic-toy', top: '65%', left: '85%', type: 'plastic' },
            { id: 'plastic-spoon', top: '15%', left: '55%', type: 'plastic' },
            { id: 'broken-cup', top: '80%', left: '15%', type: 'plastic' }, // 깨진 컵도 플라스틱류로 간주
            { id: 'magazine', top: '40%', left: '50%', type: 'paper' },
            { id: 'plastic-comb', top: '25%', left: '5%', type: 'plastic' },
            { id: 'soda-bottle', top: '70%', left: '60%', type: 'plastic' }
        ]
    }
];

// 재료별 카드 메시지 (결과 페이지에 사용)
const materialMessages = {
    plastic: {
        title: "플라스틱 카드",
        message: "플라스틱은 500년이나 썩지 않아요. 자연을 위한 멋진 방법, 업사이클로 다시 태어나게 해봐요!"
    },
    can: {
        title: "캔 카드",
        message: "무심코 버린 캔, 야생동물이 먹고 목숨을 잃을 수 있어요. 자연을 위한 멋진 방법, 업사이클로 다시 태어나게 해봐요!"
    },
    paper: {
        title: "페이퍼 카드",
        message: "종이 1만 장을 만들면 나무 한 그루가 사라져요. 자연을 위한 멋진 방법, 업사이클로 다시 태어나게 해봐요!"
    },
    cloth: {
        title: "천 카드",
        message: "천은 100년이나 썩지 않아요. 자연을 위해 멋진 방법, 업사이클로 다시 태어나게 해봐요!"
    }
};

let foundMaterialTypes = { // 찾은 재료 타입 저장 (결과 카드에 사용)
    plastic: 0,
    can: 0,
    paper: 0,
    cloth: 0
};

// ===============================================
// 3. 페이지 전환 함수
// ===============================================

// 모든 페이지를 숨기고, 특정 페이지를 보여주는 함수
function showPage(pageToShow) {
    const allPages = [startPage, gamePage, resultPage, rankingPage];
    allPages.forEach(page => {
        if (page === pageToShow) {
            page.classList.remove('hidden'); // hidden 클래스 제거하여 보이게 함
        } else {
            page.classList.add('hidden'); // hidden 클래스 추가하여 숨김
        }
    });
}

// ===============================================
// 4. 이벤트 리스너 설정 (클릭 등)
// ===============================================

// "게임 시작" 버튼 클릭 시
startGameButton.addEventListener('click', () => {
    playerName = nicknameInput.value.trim(); // 닉네임 입력값을 가져와 앞뒤 공백 제거
    if (playerName === '') {
        alert('닉네임을 입력해주세요!');
        return; // 닉네임이 없으면 함수 종료
    }
    showPage(gamePage); // 게임 페이지 보여주기
    initializeGame(); // 게임 초기화 및 시작 함수 호출
});

// "전체 랭킹 보기" 버튼 클릭 시
viewRankingButton.addEventListener('click', () => {
    showPage(rankingPage);
    displayRanking(); // 랭킹 표시 함수 호출 (나중에 구현)
});

// "다시 시작하기" 버튼 클릭 시
restartGameButton.addEventListener('click', () => {
    // 게임 변수 초기화
    currentScore = 0;
    foundItemsCount = 0;
    timeLeft = 20;
    currentStage = 0;
    foundMaterialTypes = { plastic: 0, can: 0, paper: 0, cloth: 0 };
    nicknameInput.value = ''; // 닉네임 입력칸 비우기

    showPage(startPage); // 시작 페이지로 돌아가기
});
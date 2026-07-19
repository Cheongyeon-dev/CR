// 크루즈 코즈믹 호러 TRPG 통합 UI 컴포넌트
// type: "main" | "dice" | "item_discover" | "ending"

const ITEM_DB = {
  // --- 객실 구역 ---
  "log_203": {
    icon: "📝", title: "구겨진 메모", desc: "객실 203호에서 발견",
    type: "paper",
    content: "옆방에서 밤새 벽을 긁는 소리가 난다. 분명히 비어있는 객실이라고 했는데. 프론트에 연락해도 통화 중이라는 기계음만 반복된다."
  },
  "photo_205": {
    icon: "📷", title: "초점이 나간 사진", desc: "객실 205호 바닥에 떨어져 있던 사진",
    type: "photo",
    content: "(어두운 객실 화장실 거울을 찍은 사진. 거울 속에 사람의 형태가 아닌 기이하게 길쭉한 무언가의 실루엣이 흐릿하게 맺혀 있다.)"
  },
  // --- 갑판 구역 ---
  "log_pool": {
    icon: "📜", title: "젖은 일지 페이지", desc: "10F 야외 수영장에서 건져냄",
    type: "wet_paper",
    content: "물 밖으로 나가야 해 물 밖으로 나가야 해 물 밖으로 나가야 해 저 아래에 입이 있어"
  },
  "item_bench": {
    icon: "📻", title: "망가진 무전기", desc: "9F 갑판 벤치 밑",
    type: "device",
    content: "(전원이 꺼진 무전기다. 하지만 귀를 가까이 대면 끊임없이 웅얼거리는 듯한 주파수 노이즈가 새어나온다.)"
  },
  // --- 식당/라운지 구역 ---
  "log_salad": {
    icon: "🍴", title: "식당 검역 보고서", desc: "4F 레스토랑 샐러드바",
    type: "paper",
    content: "식자재 오염. 폐기 요망. 고기에서 자꾸만 맥박이 뛰는 것처럼 움직인다. 주방장은 정상이라고 주장함."
  },
  "log_locker": {
    icon: "🩸", title: "피 묻은 직원 수첩", desc: "직원 탈의실 캐비닛",
    type: "bloody_paper",
    content: "오늘 밤 12시, 안개가 짙어지면 모두 '그것'을 맞이하러 간다. 나만 빼고. 나만 빼고. 눈이 마주치면 안 돼."
  },
  "item_sofa": {
    icon: "🗝️", title: "차갑게 식은 객실 키", desc: "7F 라운지 소파 틈새",
    type: "item",
    content: "금속 재질의 열쇠. '기관실'이라는 긁힌 자국이 있다. 손에 쥐고 있으면 뼛속까지 시린 한기가 올라온다."
  }
};

function CustomComponent({
  type = "main", // "main"(상시메뉴), "dice"(판정), "item_discover"(최초발견연출), "ending"(엔딩)

  // Main Menu Props
  playerName = "VIP 승객",
  weather = "맑음",
  time = "Day 1 - 18:00",
  fogLevel = "없음",
  sanity = 100,
  events = [],
  inventoryIds = [], // 수집품 메뉴에서 확인할 ID 배열

  // Dice Props
  diceType = "1d20",
  diceResult = null,
  diceReason = "탐색",

  // Item Props
  id = "", // 최초 발견 시 연출할 단서 ID

  // Ending Props
  title = "",
  verdict = "",
  body = ""
}) {
  const [activeTab, setActiveTab] = React.useState("map");
  const [viewItem, setViewItem] = React.useState(null);
  const [expandedDeck, setExpandedDeck] = React.useState(null);
  const [isRolling, setIsRolling] = React.useState(false);
  const [showResult, setShowResult] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(0);

  // 탭 변경 시 상세 보기 초기화
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab !== "inventory") {
      setViewItem(null);
    }
  };

  // 다이스 굴리기 액션
  const handleRoll = () => {
    if (isRolling || showResult) return;
    setIsRolling(true);
    setTimeout(() => {
      setIsRolling(false);
      setShowResult(true);
    }, 1500);
  };

  // 1. 상시 메뉴 UI (지도/상태창/수집품)
  if (type === "main") {
    return (
      <div
        style={{
          maxWidth: "400px",
          margin: "0 auto",
          background: "linear-gradient(180deg, #0a1f3d 0%, #061528 100%)",
          border: "1px solid #d4b86a",
          borderRadius: "12px",
          color: "#f5f0e6",
          fontFamily: '"Pretendard", sans-serif',
          boxShadow:
            "0 16px 32px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)",
          overflow: "hidden",
        }}
      >
        {/* 헤더 영역 */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid rgba(212, 184, 106, 0.3)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "12px",
              letterSpacing: "0.2em",
              color: "#d4b86a",
              textTransform: "uppercase",
            }}
          >
            THREE DAYS OF SUN
          </h3>
          <p
            style={{ margin: "4px 0 0", fontSize: "18px", fontWeight: "bold" }}
          >
            {playerName}
          </p>
        </div>

        {/* 탭 버튼 */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid rgba(212, 184, 106, 0.2)",
          }}
        >
          {["map", "status", "inventory"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              style={{
                flex: 1,
                padding: "12px 0",
                background:
                  activeTab === tab
                    ? "rgba(212, 184, 106, 0.15)"
                    : "transparent",
                border: "none",
                borderBottom:
                  activeTab === tab
                    ? "2px solid #d4b86a"
                    : "2px solid transparent",
                color: activeTab === tab ? "#f0e4c4" : "#8a7f6e",
                fontSize: "13px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {tab === "map" ? "지도" : tab === "status" ? "상태창" : "수집품"}
            </button>
          ))}
        </div>

        {/* 콘텐츠 */}
        <div style={{ padding: "24px 20px", minHeight: "280px" }}>
          {/* 지도 탭 */}
          {activeTab === "map" && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "#d4b86a",
                  letterSpacing: "0.1em",
                }}
              >
                ◆ DECK PLAN & EVENTS
              </div>
              {[
                { id: "10F", name: "야외 수영장 & 자쿠지" },
                { id: "9F", name: "갑판 산책로" },
                { id: "7F", name: "라운지 바" },
                { id: "4F", name: "레스토랑" },
                { id: "5-8F", name: "여객 객실 구역" },
              ].map((deck) => {
                const deckEvents = events.filter((e) => e.location === deck.id);
                return (
                  <div
                    key={deck.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    <div 
                      style={{...mapBtnStyle, cursor: "pointer"}}
                      onClick={() => setExpandedDeck(expandedDeck === deck.id ? null : deck.id)}
                    >
                      <span style={deckNumStyle}>{deck.id}</span>
                      <span style={{ flex: 1, textAlign: "left" }}>
                        {deck.name}
                      </span>
                      <span style={{...indicatorStyle, transition: "transform 0.2s", transform: expandedDeck === deck.id ? "rotate(180deg)" : "rotate(0deg)"}}>
                        ▼
                      </span>
                    </div>
                    {/* 아코디언 펼침 내용 */}
                    <div
                      style={{
                        maxHeight: expandedDeck === deck.id ? "500px" : "0",
                        overflow: "hidden",
                        transition: "max-height 0.3s ease-in-out",
                        opacity: expandedDeck === deck.id ? 1 : 0,
                      }}
                    >
                      <div
                        style={{
                          padding: "12px 16px",
                          background: "rgba(0,0,0,0.2)",
                          borderLeft: "2px solid #7fd4df",
                          borderRadius: "0 4px 4px 0",
                          marginTop: "2px",
                          fontSize: "13px",
                          color: "#a6b0c2",
                          lineHeight: "1.6",
                        }}
                      >
                        {deckEvents.length > 0 ? (
                          deckEvents.map((ev, idx) => (
                            <div key={idx} style={{ padding: "6px 0", borderBottom: idx < deckEvents.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                              <span style={{ color: "#d4b86a", fontWeight: "bold", marginRight: "8px" }}>
                                {ev.name}
                              </span>
                              <span>{ev.mood}</span>
                              <span style={{ margin: "0 6px", color: "#5a6578" }}>|</span>
                              <span>{ev.action}</span>
                            </div>
                          ))
                        ) : (
                          <div style={{ color: "#5a6578", fontStyle: "italic", padding: "4px 0" }}>
                            현재 이 구역에는 아무도 없는 것 같습니다.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 상태창 탭 */}
          {activeTab === "status" && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div
                style={{
                  background: "#040d1a",
                  padding: "16px",
                  borderRadius: "8px",
                  border: "1px solid rgba(127, 212, 223, 0.3)",
                  boxShadow: "inset 0 0 16px rgba(0,0,0,0.8)",
                }}
              >
                <div
                  style={{
                    color: "#7fd4df",
                    fontFamily: "monospace",
                    fontSize: "13px",
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                  }}
                >
                  <span>TIME</span> <span>{time}</span>
                </div>
                <div
                  style={{
                    color: "#7fd4df",
                    fontFamily: "monospace",
                    fontSize: "13px",
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                  }}
                >
                  <span>WEATHER</span> <span>{weather}</span>
                </div>
                <div
                  style={{
                    color: fogLevel !== "없음" ? "#e8925a" : "#7fd4df",
                    fontFamily: "monospace",
                    fontSize: "13px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>FOG WARN</span> <span>{fogLevel}</span>
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  marginTop: "12px",
                  padding: "16px",
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    color: "#d4b86a",
                    marginBottom: "8px",
                  }}
                >
                  심리 상태
                </div>

                {/* 기존 이모지 잔으로 롤백 */}
                <div style={{ fontSize: "24px", marginBottom: "4px" }}>
                  {sanity > 70 ? "🍸" : sanity > 30 ? "🍹" : "🍷"}
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    color: sanity > 30 ? "#f5f0e6" : "#e8925a",
                  }}
                >
                  {sanity > 70
                    ? "평온함. 기분 좋은 파도 소리가 들립니다."
                    : sanity > 30
                      ? "이런, 조금 어지럽습니다. 안개가 짙어집니다."
                      : "귓가에 누군가의 웃음소리가 들리기 시작합니다."}
                </div>
              </div>
            </div>
          )}

          {/* 수집품 탭 */}
          {activeTab === "inventory" && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "#d4b86a",
                  marginBottom: "8px",
                  letterSpacing: "0.1em",
                }}
              >
                ◆ COLLECTED LOGS
              </div>
              
              {/* 아이템 상세 보기 모드 */}
              {viewItem ? (
                <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid #d4b86a", borderRadius: "8px", padding: "16px", position: "relative" }}>
                  <button 
                    onClick={() => setViewItem(null)}
                    style={{ position: "absolute", top: "12px", right: "12px", background: "transparent", border: "none", color: "#8a7f6e", cursor: "pointer", fontSize: "16px" }}
                  >
                    ✖
                  </button>
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>{viewItem.icon}</div>
                  <div style={{ fontSize: "16px", fontWeight: "bold", color: "#f0e4c4", marginBottom: "4px" }}>{viewItem.title}</div>
                  <div style={{ fontSize: "11px", color: "#8a7f6e", marginBottom: "16px" }}>{viewItem.desc}</div>
                  
                  {/* 종이/일기장일 경우 찢어진 느낌의 디자인 적용 */}
                  {viewItem.type.includes("paper") ? (
                    <div style={{
                      background: viewItem.type === "bloody_paper" ? "rgba(92, 36, 56, 0.1)" : "rgba(245, 240, 230, 0.05)",
                      borderLeft: viewItem.type === "bloody_paper" ? "3px solid #8b1a1a" : "3px solid #8a7f6e",
                      padding: "16px",
                      fontFamily: '"Nanum Myeongjo", serif',
                      fontSize: "14px",
                      lineHeight: "1.8",
                      color: viewItem.type === "wet_paper" ? "rgba(245, 240, 230, 0.6)" : "#d1d8e5",
                      textShadow: viewItem.type === "wet_paper" ? "0 0 2px rgba(245, 240, 230, 0.4)" : "none",
                      whiteSpace: "pre-wrap"
                    }}>
                      {viewItem.content}
                    </div>
                  ) : viewItem.type === "photo" ? (
                    <div style={{
                      background: "#000",
                      padding: "12px",
                      border: "8px solid #fff",
                      borderBottom: "32px solid #fff",
                      fontFamily: '"Nanum Myeongjo", serif',
                      fontSize: "12px",
                      color: "#333",
                      textAlign: "center"
                    }}>
                      <div style={{ height: "120px", background: "linear-gradient(45deg, #111, #333)", marginBottom: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#555" }}>
                        [ 흐릿한 형상 ]
                      </div>
                      {viewItem.content}
                    </div>
                  ) : (
                    <div style={{ padding: "12px", background: "rgba(255,255,255,0.02)", fontSize: "13px", color: "#a6b0c2", lineHeight: "1.6" }}>
                      {viewItem.content}
                    </div>
                  )}
                </div>
              ) : (
                /* 아이템 목록 모드 */
                inventoryIds.length > 0 ? (
                  inventoryIds.map(id => {
                    const item = ITEM_DB[id];
                    if (!item) return null;
                    return (
                      <div 
                        key={id}
                        onClick={() => setViewItem(item)}
                        style={{
                          display: "flex", alignItems: "center", gap: "12px", padding: "12px",
                          background: "rgba(0,0,0,0.2)", borderLeft: "2px solid #d4b86a", cursor: "pointer",
                          transition: "background 0.2s"
                        }}
                        onMouseOver={e => e.currentTarget.style.background = "rgba(212, 184, 106, 0.1)"}
                        onMouseOut={e => e.currentTarget.style.background = "rgba(0,0,0,0.2)"}
                      >
                        <span style={{ fontSize: "16px" }}>{item.icon}</span>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: "bold" }}>{item.title}</div>
                          <div style={{ fontSize: "11px", color: "#8a7f6e" }}>{item.desc}</div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ fontSize: "13px", color: "#8a7f6e", textAlign: "center", padding: "20px" }}>
                    아직 발견된 단서가 없습니다.
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. 다이스 롤러 UI
  if (type === "dice") {
    // 1~20 중 랜덤 숫자 (실제 렌더링용, AI 결과값이 있으면 그걸 씀)
    const resultValue = diceResult || Math.floor(Math.random() * 20) + 1;
    const isSuccess = resultValue >= 11;
    const isCritical = resultValue >= 16;
    const isFumble = resultValue <= 5;

    return (
      <div
        style={{
          maxWidth: "300px",
          margin: "20px auto",
          padding: "24px",
          background: "linear-gradient(135deg, #0a1f3d, #061528)",
          border: "1px solid #d4b86a",
          borderRadius: "12px",
          textAlign: "center",
          color: "#f5f0e6",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 데굴데굴 애니메이션 및 CSS */}
        <style>
          {`
            @keyframes rollDice {
              0% { transform: rotate(0deg) scale(1); }
              25% { transform: rotate(-45deg) scale(1.1) translateY(-10px); }
              50% { transform: rotate(180deg) scale(0.9) translateY(5px); }
              75% { transform: rotate(315deg) scale(1.05) translateY(-5px); }
              100% { transform: rotate(360deg) scale(1); }
            }
            @keyframes pulseGlow {
              0% { box-shadow: 0 0 10px rgba(212, 184, 106, 0.2); }
              50% { box-shadow: 0 0 20px rgba(212, 184, 106, 0.6); }
              100% { box-shadow: 0 0 10px rgba(212, 184, 106, 0.2); }
            }
          `}
        </style>

        <div
          style={{
            fontSize: "12px",
            color: "#8a7f6e",
            letterSpacing: "0.2em",
            marginBottom: "16px",
          }}
        >
          ROLL: {diceReason}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80px",
            marginBottom: "20px",
          }}
        >
          {/* 주사위 아이콘/애니메이션 */}
          <div
            onClick={handleRoll}
            style={{
              width: "64px",
              height: "64px",
              background: showResult
                ? isCritical
                  ? "#2c8aa0"
                  : isFumble
                    ? "#5c2438"
                    : "#1d456a"
                : "#1d456a",
              borderRadius: "12px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#fff",
              cursor: showResult ? "default" : "pointer",
              animation: isRolling
                ? "rollDice 1.5s cubic-bezier(0.25, 1, 0.5, 1)"
                : showResult
                  ? "none"
                  : "pulseGlow 2s infinite",
              border: "2px solid #d4b86a",
              transition: "background 0.5s",
            }}
          >
            {isRolling ? "🎲" : showResult ? resultValue : "?"}
          </div>
        </div>

        {/* 결과 텍스트 */}
        <div style={{ height: "40px" }}>
          {!isRolling && !showResult && (
            <div style={{ fontSize: "13px", color: "#d4b86a" }}>
              주사위를 눌러 판정하세요
            </div>
          )}
          {showResult && (
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: isCritical
                  ? "#7fd4df"
                  : isFumble
                    ? "#e8925a"
                    : "#d4b86a",
              }}
            >
              {isCritical
                ? "대성공!"
                : isFumble
                  ? "대실패..."
                  : isSuccess
                    ? "성공"
                    : "실패"}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (type === "item_discover") {
    // id가 없거나 ITEM_DB에 없으면 폴백 렌더링을 하거나 아예 안 보이게 처리할 수 있습니다.
    // 여기서는 미리보기 테스트를 위해 id가 없으면 첫 번째 아이템(log_203)을 강제로 보여줍니다.
    const targetId = id || "log_203";
    const item = ITEM_DB[targetId];
    if (!item) return null;
    
    // 페이지 상태 관리 (단서 텍스트가 여러 장으로 나뉘는 효과)
    const [currentPage, setCurrentPage] = React.useState(0);
    // 긴 텍스트를 적당한 길이로 자르기 (예제용 임의 분할 로직)
    const pages = item.content.length > 80 
      ? [item.content.substring(0, Math.floor(item.content.length/2)), item.content.substring(Math.floor(item.content.length/2))]
      : [item.content];

    return (
      <div style={{ maxWidth: '520px', margin: '32px auto', position: 'relative', perspective: '1000px' }}>
        <div style={{ position: 'absolute', top: '-14px', left: '20px', background: '#d4b86a', color: '#040914', fontSize: '11px', fontWeight: 'bold', padding: '6px 14px', borderRadius: '4px', letterSpacing: '0.15em', zIndex: 10, boxShadow: '0 4px 8px rgba(0,0,0,0.5)' }}>NEW DISCOVERY</div>
        
        <div style={{ 
          background: "linear-gradient(135deg, #0a1f3d 0%, #040d1a 100%)", 
          border: "2px solid #d4b86a", 
          borderRadius: "12px", 
          padding: "40px 24px 24px", 
          position: "relative",
          boxShadow: '0 24px 48px rgba(0,0,0,0.9), inset 0 0 40px rgba(0,0,0,0.8)'
        }}>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '24px' }}>
            <div style={{ fontSize: "48px", filter: 'drop-shadow(0 0 8px rgba(212,184,106,0.4))' }}>{item.icon}</div>
            <div>
              <div style={{ fontSize: "20px", fontWeight: "bold", color: "#f0e4c4", marginBottom: "4px", letterSpacing: '0.05em' }}>{item.title}</div>
              <div style={{ fontSize: "13px", color: "#8a7f6e", fontStyle: 'italic' }}>{item.desc}</div>
            </div>
          </div>
          
          {item.type.includes("paper") ? (
            <div style={{ position: 'relative', minHeight: '260px' }}>
              
              {/* 다이어리/수첩 본체 연출 */}
              <div style={{
                background: item.type === "bloody_paper" 
                  ? "linear-gradient(to bottom, #d9d1c0 0%, #c4bcae 100%)" 
                  : item.type === "wet_paper"
                    ? "linear-gradient(to bottom, #c2c9d1 0%, #a8b0ba 100%)"
                    : "linear-gradient(to bottom, #e8e3d5 0%, #d4cdbb 100%)",
                padding: "32px 32px 48px 40px",
                borderRadius: "4px 12px 12px 4px",
                fontFamily: '"Nanum Myeongjo", "Batang", serif',
                fontSize: "16px",
                lineHeight: "2.2",
                color: item.type === "wet_paper" ? "rgba(40, 50, 60, 0.7)" : "#1a1c20",
                textShadow: item.type === "wet_paper" ? "0 0 6px rgba(40,50,60,0.3)" : "none",
                whiteSpace: "pre-wrap",
                boxShadow: '8px 8px 24px rgba(0,0,0,0.6), inset 16px 0 24px rgba(0,0,0,0.1)',
                position: 'relative',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.5s ease-in-out',
                borderLeft: '4px solid rgba(0,0,0,0.2)'
              }}>
                
                {/* 좌측 스프링/타공 구멍 연출 */}
                <div style={{ position: 'absolute', top: '10px', left: '6px', bottom: '10px', width: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 3 }}>
                  {[...Array(8)].map((_, i) => (
                    <div key={i} style={{ width: '12px', height: '12px', background: '#0a1f3d', borderRadius: '50%', boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.8)' }} />
                  ))}
                </div>

                {/* 노트 가로줄 무늬 */}
                <div style={{ position: 'absolute', top: '32px', left: '0', width: '100%', height: 'calc(100% - 32px)', backgroundImage: 'linear-gradient(transparent 95%, rgba(0,0,0,0.08) 100%)', backgroundSize: '100% 35.2px', pointerEvents: 'none' }} />

                {/* 특수 효과 (피/물) */}
                {item.type === "bloody_paper" && (
                  <div style={{ position: 'absolute', bottom: '20px', right: '30px', width: '120px', height: '100px', background: 'radial-gradient(circle, rgba(139,26,26,0.4) 0%, transparent 60%)', filter: 'blur(4px)', pointerEvents: 'none', mixBlendMode: 'multiply' }} />
                )}
                {item.type === "wet_paper" && (
                  <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', background: 'linear-gradient(120deg, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.1) 50%, rgba(255,255,255,0.1) 100%)', mixBlendMode: 'overlay', pointerEvents: 'none' }} />
                )}

                {/* 내용 텍스트 (페이지에 맞게 렌더링) */}
                <div style={{ position: 'relative', zIndex: 2, minHeight: '160px' }}>
                  {pages[currentPage]}
                </div>
                
                {/* 페이지 넘기기 컨트롤 */}
                {pages.length > 1 && (
                  <div style={{ position: 'absolute', bottom: '16px', right: '24px', display: 'flex', gap: '16px', zIndex: 10 }}>
                    {currentPage > 0 && (
                      <button onClick={() => setCurrentPage(p => p - 1)} style={{ background: 'none', border: 'none', color: 'rgba(0,0,0,0.4)', cursor: 'pointer', fontFamily: 'serif', fontWeight: 'bold' }}>← 이전장</button>
                    )}
                    {currentPage < pages.length - 1 && (
                      <button onClick={() => setCurrentPage(p => p + 1)} style={{ background: 'none', border: 'none', color: 'rgba(0,0,0,0.6)', cursor: 'pointer', fontFamily: 'serif', fontWeight: 'bold' }}>다음장 →</button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : item.type === "photo" ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {/* 폴라로이드 사진 연출 */}
              <div style={{
                background: "#f5f5f5",
                padding: "16px 16px 48px 16px",
                borderRadius: "2px",
                fontFamily: '"Nanum Myeongjo", serif',
                fontSize: "14px",
                color: "#222",
                textAlign: "center",
                boxShadow: '0 16px 32px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,0,0,0.05)',
                width: '80%',
                transform: 'rotate(-2deg)',
                transition: 'transform 0.3s'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'rotate(0deg) scale(1.05)'}
              onMouseOut={e => e.currentTarget.style.transform = 'rotate(-2deg)'}
              >
                <div style={{ 
                  height: "220px", 
                  background: "linear-gradient(45deg, #050505 0%, #1a1a1a 100%)", 
                  marginBottom: "20px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  color: "#444",
                  boxShadow: 'inset 0 0 30px rgba(0,0,0,1)'
                }}>
                  <span style={{ filter: 'blur(1px)' }}>[ 빛바랜 형상 ]</span>
                </div>
                <div style={{ opacity: 0.8 }}>{item.content}</div>
              </div>
            </div>
          ) : (
            <div style={{ 
              padding: "24px", 
              background: "rgba(255,255,255,0.03)", 
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "4px",
              fontSize: "15px", 
              color: "#a6b0c2", 
              lineHeight: "1.8",
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
            }}>
              {item.content}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 4. 엔딩 카드 UI
  if (type === "ending") {
    return (
      <div
        style={{
          maxWidth: "480px",
          margin: "40px auto",
          padding: "48px 32px",
          background: "linear-gradient(180deg, #040914 0%, #081222 100%)",
          borderTop: "2px solid #d4b86a",
          borderBottom: "2px solid #d4b86a",
          textAlign: "center",
          color: "#f5f0e6",
          fontFamily: '"Nanum Myeongjo", serif',
          boxShadow: "0 24px 48px rgba(0,0,0,0.8)",
        }}
      >
        <div
          style={{
            color: "#d4b86a",
            fontSize: "11px",
            letterSpacing: "0.4em",
            marginBottom: "32px",
          }}
        >
          THREE DAYS OF SUN
        </div>
        <h1
          style={{
            fontSize: "36px",
            margin: "0 0 20px",
            fontWeight: "normal",
            color: "#f0e4c4",
            letterSpacing: "0.05em",
          }}
        >
          {title}
        </h1>
        <div
          style={{
            width: "60px",
            height: "1px",
            background: "rgba(212,184,106,0.5)",
            margin: "0 auto 32px",
          }}
        ></div>
        <p
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "#a6b0c2",
            marginBottom: "24px",
          }}
        >
          {verdict}
        </p>

        {body && (
          <div
            style={{
              marginTop: "32px",
              padding: "24px",
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(212, 184, 106, 0.2)",
              textAlign: "left",
              fontSize: "14px",
              lineHeight: "1.9",
              color: "#d1d8e5",
              whiteSpace: "pre-wrap",
              fontFamily: '"Pretendard", sans-serif',
            }}
          >
            {body}
          </div>
        )}

        <div
          style={{
            marginTop: "40px",
            fontSize: "11px",
            color: "#5a6578",
            fontFamily: "monospace",
            letterSpacing: "0.1em",
          }}
        >
          END OF LOG
        </div>
      </div>
    );
  }

  return null;
}

// 재사용 스타일
const mapBtnStyle = {
  display: "flex",
  alignItems: "center",
  width: "100%",
  padding: "16px",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(212, 184, 106, 0.2)",
  borderRadius: "6px",
  color: "#f5f0e6",
  fontSize: "14px",
};
const deckNumStyle = {
  width: "40px",
  fontWeight: "bold",
  color: "#d4b86a",
  fontFamily: "serif",
};
const indicatorStyle = {
  fontSize: "12px",
  color: "#d4b86a",
  padding: "4px 8px",
};

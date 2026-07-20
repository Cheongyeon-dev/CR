// 크루즈 코즈믹 호러 TRPG 통합 UI 컴포넌트
// type: "main" | "dice" | "item_discover" | "ending"

const ITEM_DB = {
  // --- 일기장 조각 (연속된 기록) ---
  // dayLabel / recordTitle / content = 기본값. AI props로 덮어쓰기 가능
  log_01: {
    icon: "📝",
    title: "누군가의 일기 - 1일 차",
    desc: "객실 구석에서 발견된 일기장 조각",
    type: "paper",
    dayLabel: "1일 차",
    recordTitle: "누군가의 기록",
    content:
      "완벽한 휴가. 눈부신 태양 아래 샴페인은 끝없이 제공되고, 사람들의 웃음소리로 떠들썩한 아침이다.",
  },
  log_02: {
    icon: "📝",
    title: "누군가의 일기 - 2일 차",
    desc: "수영장 근처 벤치에 떨어져 있던 조각",
    type: "wet_paper",
    dayLabel: "2일 차",
    recordTitle: "누군가의 기록",
    content:
      "수영장 물이 마치 탁한 심해처럼 바닥이 보이지 않는다. 수영장에 들어갔던 사람은 수면 위로 다시는 올라오지 않았다. 아무도 그를 신경 쓰지 않는다. 내가 점점 이상해지는 거 같아.",
  },
  log_03: {
    icon: "📝",
    title: "누군가의 일기 - 3일 차",
    desc: "직원 탈의실 캐비닛",
    type: "bloody_paper",
    dayLabel: "3일 차",
    recordTitle: "누군가의 기록",
    content:
      "오늘 밤 12시, 안개가 짙어지면 모두 '그것'을 맞이하러 간다. 나만 빼고. 나만 빼고. 눈이 마주치면 안 돼.",
  },
  // --- 기타 단서 ---
  log_203: {
    icon: "📝",
    title: "구겨진 메모",
    desc: "객실 203호에서 발견",
    type: "paper",
    dayLabel: "",
    recordTitle: "구겨진 메모",
    content:
      "옆방에서 밤새 벽을 긁는 소리가 난다. 시끄러워서 화를 내도 벽이 울리는 소리만 되돌아온다. 프론트에 연락해도 통화 중이라는 기계음만 반복된다.",
  },
  photo_205: {
    icon: "📷",
    title: "초점이 나간 사진",
    desc: "객실 205호 바닥에 떨어져 있던 사진",
    type: "photo",
    dayLabel: "",
    recordTitle: "초점이 나간 사진",
    content:
      "(어두운 객실 화장실 거울을 찍은 사진. 거울 속에 무언가의 실루엣이 흐릿하게 맺혀 있다.)",
  },
  log_salad: {
    icon: "🍴",
    title: "식당 검역 보고서",
    desc: "4F 레스토랑 샐러드바",
    type: "paper",
    dayLabel: "",
    recordTitle: "식당 검역 보고서",
    content:
      "식자재 오염. 폐기 요망. 고기에서 자꾸만 맥박이 뛰는 것처럼 움직인다. 주방장은 정상이라고 주장함.",
  },
  item_sofa: {
    icon: "🗝️",
    title: "낡은 열쇠",
    desc: "7F 라운지 소파 틈새",
    type: "item",
    dayLabel: "",
    recordTitle: "낡은 열쇠",
    content:
      "금속 재질의 열쇠. '기관실'이라는 긁힌 자국이 있다. 손에 쥐고 있으면 뼛속까지 시린 한기가 올라온다.",
  },
  // --- 임의 조사 연출 폴백 (AI가 recordTitle·entryBody 필수. 비우면 아래 최소값) ---
  clue_note: {
    icon: "📝",
    title: "메모",
    desc: "조사 중 발견",
    type: "paper",
    dayLabel: "",
    recordTitle: "메모",
    content: "",
  },
  clue_item: {
    icon: "🗝️",
    title: "소지품",
    desc: "조사 중 발견",
    type: "item",
    dayLabel: "",
    recordTitle: "소지품",
    content: "",
  },
  clue_photo: {
    icon: "📷",
    title: "사진",
    desc: "조사 중 발견",
    type: "photo",
    dayLabel: "",
    recordTitle: "사진",
    content: "",
  },
};

const DECK_PLAN = [
  { id: "12F", name: "브릿지 · 선장실" },
  { id: "10F", name: "야외 수영장 & 자쿠지" },
  { id: "9F", name: "갑판 산책로" },
  { id: "7F", name: "라운지 바" },
  { id: "4F", name: "레스토랑" },
  { id: "5-8F", name: "여객 객실 구역" },
].map((deck) => ({
  ...deck,
  locationLabel: `${deck.id} ${deck.name}`,
}));

/** events.location = 층 ID만 / 층+장소 병기 둘 다 매칭 */
function eventMatchesDeck(evLocation, deck) {
  const s = String(evLocation || "").trim();
  if (!s) return false;
  if (s === deck.id || s === deck.locationLabel) return true;
  if (s.startsWith(deck.id + " ") || s.startsWith(deck.id + "\u00a0")) return true;
  return false;
}

/** AI events 미전달 시 지도 아코디언 폴백 (층별 분위기) */
const DECK_AMBIENT_FALLBACK = {
  "12F": "조타실 문 너머로 바다가 보인다.",
  "10F": "수영장에서 풀 파티가 열리고 있는 것 같다.",
  "9F": "갑판에 나가볼까? 바닷바람이 기분 좋게 불고 있다.",
  "7F": "라운지에서 음악이 흘러나오고 있다.",
  "4F": "레스토랑에서 식사하는 소리가 들린다.",
  "5-8F": "복도에 승객들과 승무원이 바쁘게 오간다.",
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
  dayLabel = "", // 라벨: "3일 차" 등 (비우면 ITEM_DB 기본)
  recordTitle = "", // 라벨: "누군가의 기록" 등
  entryBody = "", // 라벨: 일기/단서 본문 (비우면 ITEM_DB content)

  // Ending Props
  title = "",
  verdict = "",
  body = "",
}) {
  const [activeTab, setActiveTab] = React.useState("map");
  const [viewItem, setViewItem] = React.useState(null);
  const [expandedDeck, setExpandedDeck] = React.useState(null);
  const [isRolling, setIsRolling] = React.useState(false);
  const [showResult, setShowResult] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

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
              {DECK_PLAN.map((deck) => {
                const deckEvents = events.filter((e) =>
                  eventMatchesDeck(e.location, deck),
                );
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
                      style={{ ...mapBtnStyle, cursor: "pointer" }}
                      onClick={() =>
                        setExpandedDeck(
                          expandedDeck === deck.id ? null : deck.id,
                        )
                      }
                    >
                      <span style={deckNumStyle}>{deck.id}</span>
                      <span style={{ flex: 1, textAlign: "left" }}>
                        {deck.name}
                      </span>
                      <span
                        style={{
                          ...indicatorStyle,
                          transition: "transform 0.2s",
                          transform:
                            expandedDeck === deck.id
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                        }}
                      >
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
                          deckEvents.map((ev, idx) => {
                            const sceneText =
                              ev.scene || ev.ambient || (!ev.name && ev.action);
                            if (!ev.name && sceneText) {
                              return (
                                <div
                                  key={idx}
                                  style={{
                                    padding: "6px 0",
                                    borderBottom:
                                      idx < deckEvents.length - 1
                                        ? "1px solid rgba(255,255,255,0.05)"
                                        : "none",
                                  }}
                                >
                                  {sceneText}
                                </div>
                              );
                            }
                            return (
                              <div
                                key={idx}
                                style={{
                                  padding: "6px 0",
                                  borderBottom:
                                    idx < deckEvents.length - 1
                                      ? "1px solid rgba(255,255,255,0.05)"
                                      : "none",
                                }}
                              >
                                <span
                                  style={{
                                    color: "#d4b86a",
                                    fontWeight: "bold",
                                    marginRight: "8px",
                                  }}
                                >
                                  {ev.name}
                                </span>
                                {ev.mood ? <span>{ev.mood}</span> : null}
                                {ev.action ? (
                                  <>
                                    {ev.mood ? (
                                      <span
                                        style={{
                                          margin: "0 6px",
                                          color: "#5a6578",
                                        }}
                                      >
                                        |
                                      </span>
                                    ) : null}
                                    <span>{ev.action}</span>
                                  </>
                                ) : null}
                              </div>
                            );
                          })
                        ) : (
                          <div style={{ padding: "4px 0" }}>
                            {DECK_AMBIENT_FALLBACK[deck.id]}
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
                <div
                  style={{
                    background: "rgba(0,0,0,0.3)",
                    border: "1px solid #d4b86a",
                    borderRadius: "8px",
                    padding: "16px",
                    position: "relative",
                  }}
                >
                  <button
                    onClick={() => setViewItem(null)}
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      background: "transparent",
                      border: "none",
                      color: "#8a7f6e",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                  >
                    ✖
                  </button>
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                    {viewItem.icon}
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#f0e4c4",
                      marginBottom: "4px",
                    }}
                  >
                    {viewItem.title}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#8a7f6e",
                      marginBottom: "16px",
                    }}
                  >
                    {viewItem.desc}
                  </div>

                  {/* 종이/일기장일 경우 찢어진 느낌의 디자인 적용 */}
                  {viewItem.type.includes("paper") ? (
                    <div
                      style={{
                        background:
                          viewItem.type === "bloody_paper"
                            ? "rgba(92, 36, 56, 0.1)"
                            : "rgba(245, 240, 230, 0.05)",
                        borderLeft:
                          viewItem.type === "bloody_paper"
                            ? "3px solid #8b1a1a"
                            : "3px solid #8a7f6e",
                        padding: "16px",
                        fontFamily: '"Nanum Myeongjo", serif',
                        fontSize: "14px",
                        lineHeight: "1.8",
                        color:
                          viewItem.type === "wet_paper"
                            ? "rgba(245, 240, 230, 0.6)"
                            : "#d1d8e5",
                        textShadow:
                          viewItem.type === "wet_paper"
                            ? "0 0 2px rgba(245, 240, 230, 0.4)"
                            : "none",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {viewItem.content}
                    </div>
                  ) : viewItem.type === "photo" ? (
                    <div
                      style={{
                        background: "#000",
                        padding: "12px",
                        border: "8px solid #fff",
                        borderBottom: "32px solid #fff",
                        fontFamily: '"Nanum Myeongjo", serif',
                        fontSize: "12px",
                        color: "#333",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          height: "120px",
                          background: "linear-gradient(45deg, #111, #333)",
                          marginBottom: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#555",
                        }}
                      >
                        [ 흐릿한 형상 ]
                      </div>
                      {viewItem.content}
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: "12px",
                        background: "rgba(255,255,255,0.02)",
                        fontSize: "13px",
                        color: "#a6b0c2",
                        lineHeight: "1.6",
                      }}
                    >
                      {viewItem.content}
                    </div>
                  )}
                </div>
              ) : /* 아이템 목록 모드 */
              inventoryIds.length > 0 ? (
                inventoryIds.map((id) => {
                  const item = ITEM_DB[id];
                  if (!item) return null;
                  return (
                    <div
                      key={id}
                      onClick={() => setViewItem(item)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px",
                        background: "rgba(0,0,0,0.2)",
                        borderLeft: "2px solid #d4b86a",
                        cursor: "pointer",
                        transition: "background 0.2s",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(212, 184, 106, 0.1)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background = "rgba(0,0,0,0.2)")
                      }
                    >
                      <span style={{ fontSize: "16px" }}>{item.icon}</span>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: "11px", color: "#8a7f6e" }}>
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div
                  style={{
                    fontSize: "13px",
                    color: "#8a7f6e",
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  아직 발견된 단서가 없습니다.
                </div>
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
    const targetId = id || "log_01";
    const item = ITEM_DB[targetId];
    if (!item) return null;

    // AI 라벨 우선, 없으면 DB 기본값
    const resolvedDay = dayLabel || item.dayLabel || "";
    const resolvedTitle =
      recordTitle || item.recordTitle || item.title || "누군가의 기록";
    const resolvedBody = entryBody || item.content || "";
    const headerLine = resolvedDay
      ? `${resolvedDay} · ${resolvedTitle}`
      : resolvedTitle;

    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "500px",
          height: "560px",
          margin: "40px auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          perspective: "1600px",
        }}
      >
        {/* 다이어리 컨테이너 (위에서 내려다보는 시점) */}
        <div
          style={{
            position: "relative",
            width: "360px",
            height: "480px",
            transformStyle: "preserve-3d",
            boxShadow: isOpen
              ? "12px 24px 32px rgba(0,0,0,0.4)"
              : "24px 32px 48px rgba(0,0,0,0.6)",
            transition: "box-shadow 0.6s ease-in-out",
            borderRadius: "8px 12px 12px 8px",
          }}
        >
          {/* 1. 다이어리 표지 (Cover) */}
          <div
            onClick={() => setIsOpen(true)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                item.type === "photo"
                  ? "transparent"
                  : "linear-gradient(to right, #111 0%, #222 5%, #151515 100%)", // 고급스러운 검은 가죽 느낌
              borderRadius: "8px 12px 12px 8px",
              border:
                item.type === "photo"
                  ? "none"
                  : "1px solid rgba(255,255,255,0.05)",
              borderLeft: item.type === "photo" ? "none" : "6px solid #050505", // 굵은 책등
              transformOrigin: "left center",
              transform: isOpen ? "rotateY(-180deg)" : "rotateY(0deg)", // 180도로 완전히 넘김
              opacity: isOpen ? 0 : 1, // 넘어가면 투명해져서 안 보임
              transition:
                "transform 0.8s cubic-bezier(0.3, 0.0, 0.1, 1), opacity 0.8s cubic-bezier(0.3, 0.0, 0.1, 1)",
              zIndex: 10,
              cursor: isOpen ? "default" : "pointer",
              display: item.type === "photo" ? "none" : "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: isOpen ? "none" : "auto",
              boxShadow: "inset -8px 0 20px rgba(0,0,0,0.5)",
            }}
          >
            {/* 표지 장식/텍스트 */}
            {!isOpen && (
              <div
                style={{
                  width: "70%",
                  height: "80%",
                  border: "1px solid rgba(212, 184, 106, 0.2)",
                  borderRadius: "4px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(135deg, rgba(212,184,106,0.02) 0%, transparent 100%)",
                }}
              >
                <div
                  style={{
                    color: "#d4b86a",
                    fontSize: "11px",
                    letterSpacing: "0.4em",
                    marginBottom: "24px",
                    opacity: 0.8,
                  }}
                >
                  AURELIA CRUISE
                </div>
                <div
                  style={{
                    color: "#d4b86a",
                    fontSize: "22px",
                    fontFamily: '"Nanum Myeongjo", serif',
                    fontWeight: "bold",
                    textAlign: "center",
                    padding: "0 20px",
                  }}
                >
                  누군가의 기록
                </div>
                <div
                  style={{
                    marginTop: "40px",
                    color: "rgba(212,184,106,0.5)",
                    fontSize: "11px",
                    letterSpacing: "0.2em",
                    animation: "tdos-shine 2s infinite",
                  }}
                >
                  CLICK TO OPEN
                </div>
              </div>
            )}
          </div>

          {/* 2. 본문 내용 (단일 오른쪽 페이지 한 장) */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              borderRadius: "4px 12px 12px 4px",
              zIndex: 1,
              pointerEvents: isOpen ? "auto" : "none",
            }}
          >
            {item.type.includes("paper") ? (
              /* --- 다이어리 내지 (원본: 흰 줄노트 + 타공, 날짜/좌측그림자 없음) --- */
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background:
                    item.type === "wet_paper" ? "#e8ecef" : "#ffffff",
                  borderRadius: "4px 12px 12px 4px",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid rgba(0,0,0,0.08)",
                }}
              >
                {/* 좌측 스프링 타공 */}
                <div
                  style={{
                    position: "absolute",
                    top: "24px",
                    left: "10px",
                    bottom: "24px",
                    width: "20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    zIndex: 2,
                    pointerEvents: "none",
                  }}
                >
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={`right-hole-${i}`}
                      style={{
                        width: "12px",
                        height: "12px",
                        background: "#111",
                        borderRadius: "50%",
                        boxShadow:
                          "inset -2px 2px 4px rgba(0,0,0,0.8), 1px -1px 2px rgba(255,255,255,0.8)",
                      }}
                    />
                  ))}
                </div>

                {item.type === "wet_paper" && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      pointerEvents: "none",
                      zIndex: 1,
                      background:
                        "linear-gradient(180deg, rgba(90,110,130,0.06) 0%, transparent 40%)",
                    }}
                  />
                )}

                {/* 날짜: 우측 정렬 + 본문과 띄움. 우측 패딩으로 잘림 방지 */}
                <div
                  style={{
                    boxSizing: "border-box",
                    flexShrink: 0,
                    width: "100%",
                    padding: "48px 48px 0 48px",
                    marginBottom: "36px",
                    position: "relative",
                    zIndex: 5,
                    fontFamily: '"Nanum Myeongjo", "Batang", serif',
                    fontSize: "13px",
                    lineHeight: "1.5",
                    color: "rgba(0,0,0,0.5)",
                    letterSpacing: "0.04em",
                    textAlign: "right",
                  }}
                >
                  {headerLine}
                </div>

                {/* 본문: 좌측. 가로줄은 본문 background만(absolute 오버레이=글자 덮임 원인) */}
                <div
                  style={{
                    boxSizing: "border-box",
                    flex: 1,
                    minWidth: 0,
                    minHeight: 0,
                    width: "auto",
                    margin: "0 48px 40px 48px",
                    padding: 0,
                    position: "relative",
                    zIndex: 5,
                    fontFamily: '"Nanum Myeongjo", "Batang", serif',
                    fontSize: "15px",
                    lineHeight: "32px",
                    color:
                      item.type === "wet_paper"
                        ? "rgba(30,40,50,0.85)"
                        : "#222",
                    textAlign: "left",
                    whiteSpace: "pre-wrap",
                    wordBreak: "keep-all",
                    overflowWrap: "break-word",
                    overflowX: "hidden",
                    overflowY: "auto",
                    backgroundImage:
                      "repeating-linear-gradient(to bottom, transparent 0, transparent 31px, rgba(0,0,0,0.07) 31px, rgba(0,0,0,0.07) 32px)",
                    backgroundAttachment: "local",
                  }}
                >
                  {resolvedBody}
                </div>
              </div>
            ) : item.type === "photo" ? (
              /* --- 폴라로이드 사진 렌더링 --- */
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    background: "#fdfdfd",
                    padding: "16px 16px 64px 16px",
                    borderRadius: "2px",
                    boxShadow:
                      "0 24px 48px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,0,0,0.03)",
                    width: "280px",
                    transform: "rotate(-3deg)",
                    transition: "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform =
                      "rotate(0deg) scale(1.05)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "rotate(-3deg) scale(1)")
                  }
                >
                  <div
                    style={{
                      height: "260px",
                      background:
                        "linear-gradient(45deg, #050505 0%, #151515 100%)",
                      marginBottom: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "inset 0 0 40px rgba(0,0,0,0.9)",
                    }}
                  >
                    <span
                      style={{
                        color: "#333",
                        fontFamily: '"Nanum Myeongjo", serif',
                        filter: "blur(1.5px)",
                      }}
                    >
                      [ 형태를 알 수 없는 그림자 ]
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: '"Nanum Myeongjo", serif',
                      fontSize: "13px",
                      color: "#111",
                      textAlign: "center",
                      opacity: 0.85,
                      lineHeight: "1.6",
                    }}
                  >
                    {resolvedBody}
                  </div>
                </div>
              </div>
            ) : (
              /* 기타 아이템 렌더링 (사물 등) */
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    padding: "32px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(212,184,106,0.2)",
                    borderRadius: "8px",
                    color: "#a6b0c2",
                    fontSize: "15px",
                    lineHeight: "1.8",
                    textAlign: "center",
                    boxShadow: "0 16px 32px rgba(0,0,0,0.5)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "48px",
                      marginBottom: "16px",
                      filter: "drop-shadow(0 0 12px rgba(212,184,106,0.3))",
                    }}
                  >
                    {item.icon}
                  </div>
                  <div
                    style={{
                      color: "#d4b86a",
                      fontSize: "18px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}
                  >
                    {resolvedTitle}
                  </div>
                  <div>{resolvedBody}</div>
                </div>
              </div>
            )}
          </div>
        </div>
        <style>{`
          @keyframes tdos-fade-in {
            from { opacity: 0; transform: translateX(10px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}</style>
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

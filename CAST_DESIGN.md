# cast.html 디자인 스펙 (코드 수정 시 참고용)

> 코드가 아닌 **디자인·연출 규칙**만 정리. 구현은 `cast.html` · `site.css` · `cast-ticket.js`.

---

## 1. 페이지 구조 (세로 흐름)

```
[nav]
[초대장 헤더 — invite-frame, 장식만]
[승선 명단 — cast-roster, 좌 portrait / 우 bio]
[footer]
```

- 본문에 **2열(티켓+명단)** 배치 금지.
- `index.html`, `guide.html` 레이아웃·nav 건드리지 않음.

---

## 2. 승선 플로우 (JS)

| 단계 | UI | 비고 |
|------|-----|------|
| 첫 방문 | `#embark-gate` → 승선하기 | |
| 2단계 | `#pass-overlay` + `#cruise-pass` | **여기서만** 스텁 뜯기 |
| 확인 후 | `#cast-page` 표시 | `sessionStorage` `tdos-cast-boarded` = `1` |
| 재방문 | 본문만 | 오버레이 스킵 |

- 초대장 헤더(`invite-frame`)에는 **승선 버튼 없음**.
- 본문 하단 **승선권 확인 버튼 없음** (오버레이에만).
- 중복 버튼(승선하기 + 승선권 확인 + 본문 버튼) 금지.

---

## 3. 초대장 헤더 (`invite-frame`)

| 항목 | 규칙 |
|------|------|
| 역할 | VIP 초대 **장식 프레임** — 티켓 아님 |
| 펀치홀 | **없음** |
| 뜯기·바코드 | **없음** |
| 제목 | `THREE DAYS OF SUN` — 금박 그라데이션 + `foilShimmer` |
| 부제 | `You're Cordially Invited` — 좌측 정렬, 제목과 나란히 |
| 문구 | HTML 원문 그대로, 임의 문구(Aurelia, A뱃지 등) 추가 금지 |
| 서명 | `— THREE DAYS OF SUN` |

색: deep navy/cyan 배경 + `--champagne` 금테.

---

## 4. 승선권 오버레이 (`cruise-pass`)

| 항목 | 규칙 |
|------|------|
| 구성 | 스텁 + 본문 **2부만** (3열·톱니 tear 금지) |
| 제목 | `THREE DAYS OF SUN` — **금박** (네이비 단색 금지) |
| 이벤트 줄 | `Evening Reception · Deck 7 Lounge` — **박스 없이** plain text |
| 비율 | 임의로 크기·비율 변경 금지 |
| 펀치홀 | 승선권 본문에만 (티켓 연출) |

### 바코드 (스텁 하단만)

- `cruise-pass__stub-foot` 맨 아래, **margin/padding 0**
- SVG **가로** 바코드 (`viewBox` 가로형, `height: 18px`)
- 세로 창살 막대(전체 높이 세로줄) 금지

---

## 5. 승선 명단 (`cast-roster`)

### 레이아웃 (확정)

- **세로 6섹션**, 각 섹션 = **좌 큰 portrait + 우 설명**
- 최종은 **좌우 섹션** 유지 (가로 카드 그리드 금지)

### portrait 프레임

- `aspect-ratio: 4/5`, `min-height` 크게
- **전체** 얇은 금 테두리 (`border: 1px solid champagne`)
- 중앙 로마자 워터마크 I · II · III · IV (흐린 금색)
- `corner-gold` span만으로 프레임 대체 **금지**
- 좌측 선 한 줄(`border-left`만) **금지**

### 직함·텍스트

| # | 이름 (`cast-profile__post`) | role | 출처 |
|---|---------------------------|------|------|
| I | 올리비아 | Captain | `index.html` roster · `assets/cruise/` |
| II | 설하영 | Crew | 동일 |
| III | 크리세이스 | Suite Guest | 동일 |
| IV | 리지 | Lifeguard | 동일 |
| V | 레이나 | Ocean View | 동일 |
| VI | 크리스티안 | Balcony Guest | 동일 |

- portrait img: `https://bi.pharang.workers.dev/assets/cruise/{이름}.png`  
  (로컬: `lorebox-worker/public/assets/cruise/` — **경계의문 `characters/` 아님**)

- `인물명 미정` 등 **placeholder 금지**
- Deck 9, Lobby 등 **임의 부가 라벨 금지**
- 직함 색: `--champagne` / `--champagne-light` ( **`--sunset` 주황 금지** )
- 직함 크기: 최소 12px 이상, 읽히게 (`clamp` 권장)

### 설명 (`cast-profile__desc`)

- HTML 원문 유지, serif, champagne-light 톤

---

## 6. 색·타이포 (theme-c)

| 용도 | 토큰 |
|------|------|
| 배경 | navy deep + teal radial |
| 금테·강조 | `--champagne`, `--champagne-light` |
| 직함 라벨 | champagne (sunset 아님) |
| 본문 | `rgba(240, 228, 196, 0.82)` |

---

## 7. 금지 사항 (지적 누적)

- 조잡한 CSS 박스 + corner span만 붙이고 끝
- 초대장을 티켓으로 합치기
- 티켓 비율·하단 라벨 박스 임의 변경
- 임의 인물명·회사명·뱃지 문구
- 관련 없는 파일 대량 수정
- git 없이 롤백 기대 — **로컬 파일 상태가 유일한 기준**

---

## 8. 파일 역할

| 파일 | 역할 |
|------|------|
| `cast.html` | 마크업·원문 |
| `site.css` | theme-c (`890`행~) 스타일 |
| `cast-ticket.js` | embark → pass → 본문 플로우 |
| `CAST_DESIGN.md` | 이 문서 (디자인만) |

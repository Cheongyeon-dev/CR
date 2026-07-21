# CR 에셋 코드 (폴더명 = 코드만)

## 캐릭터 RP — `cruise-page/raw/` 전용

| 코드 | 이름 |
|------|------|
| SL | 설하영 |
| KR | 크리스티안 |
| CH | 크리세이스 |
| RN | 레이나 |
| LZ | 리지 |
| OV | 올리비아 |

### 상황 `raw/{캐릭}/{코드}/`

| 코드 | |
|------|--|
| 1 | 기본 |
| 2 | 웃음 |
| 3 | 슬픔 |
| 4 | 놀람 |
| 5 | 충격 |
| 6 | 설렘 |
| 7 | 광기 |
| 8 | 광기(바다 입수) |
| A1 | 갑판 |
| A2 | 갑판(저녁) |
| A3 | 식당 |
| A4 | 아이스크림 |
| A5 | 소파 |
| A6 | 라운지 파티 |
| B1 | 해안산책 |
| B2 | 해변(비치베드) |
| B3 | 수족관 |
| N | 크리세이스 전용(바다의 님프) |
**URL:** `bi.pharang.workers.dev/c/{캐릭}/{상황}` → CR Pages webp

---

## 배경 · 홈 캐스트 · UI — `lorebox-worker/public/assets/` (raw와 분리)

| 코드 | 용도 | 넣을 경로 |
|------|------|-----------|
| C1 | 객실 배경 | `public/assets/bg/C1.webp` |
| C2 | 수영장 | `public/assets/bg/C2.webp` |
| C3 | 바다(폭풍) | `public/assets/bg/C3.webp` |
| (캐스트) | 홈 인물 | `public/assets/characters/{코드}-full.webp` 등 |

**URL:** `bi.pharang.workers.dev/assets/bg/C1.webp` — 홈페이지는 이 링크만 걸면 됨.

convert·scrub 후 **wrangler deploy (bi)**. CR push 아님.

---

## 파이프라인
해당 문서만 보고 작업 절대 금지 AGENT_관련 리드미랑 파이프라인 필수 참고 

**캐릭터 RP**
```
raw/{SL}/{1}/ PNG
→ convert --cruise → scrub --cruise
→ temp 스테이징 → CR push (webp만) → deploy bi (/c/)
```

`raw/`·`out/` = 로컬 전용. **GitHub(CR) 레포에 raw/out 직접 push 금지.**

**배경·UI·홈**
```
public/assets/… PNG
→ scrub --root lorebox-worker/public/assets --in-place
→ deploy bi (/assets/…)
```

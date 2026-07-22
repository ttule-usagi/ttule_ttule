 <a href="https://ttulettule.party/">
<img alt="ttulettule logo" src="ttule_ttule/public/md-source/logo.jpg" height="50">
    </a>

## 프로젝트 소개

뚤레뚤레는 장소 저장부터 여행 계획 작성까지 한곳에서 관리할 수 있는 여행
계획 협업 웹 서비스입니다.

Google Places API는 검색에만 활용하고, 조회한 장소는 자체 PostgreSQL DB에 정규화하여 관리하도록 설계했습니다. 이를 통해
Google Maps Platform의 데이터 사용 정책을 최대한 준수하면서도 API호출 횟수와 외부 의존성을 줄였으며, 저장된 장소를 여행 계획·리스트·협업기능에서 일관되게 활용할 수 있는 구조를 구축했습니다.

현재 PC 환경을 기준으로 1차 MVP 개발을 진행하고 있으며, 이후 여행 핸드북 이미지 출력, 오프라인 모드, 체크리스트 기능 등을 추가할 예정입니다.

### 작업기간

2026/3/14 ~ 작업중

<br/>

## 주요 기술 요약

<details>
<summary><strong>컴파운드 패턴 기반 공용 모달 및 드롭다운 메뉴 설계</stong></summary>

- Zustand 기반 전역 모달 스토어와 컴파운드 컴포넌트 패턴으로 구현하여 모달 전용 컴포넌트(Modal/ModalBox/ModalContent/ModalTitle 등)를 조합 가능한 구조로 설계
- 드롭다운 메뉴는 별도 DropdownContext로 열림 상태를 관리하고, Floating UI로 화면 경계에 따라 위치가 자동으로 조정되도록 구현
- 로비 화면의 여행 아이템, 사이드바 프로필, 초대 링크 입력 모달 등 여러 화면에 공통 적용해 일관된 상호작용 패턴 확보

</details>

<details>
<summary><strong>렌더링 & 데이터 페칭</strong></summary>

- TanStack Query의 prefetchInfiniteQuery와 HydrationBoundary를 활용하여 SSR 단계에서 초기 데이터를 프리패치함으로써, 클라이언트 사이드 데이터 호출 대기 시간을 제거하고 사용자가 화면 로드 시점부터 인터랙션할 수 있도록 구조화
- Next.js App Router의 서버·클라이언트 실행 경계를 고려하여 Route Handler 기반 데이터 요청 구조를 설계하고, SSR/CSR 환경에서 일관된 인증 및 데이터 페칭 흐름을 구축

</details>

<details>
<summary><strong>오프셋 기반 무한스크롤과 useSuspenseQuery + ErrorBoundary 조회 로직 구성</stong></summary>

- 스켈레톤 없이 초기 데이터는 prefetch로 채우고, 이후 더보기 페칭만 useSuspenseInfiniteQuery로 처리하는 구조로 초기 로딩과 추가 로딩의 책임을 분리
- QueryBoundary(Suspense + ErrorBoundary)를 적용해 추가 데이터 조회 중 발생하는 에러를 별도로 캐치하고 사용자에게 노출
- 초기 로딩은 서버에서, 추가 조회는 클라이언트 상태로 나눔으로써 불필요한 재조회 없이 자연스러운 스크롤 경험 구성

</details>

<details>
<summary><strong>공유 기능 설계 및 구현</stong></summary>

- 보기용/수정용 초대 링크 생성 기능과, 공유 옵션 모달에서 공개/비공개 설정에 따라 분기되는 초대 로직 구현 (resourceType으로 장소 리스트/계획을 구분하여 공용으로 사용 가능하도록 설계)
- 초대 링크 접속 시 토큰 검증 → 참여 등록 → 권한 검증 순서로 처리되도록 서버 컴포넌트 전용 유틸 함수를 설계하여, 수정 가능 유저와 보기용 접근 유저의 일관성 있는 접근 처리 흐름을 구축
- 토큰 검증 로직과 권한 검증 로직을 완전히 분리함으로써, 초대 컴포넌트를 통한 진입과 URL 직접 접근(딥링크) 케이스 모두에서 세션 유무/토큰 유효성에 따른 에러 모달 노출 및 리다이렉트 처리가 일어나도록 구조화

</details>

<details>
<summary><strong>인증 및 권한 관리</stong></summary>

- Auth.js v5와 Supabase를 연동한 httpOnly 쿠키 기반 인증 구조를 설계하고, JWT 알고리즘 호환성(ECC/HS256) 문제를 분석·해결하여 안정적인 인증 체계를 구축

</details>

<details>
<summary><strong>검색 UX 구현</stong></summary>

- LIKE 기반 검색의 성능 한계를 개선하기 위해 PostgreSQL pg_trgm GIN Index와 Generated Column을 적용하여 한국어 자동완성 검색을 최적화
- 한국어 IME 조합 입력(isComposing), 키보드 탐색, URL 상태 동기화를 지원하는 AutoComplete 컴포넌트
  를 구현하여 검색 사용성을 개선

</details>

<br/>

## Skills

![Next JS](https://img.shields.io/badge/NextJs-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white)
![Auth.js](https://img.shields.io/badge/Auth.js-%234DC730.svg?style=for-the-badge&logoColor=white)
![Google Cloud](https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white)

## 팀원 소개

<div align="center">
  
|<img src="\public\md-source\profile_tomato.jpg" width="100" height="100"/>|<img src="\public\md-source\profile_JOEIH.jpg" width="100" height="100"/>|
|:---:|:---:|
| [최수진](https://github.com/tomatto0) | [조현진](https://github.com/JOEIH) |

</div>

</br>

<!-- ## Flow chart

<details>
<summary>게시글 작성페이지 유저플로우</summary>

![flowImg](ronka-mirapri-community/public/readme/write-userflow.jpg)

</details>

<details>
<summary>사용자 인증 유저 플로우 </summary>

![flowImg](ronka-mirapri-community/public/readme/auth-userflow.jpg)

</details> -->

## 📙 기획 문서

<details>
<summary>프로젝트 노션</summary>

[🔗 Notion 바로가기](https://ronkacloset.notion.site/Beta-16dd5a9efb39804a8e52dc6c8328e950?pvs=4)

[![Notion](\public\md-source\notion.jpg)](https://app.notion.com/p/291726cada088276a06481fe27ec1a43?source=copy_link)

</details>

<details>
<summary>FIGMA</summary>

[🔗 FIGMA 바로가기](https://www.figma.com/design/nya2tGKklbyEdpl0GYHM46/ttulettule-%ED%99%94%EB%A9%B4%EA%B8%B0%ED%9A%8D%EC%84%9C-%EC%99%B8%EB%B6%80%EA%B3%B5%EA%B0%9C%EC%9A%A9?node-id=0-1&t=kL2pYKHbW4WKgUYu-1)

[![피그마 화면계획서](\public\md-source\figma.jpg)](https://www.figma.com/design/nya2tGKklbyEdpl0GYHM46/ttulettule-%ED%99%94%EB%A9%B4%EA%B8%B0%ED%9A%8D%EC%84%9C-%EC%99%B8%EB%B6%80%EA%B3%B5%EA%B0%9C%EC%9A%A9?node-id=0-1&t=kL2pYKHbW4WKgUYu-1)

</details>

</br>

<!-- ## 페이지 주요 기능

### GALLERY

![gallery-Img](ronka-mirapri-community/public/readme/gallery.gif)

- 필터기능을 사용해서 원하는 종족, 직업, 아이템에 맞는 코디만 볼 수 있습니다.
- 주간인기 TOP 10 아이템 리스트를 롤링으로 제공하고, 클릭시 해당 아이템을 사용한 코디만 볼 수 있습니다.
- sessionStorage를 활용해 필터상태를 저장하여 새로고침 후에도 설정한 필터링 상태가 유지되게 하였습니다.

</br>

### GENERATOR

![generator-Img](ronka-mirapri-community/public/readme/generator.gif)

- 스크린샷과 함께 장착한 아이템을 하나의 이미지(jpg, png중 선택)로 저장할 수 있습니다.
- 하단의 에디터를 사용해 스타일 노트를 작성해 나만의 룩북을 안전하게 백업할 수 있습니다.
- IndexedDB를 통해 이미지와 에디터에 입력된 정보를 관리해 사용자가 화면을 새로고침하거나 닫아도 데이터가 유지됩니다.

</br>

### ABOUT

![generator-Img](ronka-mirapri-community/public/readme/about.gif)

- 사이트의 운영정책 및 이용가이드와 간단한 사이트소개

</br>

### MYPAGE

![generator-Img](ronka-mirapri-community/public/readme/mypage.gif)

- 로그인시에 접근할 수 있는 개인페이지로, 작성한 글과 좋아요한 코디 모아보기, 회원정보 수정이 가능합니다.
- 자신의 게시글이 받은 총 좋아요수도 상단에서 확인가능합니다. -->

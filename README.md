# project-flow-manager

`project-flow-manager`는 GitHub Project로 프로젝트를 관리할 때 사용하면 좋을 액션 모음입니다. 현재는 이슈 생성과 머지까지 구현했지만 앞으로 리뷰어 등록, 머지 이후 액션, 릴리즈 노트 자동작성 등을 만들어보고 싶습니다.

| 액션 이름                                                                                                             | 설명                                                                                                   |
| --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [`project-flow-add-issue-to-project`](https://github.com/marketplace/actions/project-flow-add-issue-to-project)       | 이슈 생성 시 지정된 GitHub Project에 이슈를 자동으로 추가하며 지정한 특정 상태(Todo)로 업데이트합니다. |
| [`project-flow-start-issue`](https://github.com/marketplace/actions/project-flow-start-issue)                         | 브랜치 생성 시 관련 이슈의 상태를 프로젝트에서 지정한 특정 상태(In Progress)로 이동시킵니다.           |
| [`project-flow-sync-issue-meta-to-pr`](https://github.com/marketplace/actions/project-flow-sync-issue-meta-to-pr)     | PR 생성 시 이슈의 메타 정보(레이블, 마일스톤 등)를 복사하고 PR과 이슈를 특정 상태로 업데이트합니다.    |
| [`project-flow-close-issue-on-pr-merge`](https://github.com/marketplace/actions/project-flow-close-issue-on-pr-merge) | PR이 머지되면 관련된 이슈를 자동으로 Close 합니다.                                                     |

---

## 사용 방법

액션들을 차례대로 사용하면 이슈부터 PR까지의 과정을 자동화할 수 있습니다:

1. 이슈 생성 → 프로젝트에 자동 등록, `Todo`로 변경 (다른 상태 가능)
2. 이슈 기반 브랜치 생성 → 이슈 상태를 `In Progress`로 변경 (다른 상태 가능)
3. PR 생성 → 이슈 메타데이터(레이블, 마일스톤) PR에 복사 및 이슈와 PR 지정한 상태로 변경 (ex: `In Review`)
4. PR 머지 → 이슈 Close (default 브랜치로 merge가 아니어도 작동)

---

## 개발 비하인드

### 불일치와 수작업의 불편함..

프로젝트 일정 관리 도구로 github project를 적극 활용해봤습니다. 데일리스크럼, 개발회의를 하며 작업 현황을 github project의 칸반보드를 보면서 파악했기 때문에 개발을 진행하며 보드 상태를 최신화해주는 것이 중요했습니다.

그러나 github project를 사용하면서 아래와 같은 불일치와 불편함이 계속 발생했습니다..

- 이슈에서 브랜치를 만들어 작업을 시작해도 이슈가 Todo로 남아있는 현상
- PR을 작성할 때 자동으로 프로젝트에 추가되지 않아 누락되어 파악이 되지 않았던 현상
- PR이 머지됐지만 관련 이슈가 닫히지 않아 해결된 이슈인지 헷갈리는 현상
- PR을 만든 후 이슈에 설정한 레이블, 마일스톤, 프로젝트를 일일이 수작업으로 등록해주는 불편함

그래서 이를 자동화한다면 수작업의 귀찮음을 해결할 수도 있고 프로젝트 현황을 파악할 때 일관성도 보장받을 수 있을 것 같아 워크플로우를 만들어서 자동화보니 너무 편했고 팀 내에서도 정말 만족하며 사용했습니다. 이를 이 프로젝트 내에서만 사용하지 않고 다른 곳에서도 적용해보고 싶기도 했으며, github project를 사용해서 프로젝트를 관리하는 다른 팀도 도움이 될 수 있을 것 같아 github action으로 만들어봤습니다.

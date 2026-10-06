export const EMAIL = ['1425514532', 'qq.com'].join('@')

export type WorkKind = 'live' | '3d'

export interface Work {
  slug: string
  title: string
  alias?: string
  kind: WorkKind
  vertical: boolean
  released: boolean
  duration: string
  spec: string
}

export const WORKS: Work[] = [
  { slug: 'guichao', title: '归巢：濠江海产女王', kind: 'live', vertical: true, released: true, duration: '2:25', spec: '544 × 960' },
  { slug: 'shenzhen', title: '1995，我在深圳缝出好日子', kind: 'live', vertical: true, released: true, duration: '1:47', spec: '720 × 1280' },
  { slug: 'nvzongcai', title: '女总裁捡漏', kind: 'live', vertical: true, released: false, duration: '2:17', spec: '544 × 960' },
  { slug: 'zuojing', title: '作精', kind: 'live', vertical: true, released: false, duration: '2:57', spec: '544 × 960' },
  { slug: 'goudao', title: '苟道长生', kind: '3d', vertical: false, released: false, duration: '3:02', spec: '960 × 544' },
  { slug: 'caifa', title: '财阀太子爷', kind: '3d', vertical: false, released: false, duration: '1:50', spec: '1280 × 720' },
  { slug: 'museum', title: '博物馆', kind: '3d', vertical: false, released: false, duration: '2:26', spec: '960 × 544' },
  { slug: 'maopai', title: '拜金冒牌货', kind: '3d', vertical: false, released: false, duration: '1:37', spec: '1280 × 720' },
]

export const KIND_LABEL: Record<WorkKind, string> = {
  live: '竖屏真人风格',
  '3d': '3D 精品漫',
}

export const STATS = [
  { value: 8, suffix: '', label: '部作品入选本作品集', note: '竖屏真人风格 × 4 · 3D 精品漫 × 4' },
  { value: 1500, suffix: '万', label: '红果最高热度', note: '上架作品热度区间 1000 ~ 1500 万' },
  { value: 120, suffix: 'min', label: '长篇级体量', note: '多部 120 分钟级 AI 漫剧长篇' },
  { value: 7, suffix: '天', label: '最快交付一部长篇', note: '13 人团队 · 7 视频生成 / 3 生图' },
  { value: 32, suffix: '条', label: '自动化半成品成片', note: '单条人工投入仅 8 分钟' },
  { value: 12, suffix: '¥', label: '单条 API 成本', note: '选题到可编辑初稿 25 分钟' },
]

export const PROCESS = [
  {
    no: '01',
    en: 'Breakdown',
    title: '脚本拆解',
    text: '把长篇脚本拆成可分配、可版本管理的镜头任务，让 13 人团队并行制作而不互相踩脚。',
  },
  {
    no: '02',
    en: 'Storyboard',
    title: '分镜 · 镜头语言',
    text: '为竖屏真人风格与 3D 精品漫两条视觉线，分别制定风格基调、角色与画面一致性标准。',
  },
  {
    no: '03',
    en: 'Strategy',
    title: '生成策略',
    text: '按动作、情绪、转场等镜头类型制定差异化的生成与重试策略，控制生成成本与耗时。',
  },
  {
    no: '04',
    en: 'Safeguard',
    title: '关键镜头兜底',
    text: '高光与转折镜头由人工介入调整，保证成片不会因为生成的随机性而掉线。',
  },
  {
    no: '05',
    en: 'Final Cut',
    title: '剪辑 · 质检',
    text: '把控剪辑节奏、配乐与整体质检标准，最快 7 天交付一部 120 分钟级长篇。',
  },
]

export const PROJECTS = [
  {
    no: '01',
    title: 'Codex 自动剪辑',
    en: 'Semi-automated video line',
    role: '架构设计与实现',
    tags: ['Codex / Agent Skills', 'Whisper', 'FFmpeg', 'Remotion', 'Python'],
    summary:
      '把「文案 → 配音 → 分镜 → 画面 → 剪辑 → 成片」重构为可复现、可校验、可批量的半自动生产线。每一步都落盘为显式中间产物，支持单点重跑与断点续跑，人工只保留选题与终审。',
    metrics: [
      ['32', '条成片'],
      ['25 min', '选题到初稿'],
      ['8 min', '人工投入'],
      ['≈ ¥12', '单条成本'],
    ],
  },
  {
    no: '02',
    title: '个人自媒体账号运营',
    en: 'Solo multi-platform channel',
    role: '内容运营独立负责人',
    tags: ['抖音', '小红书', 'YouTube', 'AI 二创', '数据复盘'],
    summary:
      '从零独立运营多平台账号，结合热点 IP 的热度窗口做 AI 二创选题。自建多平台改写规则，把各平台字数、格式、语气约束结构化，单篇适配从小时级压缩到分钟级。',
    metrics: [
      ['100万+', '抖音累计播放'],
      ['1.2万', '抖音累计点赞'],
      ['6万', '单条最高播放'],
      ['分钟级', '多平台适配'],
    ],
  },
  {
    no: '03',
    title: '企业级 RAG 知识库',
    en: 'Engineering side',
    role: '架构设计与实现 · 技术加分项',
    tags: ['混合检索', '重排', '多模态', 'Recall@5 89%'],
    summary:
      '搭建覆盖文本、表格、图表与图片视频的企业级知识库，采用稠密 + 稀疏混合检索与重排。被公司内部多个 AI 工具复用为共同底座——这是我对技术的理解，也是我做内容提效的底气。',
    metrics: [
      ['1,200', '份内部文档'],
      ['8 万', '条切片'],
      ['89%', 'Recall@5'],
    ],
  },
]

export const EXPERIENCE = [
  {
    period: '2025.08 — 2026.08',
    org: '杭州尚同传媒',
    role: 'AI 漫剧导演 / AI 应用开发',
    points: [
      '独立搭建 AI 漫剧产出流程，沉淀可复用的制作 SOP、版本管理与任务拆分机制。',
      '担任 AI 漫剧导演：风格把控、镜头设计与生成策略、关键镜头质量兜底、剪辑节奏与最终 QC。',
      '交付多部 120 分钟级长篇，团队 13 人，最快 7 天交付，红果热度最高 1500 万。',
    ],
  },
  {
    period: '2024.05 — 至今',
    org: '个人自媒体账号',
    role: '内容运营',
    points: [
      '独立运营抖音、小红书、YouTube，负责选题、制作、发布与数据复盘。',
      '自建多平台内容改写流程，单篇适配从小时级压缩到分钟级。',
    ],
  },
  {
    period: '2024.04 — 2025.04',
    org: '拾六传媒',
    role: '运营助理 / 专员',
    points: [
      '独立完成多类型宣传内容策划与文案，累计参与 100+ 条内容制作。',
      '参与线下活动全流程策划执行，参与视频素材筛选、剪辑、调色与包装。',
    ],
  },
]

export const SKILLS = [
  ['AIGC', '生图 · 图生视频 · 分镜设计 · 镜头语言 · 剪映 / CapCut · 视觉一致性'],
  ['内容运营', '内容策划 · 多平台改写 · 数据复盘 · 自媒体运营'],
  ['AI 工具', 'Codex · Cursor · Claude · Prompt 工程'],
  ['流程协作', 'SOP 工作流 · 版本管理 · 任务拆分 · 团队协作'],
]

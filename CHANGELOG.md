# 更新日志

## v0.3.0（2026-06-27）

### ✨ 新功能 — 管理员后台

- **新增完整的管理员后台**，受角色权限保护
  - 📊 **控制面板**：系统总览统计（文章数/用户数/听写次数/今日活跃）
  - 📝 **文章管理**：文章列表浏览、新建、编辑、删除
  - 👥 **用户管理**：查看用户信息及学习统计数据
- **文章创建/编辑表单**：自动拆分句子、支持中文翻译编辑、级别/分类选择
- **分类/级别分布图**：在控制面板以进度条展示各分类和难度级别的文章分布

### 🔐 权限系统

- User 模型新增 `role` 字段（默认 `"user"`）
- NextAuth JWT/Session 扩展携带 `role` 信息
- Middleware 拦截 `/admin/*`，非管理员自动重定向到 `/dashboard`
- 管理员在导航栏可见「⚙️ 管理后台」入口
- 新增 `prisma/seed-admin.ts` 脚本，可将指定用户提升为管理员

### 🐛 Bug 修复

- 修复文章管理页 Server Component 中传递 `onClick` 事件处理器的报错
- 修复自动登录：旧 JWT Token 缺少 `role` 字段的问题
- 修复 `auth.ts` 和 `dictation.ts` 预先存在的 TypeScript 类型错误

### 💄 UI 优化

- 分类名称改为中文显示（DAILY → 日常，STORY → 故事 等）
- 所有管理页面右上角添加「← 返回前台」按钮
- 管理后台侧边栏增加返回前台链接

### 🔀 功能整合

- **学习报告整合到 AI 学习助手**：作为第五个 Tab「📋 学习报告」加入 AI 助手页面
  - 日期范围选择 + 生成报告 + 导出 CSV
  - 统计概览（学习天数/连续天数/听写次数）
  - 词汇和听写详情、常错词 Top 10、活动分布
  - 原有导航中的「学习报告」已移除，入口移至 AI 助手

### 👨‍👩‍👧 家长模式

- **头像下拉菜单新增「👨‍👩‍👧 家长模式」入口**，点击弹出 PIN 验证弹窗
  - 首次使用需设置 4-6 位数字 PIN（bcrypt 加密存储）
  - 再次进入需输入 PIN 验证，安全退出
- **家长面板（/parent-mode）**包含四个页面：
  - 📊 **学习概况**：学习天数/连续天数/今日时长/听写平均分 + 词汇统计 + 上周活跃趋势柱状图 + 常错词 Top 10
  - ⏰ **时间管理**：设置每日学习时长上限（分钟）和可用时段（起止时间）
  - 📚 **学习内容**：最近学习的文章列表 + 低分薄弱句子 + 常错词
  - ⚙️ **设置**：修改家长 PIN / 退出家长模式
- 家长面板受 sessionStorage 标记保护，关闭浏览器标签自动退出

---

## v0.2.0（2026-06-27）

### ✨ 新功能

- **新增 12 篇中英双语童话故事**（A1-B2 级别），听力阅读分类「故事」可见
  - A1: *The Three Little Pigs* 🐷、*Little Red Riding Hood* 👧
  - A2: *The Frog Prince* 🐸、*Jack and the Beanstalk* 🌱、*Cinderella* 👠、*The Princess and the Pea* 🟢
  - B1: *The Ugly Duckling* 🦢、*The Emperor's New Clothes* 👘、*Beauty and the Beast* 🌹、*The Little Mermaid* 🧜‍♀️
  - B2: *Aladdin and the Magic Lamp* 🪔、*The Little Prince* 🌟
- 每篇文章含逐句中英对照翻译 + 音频时间偏移
- 新增文章自动生成听写练习（DictationExercise）记录

### 🔧 代码优化

- 简化 AI 助手消息历史类型转换，移除冗余断言
- 优化认证登录流程的空值检查（`!user?.password`）
- 移除文章阅读器多余的类型转换代码
- Service Worker 缓存策略优化，提升离线体验

### 📚 文档与配置

- README 表格格式规范化
- 新增 `.env.example` 环境变量模板文件
- 新增 `.env.production` 生产环境配置模板（密钥占位符提示）
- 更新 PROJECT-REVIEW 评分报告（95/100）
- 添加 AGENTS.md Next.js 版本变更警告说明
- ESLint 规则优化和 TypeScript 配置调整
- 安全中间件和 CSP 响应头微调

---

## v0.1.0（2026-06-26）

### 🎉 初始版本

- 初始提交：AI 驱动的英语学习平台
- 核心功能：听力阅读、听写训练、发音评分、AI 口语陪练、单词图谱、学习统计
- 技术栈：Next.js 16 + Prisma 7 + Tailwind CSS v4 + shadcn/ui + DeepSeek AI
- 安全体系：CSP、CSRF、速率限制、审计日志、NextAuth v5 JWT 认证
- CI/CD：GitHub Actions + Husky + lint-staged + Commitlint

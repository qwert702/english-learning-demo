# ─── 构建阶段 ───────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# 先复制依赖文件（利用 Docker 层缓存）
COPY package.json package-lock.json ./
RUN npm ci

# 复制源码和配置
COPY . .

# 生成 Prisma 客户端
RUN npx prisma generate

# 构建
RUN npm run build

# ─── 运行阶段 ───────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache curl && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 只复制构建产物和必要的运行文件
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# 设置正确权限
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:${PORT}/ || exit 1

CMD ["node", "server.js"]

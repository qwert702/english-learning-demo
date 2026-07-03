/**
 * 统一错误码与异常体系
 */

export enum ErrorCode {
  UNKNOWN = "UNKNOWN",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_EMAIL = "INVALID_EMAIL",
  INVALID_PASSWORD = "INVALID_PASSWORD",
  NOT_FOUND = "NOT_FOUND",
  ALREADY_EXISTS = "ALREADY_EXISTS",
}

const ERROR_HTTP_STATUS: Partial<Record<ErrorCode, number>> = {
  [ErrorCode.UNAUTHORIZED]: 401,
  [ErrorCode.FORBIDDEN]: 403,
  [ErrorCode.VALIDATION_ERROR]: 400,
  [ErrorCode.NOT_FOUND]: 404,
  [ErrorCode.ALREADY_EXISTS]: 409,
};

const ERROR_DEFAULT_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.UNKNOWN]: "未知错误，请稍后重试",
  [ErrorCode.UNAUTHORIZED]: "请先登录",
  [ErrorCode.FORBIDDEN]: "权限不足",
  [ErrorCode.VALIDATION_ERROR]: "输入数据不合法",
  [ErrorCode.INVALID_EMAIL]: "请输入正确的邮箱格式",
  [ErrorCode.INVALID_PASSWORD]: "密码至少需要 8 位，且包含字母和数字",
  [ErrorCode.NOT_FOUND]: "资源不存在",
  [ErrorCode.ALREADY_EXISTS]: "资源已存在",
};

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly status: number;
  public readonly detail?: string;

  constructor(code: ErrorCode, message?: string, detail?: string) {
    super(message || ERROR_DEFAULT_MESSAGES[code] || "未知错误");
    this.name = "AppError";
    this.code = code;
    this.status = ERROR_HTTP_STATUS[code] || 500;
    this.detail = detail;
  }

  static from(err: unknown, fallbackCode = ErrorCode.UNKNOWN): AppError {
    if (err instanceof AppError) return err;
    if (err instanceof Error) return new AppError(fallbackCode, err.message);
    return new AppError(fallbackCode);
  }

  toJSON() {
    return {
      error: this.code,
      message: this.message,
    };
  }
}

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: ErrorCode };

export function success<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export function failure(
  codeOrMsg: ErrorCode | string,
  messageOrCode?: string | ErrorCode
): ActionResult<never> {
  if (typeof codeOrMsg === "string") {
    return { ok: false, error: codeOrMsg, code: messageOrCode as ErrorCode | undefined };
  }
  return {
    ok: false,
    error: (messageOrCode as string) || ERROR_DEFAULT_MESSAGES[codeOrMsg],
    code: codeOrMsg,
  };
}

export function requireAuth(session: { user?: { id?: string } } | null): asserts session is { user: { id: string } } {
  if (!session?.user?.id) throw new AppError(ErrorCode.UNAUTHORIZED);
}

export function requireAdmin(
  session: { user?: { id?: string; role?: string } } | null
): asserts session is { user: { id: string; role: "admin" } } {
  requireAuth(session);
  if ((session.user as { role?: string }).role !== "admin") {
    throw new AppError(ErrorCode.FORBIDDEN, "未授权：需要管理员权限");
  }
}

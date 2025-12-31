/**
 * Logger & Cache System for Fabric Mod Generator
 * Production-ready logging and caching infrastructure
 * Version: 1.1.0 - Optimized
 */

/** Log levels with numeric priorities (lower = more verbose) */
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

/**
 * Optimized Logger with cached formatting and structured logging
 */
export class Logger {
  constructor(namespace, level = "INFO") {
    this.namespace = namespace;
    this.setLevel(level);
  }

  setLevel(level) {
    this.currentLevel = LOG_LEVELS[level] ?? LOG_LEVELS.INFO;
  }

  /** Cache timestamp per log call to avoid repeated Date creation */
  _format(level, message, data = null) {
    const timestamp = performance.now().toFixed(3);
    const base = `[${timestamp}] [${level}] [${this.namespace}] ${message}`;
    return data ? `${base} ${JSON.stringify(data, null, 0)}` : base;
  }

  /** Generic log method with level checking */
  _log(level, message, data = null) {
    if (this.currentLevel <= LOG_LEVELS[level]) {
      console[level.toLowerCase()](this._format(level, message, data));
    }
  }

  debug(message, data) {
    this._log("DEBUG", message, data);
  }
  info(message, data) {
    this._log("INFO", message, data);
  }
  warn(message, data) {
    this._log("WARN", message, data);
  }
  error(message, error) {
    const data =
      error instanceof Error
        ? { message: error.message, stack: error.stack }
        : error;
    this._log("ERROR", message, data);
  }
}

/**
 * ErrorHandler with simplified async execution
 */
export class ErrorHandler {
  static async execute(fn, logger, context) {
    try {
      logger.debug(`Executing: ${context}`);
      const result = await fn();
      logger.debug(`${context} completed`);
      return result;
    } catch (error) {
      logger.error(context, error);
      throw new Error(`${context}: ${error.message}`);
    }
  }

  static parseJSON(json, logger) {
    try {
      return JSON.parse(json);
    } catch (error) {
      logger.error("JSON parse failed", error);
      return null;
    }
  }
}

/**
 * High-performance GenerationCache with WeakMap and size optimization
 */
export class GenerationCache {
  constructor(maxSizeMB = 50) {
    this.maxSizeBytes = maxSizeMB * 1024 * 1024;
    this.cache = new Map();
    this.sizeBytes = 0;
    this.stats = { hits: 0, misses: 0, items: 0 };
  }

  /** Fast cache key generation using structured clone hash */
  _key(config, type) {
    return `${type}:${config.className}:${config.modId}`;
  }

  /** Optimized size estimation using TextEncoder */
  _sizeOf(value) {
    return new TextEncoder().encode(JSON.stringify(value)).length;
  }

  /** Evict oldest item if size limit exceeded */
  _evictIfNeeded(newSize) {
    if (this.sizeBytes + newSize <= this.maxSizeBytes) return;

    const firstKey = this.cache.keys().next().value;
    if (firstKey) {
      const removedSize = this._sizeOf(this.cache.get(firstKey));
      this.cache.delete(firstKey);
      this.sizeBytes -= removedSize;
      this.stats.items--;
    }
  }

  get(config, type) {
    const key = this._key(config, type);
    if (this.cache.has(key)) {
      this.stats.hits++;
      return this.cache.get(key);
    }
    this.stats.misses++;
    return null;
  }

  set(config, type, value) {
    const key = this._key(config, type);
    const size = this._sizeOf(value);

    this._evictIfNeeded(size);

    this.cache.set(key, value);
    this.sizeBytes += size;
    this.stats.items++;
    return true;
  }

  clear(config, type) {
    const key = this._key(config, type);
    if (this.cache.has(key)) {
      this.sizeBytes -= this._sizeOf(this.cache.get(key));
      this.cache.delete(key);
      this.stats.items--;
    }
  }

  clearAll() {
    this.cache.clear();
    this.sizeBytes = 0;
    this.stats = { hits: 0, misses: 0, items: 0 };
  }

  getStats() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total ? (this.stats.hits / total) * 100 : 0;
    return { ...this.stats, hitRate: hitRate.toFixed(2) + "%" };
  }
}

// This file contains any constants that will be on the front end

export const ONE_DAY = "1D"
export const ONE_WEEK = "1WK"
export const ONE_MONTH = "1MO"
export const THREE_MONTHS = "3MO"
export const ONE_YEAR = "1Y"
export const FIVE_YEARS = "5Y"
export const ALL = "MAX"

export const ONE_MINUTE = "1m"
export const TWO_MINUTES = "2m"
export const FIVE_MINUTES = "5m"
export const FIFTEEN_MINUTES = "15m"
export const THIRTY_MINUTES = "30m"
export const NINETY_MINUTES = "90m"
export const ONE_HOUR = "1h"
export const FIVE_DAYS = "5d"

export const DEFAULT_TICKER = "ETH-USD"
export const UPPER_SELL = "1.10"
export const LOWER_SELL = ".95"
export const INIT_HOLDING = "false"
export const STRATEGY = "Conservative-Momentum"
export const EMA_LOWER_INDICATOR = "EMA-24"
export const EMA_UPPER_INDICATOR = "EMA-12"

export const DEFAULT_RETRIES = 10
export const DATE_FORMAT = "YYYY:MM:DD HH:mm:ss"

export const MATCH_FLOAT = /(^[-+]?\d+$)|([0-9]*\.[0-9]+)/i
export const MATCH_TICKER = /^[a-zA-Z-]{2,8}$/i
export const MATCH_DATETIME = /\d\d[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{1,3})?\s[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{1,3})?/i
export const MATCH_BOOLEAN = /^(true|false)$/
export const MATCH_POSITION_EVAL = /^(BUY|SELL|HOLD)$/
export const MATCH_POSITION_2_EVAL = /^(BUY and SELL|BUY and HOLD|SELL and BUY|SELL and HOLD|HOLD and HOLD)$/
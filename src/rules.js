// import invariant from 'invariant';
import {
  isString,
  isArray,
  isSafeInteger,
  isNumber,
  isFunction,
  isBoolean,
  toNumber,
  toString,
  memoize,
  mapValues,
} from 'lodash-es'

export const requiredSymbol = Symbol('required')

const SUCCESS = null

const isNumeric = n => !isNaN(parseFloat(n)) && isFinite(n)
// eslint-disable-next-line
const isValid = result => (isBoolean(result) && result) || !result
const isEmpty = value =>
  [
    value === undefined,
    value === null,
    value === '',
    isArray(value) && value.length === 0,
  ].some(Boolean)
const buildMessage = (message, options) =>
  isFunction(message) ? message(options) : message

const decorateChainableRequired = validator => {
  const requiredValidator = ({when = true, message = '必填项'} = {}) => {
    const validate = validationInfo => {
      const {value} = validationInfo
      const shouldRequired = isFunction(when) ? when(validationInfo) : when

      if (isEmpty(value)) {
        if (shouldRequired) return buildMessage(message, validationInfo)

        return SUCCESS
      }

      return validator(validationInfo)
    }

    validate[requiredSymbol] = true

    return validate
  }

  return Object.assign(validator, {required: requiredValidator})
}

const createNumberValidator = (() => {
  const defaultMessage = ({min, max, integer}) => {
    const base = () => `请输入${integer ? '整数' : '数字'}`
    const conditions = []

    if (min === null && max === null) return base

    if (min !== null) conditions.push(`大于等于 ${min} `)

    if (max !== null) conditions.push(`小于等于 ${max} `)

    return `${base}，${conditions.join('且')}`
  }

  return ({
    min = null,
    max = null,
    integer = false,
    message = defaultMessage,
  } = {}) => {
    const validate = validationInfo => {
      const {value: originalValue} = validationInfo
      const parsedValue = toNumber(originalValue)
      const numeric = isNumeric(originalValue)
      const isGTE = min === null || parsedValue >= min
      const isLTE = max === null || parsedValue <= max

      return [
        integer ? isSafeInteger(parsedValue) : true,
        numeric,
        isGTE,
        isLTE,
      ].every(Boolean)
        ? SUCCESS
        : buildMessage(message, {...validationInfo, integer, min, max})
    }

    return decorateChainableRequired(validate)
  }
})()

const createStringValidator = (() => {
  // eslint-disable-next-line complexity
  const defaultMessage = ({min, max, charsCount, isLTE, isGTE}) => {
    const base = '请输入文本'
    const conditions = []
    const counts = [!isGTE && min, charsCount, !isLTE && max]
      .filter(isNumber)
      .join(' / ')

    if (min === null && max === null) return base

    if (min !== null) {
      conditions.push(`大于等于 ${min} `)
    }

    if (max !== null) {
      conditions.push(`小于等于 ${max} `)
    }

    return `[${counts}] ${base}，字符数${conditions.join('且')}`
  }

  return ({min = null, max = null, message = defaultMessage} = {}) => {
    const validate = validationInfo => {
      const {value} = validationInfo
      const {length} = toString(value)
      const isGTE = min === null || length >= min
      const isLTE = max === null || length <= max

      return [isString(value), isGTE, isLTE].every(Boolean)
        ? SUCCESS
        : buildMessage(message, {
            ...validationInfo,
            isLTE,
            isGTE,
            min,
            max,
            charsCount: length,
          })
    }

    return decorateChainableRequired(validate)
  }
})()

const createAnyValidator = () => decorateChainableRequired(() => true)

const createMobileValidator = ({message = '请输入手机号码'} = {}) =>
  decorateChainableRequired(validationInfo => {
    const {value} = validationInfo
    const reg = /^\d{11}$/

    return reg.test(value) ? SUCCESS : buildMessage(message, validationInfo)
  })

const createEmailValidator = ({message = '请输入正确的邮箱地址'} = {}) =>
  decorateChainableRequired(validationInfo => {
    const {value} = validationInfo
    const reg = /^\S+@\S+\.\S+$/

    return reg.test(value) ? SUCCESS : buildMessage(message, validationInfo)
  })

const createIdValidator = ({message = '请输入'} = {}) =>
  decorateChainableRequired(validationInfo => {
    const {value} = validationInfo
    const reg = /^[a-zA-Z0-9]{22}==$/

    return reg.test(value) ? SUCCESS : buildMessage(message, validationInfo)
  })

const Validators = mapValues(
  {
    number: createNumberValidator,
    string: createStringValidator,
    any: createAnyValidator,
    required: decorateChainableRequired(() => SUCCESS).required,
    mobile: createMobileValidator,
    email: createEmailValidator,
    id: createIdValidator,
  },
  v => memoize(v),
)

export default Validators

// 为Android接口声明全局类型
declare global {
  interface Window {
    Android?: {
      isStaminaEnough: () => boolean;
      expendStamina: () => boolean;
    };
  }
}

/**
 * 工具函数：检查体力值是否足够
 * @returns {boolean} 体力值是否充足
 */
export const isStaminaEnough = (): boolean => {
  try {
    // 调用Android接口检查体力值
    if (window.Android && typeof window.Android.isStaminaEnough === 'function') {
      return window.Android.isStaminaEnough();
    } else {
      console.log('Android接口不可用，使用默认体力值');
      return true; // 开发环境默认值
    }
  } catch (error) {
    // 出错时记录日志并返回false
    console.error('检查体力值失败:', error);
    return false;
  }
};

/**
 * 工具函数：扣除体力值
 * @returns {boolean} 是否成功扣除
 */
export const expendStamina = (): boolean => {
  try {
    // 调用Android接口扣除体力值
    if (window.Android && typeof window.Android.expendStamina === 'function') {
      const result = window.Android.expendStamina();
      console.log('体力值扣除结果:', result);
      return result;
    } else {
      console.log('Android接口不可用，使用默认体力值扣除');
      return true; // 开发环境默认值
    }
  } catch (error) {
    // 出错时记录日志并返回false
    console.error('扣除体力值失败:', error);
    return false;
  }
}; 
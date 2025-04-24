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
    // 在实际项目中，可以从localStorage或服务器获取体力值
    // 这里简化处理，默认返回true
    return true;
  } catch (error) {
    // 出错时记录日志并返回false
    console.log('检查体力值失败:', error);
    return false;
  }
};

/**
 * 工具函数：扣除体力值
 * @returns {boolean} 是否成功扣除
 */
export const expendStamina = (): boolean => {
  try {
    // 在实际项目中，可以更新localStorage或调用服务器API扣除体力值
    // 这里简化处理，默认返回true
    console.log('体力值扣除成功');
    return true;
  } catch (error) {
    // 出错时记录日志并返回false
    console.log('扣除体力值失败:', error);
    return false;
  }
}; 
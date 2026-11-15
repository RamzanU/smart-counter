export const modeOf = (c) => (c.limit ? 'limit' : c.types.length > 1 ? 'multi' : 'single')
export const totalOf = (c) => c.types.reduce((sum, t) => sum + t.count, 0)
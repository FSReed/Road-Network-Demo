// 画布配置
const CONFIG = {
    margin: { top: 50, right: 50, bottom: 50, left: 50 },
    width: window.innerWidth - 100,  // 减去左右margin
    height: window.innerHeight - 100, // 减去上下margin

    // 图形生成配置
    graph: {
        minDist: 90,        // 节点最小距离
        maxTries: 30,       // 采样尝试次数
        width: 1200,        // 图形宽度
        height: 800,        // 图形高度
        edgeRemoveProb: 0.2, // 随机去除部分边的概率
        bridgeProb: 0.15    // 边被标记为bridge的概率
    },

    // 样式配置
    style: {
        nodeColor: "#ff6b6b",
        edgeColor: "#4a9eff",
        edgeOpacity: 0.6,
        nodeRadius: 8,
        edgeWidth: 2,
        bridgeColor: "#ffffff",
        bridgeWidth: 3,
        bridgeOpacity: 0.8,
    },

    // 缩放配置
    zoom: {
        min: 0.1,
        max: 10,
        duration: 300
    }
}; 
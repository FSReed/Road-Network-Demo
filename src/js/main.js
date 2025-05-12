// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    // 创建图形生成器
    const graphGenerator = new GraphGenerator(CONFIG);

    // 创建渲染器
    const graphRenderer = new GraphRenderer(CONFIG);
    graphRenderer.initialize();

    // 创建控制器
    const graphControls = new GraphControls(graphGenerator, graphRenderer);

    // 生成并渲染初始图形
    const initialGraph = graphGenerator.generateGraph();
    graphRenderer.render(initialGraph.nodes, initialGraph.edges);
}); 
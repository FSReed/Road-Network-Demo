class GraphControls {
    constructor(graphGenerator, graphRenderer) {
        this.graphGenerator = graphGenerator;
        this.graphRenderer = graphRenderer;
        this.initializeControls();
    }

    initializeControls() {
        // 生成新样例按钮
        document.getElementById('generate-btn').onclick = () => {
            const newGraph = this.graphGenerator.generateGraph();
            this.graphRenderer.render(newGraph.nodes, newGraph.edges);
        };

        // 导出当前样例按钮
        document.getElementById('export-btn').onclick = () => {
            const currentGraph = this.graphRenderer.getCurrentGraph();
            if (!currentGraph) return;

            const data = {
                nodes: currentGraph.nodes.map(({ id, x, y }) => ({ id, x, y })),
                edges: currentGraph.edges.map(({ source, target, points }) => ({
                    source, target, points: points.map(({ x, y }) => ({ x, y }))
                }))
            };

            this.exportToJson(data);
        };

        // 缩放控制按钮
        window.zoomIn = () => this.graphRenderer.zoomIn();
        window.zoomOut = () => this.graphRenderer.zoomOut();
        window.resetZoom = () => this.graphRenderer.resetZoom();
    }

    exportToJson(data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'graph-sample.json';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
    }
} 
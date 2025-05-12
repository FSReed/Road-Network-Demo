class GraphRenderer {
    constructor(config) {
        this.config = config;
        this.svg = null;
        this.g = null;
        this.tooltip = null;
        this.zoom = null;
        this.currentGraph = null;
    }

    initialize() {
        // 创建SVG容器
        this.svg = d3.select("#graph-container")
            .append("svg")
            .attr("width", this.config.width + this.config.margin.left + this.config.margin.right)
            .attr("height", this.config.height + this.config.margin.top + this.config.margin.bottom);

        // 创建缩放组
        this.g = this.svg.append("g")
            .attr("transform", `translate(${this.config.margin.left},${this.config.margin.top})`);

        // 创建提示框
        this.tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // 创建缩放行为
        this.zoom = d3.zoom()
            .scaleExtent([this.config.zoom.min, this.config.zoom.max])
            .on("zoom", (event) => {
                this.g.attr("transform", event.transform);
            });

        // 应用缩放行为到SVG
        this.svg.call(this.zoom);
    }

    render(nodes, edges) {
        this.currentGraph = { nodes, edges };
        this.g.selectAll("*").remove(); // 清空旧图

        // 计算视图范围
        const xExtent = d3.extent(nodes, d => d.x);
        const yExtent = d3.extent(nodes, d => d.y);

        // 计算初始缩放比例以适应视图
        const xScale = this.config.width / (xExtent[1] - xExtent[0]);
        const yScale = this.config.height / (yExtent[1] - yExtent[0]);
        const initialScale = Math.min(xScale, yScale) * 0.8;

        // 设置初始缩放
        this.svg.transition()
            .duration(this.config.zoom.duration)
            .call(this.zoom.transform, d3.zoomIdentity
                .translate(this.config.width / 2, this.config.height / 2)
                .scale(initialScale)
                .translate(-(xExtent[0] + xExtent[1]) / 2, -(yExtent[0] + yExtent[1]) / 2)
            );

        // 创建边
        const link = this.g.append("g")
            .selectAll("path")
            .data(edges)
            .enter()
            .append("path")
            .attr("stroke", this.config.style.edgeColor)
            .attr("stroke-width", this.config.style.edgeWidth)
            .attr("stroke-opacity", this.config.style.edgeOpacity)
            .attr("fill", "none")
            .attr("d", d => {
                return d3.line()
                    .x(p => p.x)
                    .y(p => p.y)
                    (d.points);
            });

        // 创建中间点
        const midPoints = this.g.append("g")
            .selectAll("circle")
            .data(edges.flatMap(edge =>
                edge.points.slice(1, -1).map(point => ({
                    ...point,
                    edgeId: `${edge.source}-${edge.target}`
                }))
            ))
            .enter()
            .append("circle")
            .attr("r", 3)
            .attr("fill", this.config.style.edgeColor)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .on("mouseover", (event, d) => this.showTooltip(event, `中间点<br/>坐标: (${d.x}, ${d.y})`))
            .on("mouseout", () => this.hideTooltip());

        // 创建节点
        const node = this.g.append("g")
            .selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("r", this.config.style.nodeRadius)
            .attr("fill", this.config.style.nodeColor)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .on("mouseover", (event, d) => this.showTooltip(event, `节点 ${d.id}<br/>坐标: (${d.x}, ${d.y})`))
            .on("mouseout", () => this.hideTooltip());

        // 添加边悬停效果
        link.on("mouseover", (event, d) => this.showTooltip(event, `连接 ${d.source} → ${d.target}`))
            .on("mouseout", () => this.hideTooltip());
    }

    showTooltip(event, content) {
        this.tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        this.tooltip.html(content)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
    }

    hideTooltip() {
        this.tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    }

    zoomIn() {
        this.svg.transition()
            .duration(this.config.zoom.duration)
            .call(this.zoom.scaleBy, 1.3);
    }

    zoomOut() {
        this.svg.transition()
            .duration(this.config.zoom.duration)
            .call(this.zoom.scaleBy, 0.7);
    }

    resetZoom() {
        this.svg.transition()
            .duration(this.config.zoom.duration)
            .call(this.zoom.transform, d3.zoomIdentity);
    }

    getCurrentGraph() {
        return this.currentGraph;
    }
} 
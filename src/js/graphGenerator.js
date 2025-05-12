class GraphGenerator {
    constructor(config) {
        this.config = config;
    }

    generateGraph() {
        const { minDist, maxTries, width, height, edgeRemoveProb } = this.config.graph;
        const nodes = this.generateNodes(minDist, maxTries, width, height);
        const edges = this.generateEdges(nodes, edgeRemoveProb);
        return { nodes, edges };
    }

    generateNodes(minDist, maxTries, w, h) {
        const nodes = [];
        const grid = [];
        const cellSize = minDist / Math.SQRT2;
        const cols = Math.ceil(w / cellSize);
        const rows = Math.ceil(h / cellSize);

        for (let i = 0; i < cols * rows; i++) grid[i] = null;

        function gridIndex(x, y) {
            return Math.floor(x / cellSize) + Math.floor(y / cellSize) * cols;
        }

        // 随机起点
        const first = {
            x: Math.random() * w,
            y: Math.random() * h
        };
        nodes.push({ ...first, id: 0 });
        grid[gridIndex(first.x, first.y)] = 0;
        let active = [0];
        let id = 1;

        while (active.length > 0 && nodes.length < 32) {
            const idx = active[Math.floor(Math.random() * active.length)];
            const base = nodes[idx];
            let found = false;

            for (let t = 0; t < maxTries; t++) {
                const angle = Math.random() * 2 * Math.PI;
                const dist = minDist * (1 + Math.random());
                const nx = base.x + Math.cos(angle) * dist;
                const ny = base.y + Math.sin(angle) * dist;

                if (nx < 0 || nx > w || ny < 0 || ny > h) continue;

                // 检查邻域
                let ok = true;
                for (let dx = -2; dx <= 2; dx++) {
                    for (let dy = -2; dy <= 2; dy++) {
                        const gx = Math.floor(nx / cellSize) + dx;
                        const gy = Math.floor(ny / cellSize) + dy;
                        if (gx < 0 || gx >= cols || gy < 0 || gy >= rows) continue;
                        const nidx = grid[gx + gy * cols];
                        if (nidx !== null) {
                            const n = nodes[nidx];
                            const d2 = (n.x - nx) * (n.x - nx) + (n.y - ny) * (n.y - ny);
                            if (d2 < minDist * minDist) {
                                ok = false;
                                break;
                            }
                        }
                    }
                    if (!ok) break;
                }

                if (ok) {
                    nodes.push({ x: nx, y: ny, id: id });
                    grid[gridIndex(nx, ny)] = id;
                    active.push(id);
                    id++;
                    found = true;
                    break;
                }
            }

            if (!found) {
                active = active.filter(i => i !== idx);
            }
        }

        return nodes;
    }

    generateEdges(nodes, edgeRemoveProb) {
        // Delaunay三角剖分
        const delaunay = d3.Delaunay.from(nodes, d => d.x, d => d.y);
        const triangles = delaunay.triangles;

        // 统计所有边（无向，避免重复）
        const edgeSet = new Set();
        for (let i = 0; i < triangles.length; i += 3) {
            const a = triangles[i], b = triangles[i + 1], c = triangles[i + 2];
            [[a, b], [b, c], [c, a]].forEach(([u, v]) => {
                const key = u < v ? `${u},${v}` : `${v},${u}`;
                edgeSet.add(key);
            });
        }

        // 边去重并转为数组
        let edges = Array.from(edgeSet).map(key => {
            const [u, v] = key.split(",").map(Number);
            return { source: u, target: v };
        });

        // 随机去除部分边
        edges = edges.filter(() => Math.random() > edgeRemoveProb);

        // 生成折线点
        return edges.map(e => {
            const a = nodes.find(n => n.id === e.source);
            const b = nodes.find(n => n.id === e.target);
            return {
                source: a.id,
                target: b.id,
                points: this.makePoints(a, b)
            };
        });
    }

    makePoints(a, b) {
        const midCount = Math.random() < 0.5 ? 1 : 2;
        const points = [a];
        const minDist = this.config.graph.minDist;

        for (let i = 1; i <= midCount; i++) {
            const t = i / (midCount + 1);
            points.push({
                x: Math.round(a.x * (1 - t) + b.x * t + (Math.random() - 0.5) * minDist * 0.25),
                y: Math.round(a.y * (1 - t) + b.y * t + (Math.random() - 0.5) * minDist * 0.25)
            });
        }
        points.push(b);
        return points;
    }
} 
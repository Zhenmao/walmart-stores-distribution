Promise.all([
	d3.json("https://cdn.jsdelivr.net/npm/us-atlas@2/us/10m.json"),
	d3.tsv("walmart.tsv")
]).then(([us, tsv]) => {
	////////////////////////////////////////////////////////////
	//// Process Data //////////////////////////////////////////
	////////////////////////////////////////////////////////////
	// https://observablehq.com/@d3/u-s-map
	// Project the location using the projection used for the us atlas
	const projection = d3
		.geoAlbersUsa()
		.scale(1280)
		.translate([480, 300]);
	const data = tsv.map(projection);

	////////////////////////////////////////////////////////////
	//// Setup /////////////////////////////////////////////////
	////////////////////////////////////////////////////////////
	const width = 960;
	const height = 600;
	const margin = 32;

	const scheme = d3.schemeGnBu;

	renderScatterMap();
	renderContourMap();
	renderHexbinColorMap();
	renderHexbinAreaMap();

	////////////////////////////////////////////////////////////
	//// Scatter Map ///////////////////////////////////////////
	////////////////////////////////////////////////////////////
	function renderScatterMap() {
		const svg = d3
			.select(".scatter-map")
			.attr("viewBox", [0, 0, width + margin * 2, height + margin * 2])
			.append("g")
			.attr("transform", `translate(${margin},${margin})`);

		svg
			.append("g")
			.selectAll("circle")
			.data(data)
			.join("circle")
			.attr("cx", d => d[0])
			.attr("cy", d => d[1])
			.attr("r", 2)
			.attr("fill", "#777");

		svg
			.append("path")
			.attr("id", "us-path")
			.datum(topojson.mesh(us, us.objects.states))
			.attr("fill", "none")
			.attr("stroke", "#777")
			.attr("stroke-width", 0.5)
			.attr("stroke-linejoin", "round")
			.attr("d", d3.geoPath());
	}

	////////////////////////////////////////////////////////////
	//// Contour Map ///////////////////////////////////////////
	////////////////////////////////////////////////////////////
	function renderContourMap() {
		const contours = d3
			.contourDensity()
			.x(d => d[0])
			.y(d => d[1])
			.size([width, height])
			.thresholds(9)(data);

		const color = scheme[contours.length];

		const svg = d3
			.select(".contour-map")
			.attr("viewBox", [0, 0, width + margin * 2, height + margin * 2])
			.append("g")
			.attr("transform", `translate(${margin},${margin})`);

		svg
			.append("g")
			.attr("fill", "none")
			.attr("stroke", "#fff")
			.attr("stroke-linejoin", "round")
			.selectAll("path")
			.data(contours)
			.enter()
			.append("path")
			.attr("fill", (d, i) => color[i])
			.attr("d", d3.geoPath());

		svg.append("use").attr("xlink:href", "#us-path");
	}

	////////////////////////////////////////////////////////////
	//// Hexbin Color Map //////////////////////////////////////
	////////////////////////////////////////////////////////////
	function renderHexbinColorMap() {
		const svg = d3
			.select(".hexbin-color-map")
			.attr("viewBox", [0, 0, width + margin * 2, height + margin * 2])
			.append("g")
			.attr("transform", `translate(${margin},${margin})`);

		svg.append("use").attr("xlink:href", "#us-path");
	}

	////////////////////////////////////////////////////////////
	//// Hexbin Area Map ///////////////////////////////////////
	////////////////////////////////////////////////////////////
	function renderHexbinAreaMap() {
		const svg = d3
			.select(".hexbin-area-map")
			.attr("viewBox", [0, 0, width + margin * 2, height + margin * 2])
			.append("g")
			.attr("transform", `translate(${margin},${margin})`);

		svg.append("use").attr("xlink:href", "#us-path");
	}
});

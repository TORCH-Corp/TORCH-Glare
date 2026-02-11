import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

// ─── Types ──────────────────────────────────────────────────────────────────
export interface ChartBlockData {
  chartType: "bar" | "line" | "pie" | "doughnut" | "radar" | "polarArea";
  title: string;
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }>;
}

interface ChartBlockConstructorOptions {
  data: Partial<ChartBlockData>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  api: any;
  readOnly: boolean;
}

// ─── Constants ──────────────────────────────────────────────────────────────
const CHART_TYPES: Array<{
  value: ChartBlockData["chartType"];
  label: string;
  icon: string;
}> = [
  {
    value: "bar",
    label: "Bar",
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="7" width="4" height="14" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>',
  },
  {
    value: "line",
    label: "Line",
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 17 9 11 13 15 21 7"/><polyline points="17 7 21 7 21 11"/></svg>',
  },
  {
    value: "pie",
    label: "Pie",
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-9-9"/><path d="M21 12H12V3a9 9 0 0 1 9 9z"/></svg>',
  },
  {
    value: "doughnut",
    label: "Doughnut",
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 3v4"/></svg>',
  },
  {
    value: "radar",
    label: "Radar",
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/><polygon points="12 6 18 9.5 18 14.5 12 18 6 14.5 6 9.5"/></svg>',
  },
  {
    value: "polarArea",
    label: "Polar",
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="3" y1="12" x2="21" y2="12"/></svg>',
  },
];

const COLOR_PALETTE = [
  { bg: "rgba(54, 162, 235, 0.5)", border: "rgb(54, 162, 235)" },
  { bg: "rgba(255, 99, 132, 0.5)", border: "rgb(255, 99, 132)" },
  { bg: "rgba(75, 192, 192, 0.5)", border: "rgb(75, 192, 192)" },
  { bg: "rgba(255, 205, 86, 0.5)", border: "rgb(255, 205, 86)" },
  { bg: "rgba(153, 102, 255, 0.5)", border: "rgb(153, 102, 255)" },
  { bg: "rgba(255, 159, 64, 0.5)", border: "rgb(255, 159, 64)" },
  { bg: "rgba(201, 203, 207, 0.5)", border: "rgb(201, 203, 207)" },
  { bg: "rgba(46, 204, 113, 0.5)", border: "rgb(46, 204, 113)" },
];

const DEFAULT_DATA: ChartBlockData = {
  chartType: "bar",
  title: "",
  labels: ["Label 1", "Label 2", "Label 3"],
  datasets: [
    {
      label: "Dataset 1",
      data: [10, 20, 30],
      backgroundColor: COLOR_PALETTE[0].bg,
      borderColor: COLOR_PALETTE[0].border,
    },
  ],
};

const TOOLBOX_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="7" width="4" height="14" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>';

// ─── ChartBlockTool ─────────────────────────────────────────────────────────
export default class ChartBlockTool {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private api: any;
  private readOnly: boolean;
  private data: ChartBlockData;
  private chart: Chart | null = null;
  private wrapper: HTMLDivElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private tableWrapper: HTMLDivElement | null = null;
  private editorPanel: HTMLDivElement | null = null;
  private updateTimeout: number | null = null;
  private boundOnClickOutside: ((e: MouseEvent) => void) | null = null;

  static get isReadOnlySupported(): boolean {
    return true;
  }

  static get toolbox(): { title: string; icon: string } {
    return { title: "Chart", icon: TOOLBOX_ICON };
  }

  constructor({ data, api, readOnly }: ChartBlockConstructorOptions) {
    this.api = api;
    this.readOnly = readOnly;
    this.data = this.normalizeData(data);
  }

  // ─── Lifecycle ──────────────────────────────────────────────────────────────

  render(): HTMLElement {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("cdx-chart-block");

    if (this.readOnly) {
      this.buildReadOnlyUI();
    } else {
      this.buildEditUI();

      // Start collapsed — show only the chart
      if (this.editorPanel) {
        this.editorPanel.classList.add("cdx-chart-block__editor-panel--hidden");
      }

      // Click on the block → expand editing panel
      this.wrapper.addEventListener("click", (e) => {
        if (
          this.editorPanel &&
          this.editorPanel.classList.contains(
            "cdx-chart-block__editor-panel--hidden",
          )
        ) {
          this.editorPanel.classList.remove(
            "cdx-chart-block__editor-panel--hidden",
          );
          // Re-create chart since canvas may have been resized
          this.createChart();
        }
      });

      // Click outside → collapse
      this.boundOnClickOutside = (e: MouseEvent) => {
        if (
          this.wrapper &&
          this.editorPanel &&
          !this.wrapper.contains(e.target as Node)
        ) {
          this.editorPanel.classList.add(
            "cdx-chart-block__editor-panel--hidden",
          );
          // Re-create chart to fit new size
          this.createChart();
        }
      };
      document.addEventListener("click", this.boundOnClickOutside);
    }

    // Defer chart creation until DOM is mounted
    requestAnimationFrame(() => this.createChart());

    return this.wrapper;
  }

  save(): ChartBlockData {
    return {
      chartType: this.data.chartType,
      title: this.data.title,
      labels: [...this.data.labels],
      datasets: this.data.datasets.map((ds) => ({
        label: ds.label,
        data: [...ds.data],
        backgroundColor: ds.backgroundColor,
        borderColor: ds.borderColor,
      })),
    };
  }

  validate(savedData: ChartBlockData): boolean {
    return (
      Array.isArray(savedData.labels) &&
      savedData.labels.length > 0 &&
      Array.isArray(savedData.datasets) &&
      savedData.datasets.length > 0
    );
  }

  destroy(): void {
    if (this.updateTimeout !== null) {
      clearTimeout(this.updateTimeout);
      this.updateTimeout = null;
    }
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
    if (this.boundOnClickOutside) {
      document.removeEventListener("click", this.boundOnClickOutside);
      this.boundOnClickOutside = null;
    }
  }

  renderSettings() {
    return CHART_TYPES.map((type) => ({
      icon: type.icon,
      label: type.label,
      isActive: this.data.chartType === type.value,
      closeOnActivate: true,
      onActivate: () => {
        this.data.chartType = type.value;
        this.updateTypeSelector();
        this.createChart();
      },
    }));
  }

  // ─── UI Builders ────────────────────────────────────────────────────────────

  private buildReadOnlyUI(): void {
    if (!this.wrapper) return;

    if (this.data.title) {
      const title = document.createElement("div");
      title.className = "cdx-chart-block__title";
      title.textContent = this.data.title;
      this.wrapper.appendChild(title);
    }

    this.appendCanvas();
  }

  private buildEditUI(): void {
    if (!this.wrapper) return;

    // Editor panel — all editing controls wrapped in a collapsible container
    this.editorPanel = document.createElement("div");
    this.editorPanel.className = "cdx-chart-block__editor-panel";

    // Title input
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.className = "cdx-chart-block__title-input";
    titleInput.placeholder = "Chart title (optional)";
    titleInput.value = this.data.title;
    titleInput.addEventListener("input", () => {
      this.data.title = titleInput.value;
      this.scheduleChartUpdate();
    });
    this.editorPanel.appendChild(titleInput);

    // Chart type selector
    const typeSelector = document.createElement("div");
    typeSelector.className = "cdx-chart-block__type-selector";

    CHART_TYPES.forEach((type) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cdx-chart-block__type-btn";
      btn.dataset.chartType = type.value;
      if (this.data.chartType === type.value) {
        btn.classList.add("cdx-chart-block__type-btn--active");
      }
      btn.innerHTML = `${type.icon} ${type.label}`;
      btn.addEventListener("click", () => {
        this.data.chartType = type.value;
        this.updateTypeSelector();
        this.createChart();
      });
      typeSelector.appendChild(btn);
    });

    this.editorPanel.appendChild(typeSelector);

    // Data table
    this.tableWrapper = document.createElement("div");
    this.tableWrapper.className = "cdx-chart-block__table-wrapper";
    this.editorPanel.appendChild(this.tableWrapper);
    this.rebuildDataTable();

    // Action buttons
    const actions = document.createElement("div");
    actions.className = "cdx-chart-block__actions";

    const addLabelBtn = document.createElement("button");
    addLabelBtn.type = "button";
    addLabelBtn.className = "cdx-chart-block__action-btn";
    addLabelBtn.textContent = "+ Add Label";
    addLabelBtn.addEventListener("click", () => this.addLabel());

    const addDatasetBtn = document.createElement("button");
    addDatasetBtn.type = "button";
    addDatasetBtn.className = "cdx-chart-block__action-btn";
    addDatasetBtn.textContent = "+ Add Dataset";
    addDatasetBtn.addEventListener("click", () => this.addDataset());

    actions.appendChild(addLabelBtn);
    actions.appendChild(addDatasetBtn);
    this.editorPanel.appendChild(actions);

    this.wrapper.appendChild(this.editorPanel);

    // Canvas — always visible, outside the editor panel
    this.appendCanvas();
  }

  private appendCanvas(): void {
    if (!this.wrapper) return;

    const canvasWrapper = document.createElement("div");
    canvasWrapper.className = "cdx-chart-block__canvas-wrapper";

    this.canvas = document.createElement("canvas");
    canvasWrapper.appendChild(this.canvas);
    this.wrapper.appendChild(canvasWrapper);
  }

  // ─── Data Table ─────────────────────────────────────────────────────────────

  private rebuildDataTable(): void {
    if (!this.tableWrapper) return;
    this.tableWrapper.innerHTML = "";

    const table = document.createElement("table");
    table.className = "cdx-chart-block__table";

    // Header row: corner + label inputs + empty controls column
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    // Corner cell
    const corner = document.createElement("th");
    corner.className = "cdx-chart-block__corner-cell";
    headerRow.appendChild(corner);

    // Label cells
    this.data.labels.forEach((label, colIdx) => {
      const th = document.createElement("th");
      th.className = "cdx-chart-block__label-cell";

      const labelInput = document.createElement("input");
      labelInput.type = "text";
      labelInput.className = "cdx-chart-block__label-input";
      labelInput.value = label;
      labelInput.addEventListener("input", () => {
        this.data.labels[colIdx] = labelInput.value;
        this.scheduleChartUpdate();
      });
      th.appendChild(labelInput);

      if (this.data.labels.length > 1) {
        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "cdx-chart-block__remove-col-btn";
        removeBtn.innerHTML = "&times;";
        removeBtn.title = "Remove label";
        removeBtn.addEventListener("click", () => this.removeLabel(colIdx));
        th.appendChild(removeBtn);
      }

      headerRow.appendChild(th);
    });

    // Controls column header (empty)
    const controlsHeader = document.createElement("th");
    controlsHeader.className = "cdx-chart-block__controls-header";
    headerRow.appendChild(controlsHeader);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Body rows: one per dataset
    const tbody = document.createElement("tbody");

    this.data.datasets.forEach((dataset, rowIdx) => {
      const tr = document.createElement("tr");
      tr.className = "cdx-chart-block__dataset-row";

      // Dataset name cell
      const nameCell = document.createElement("td");
      nameCell.className = "cdx-chart-block__dataset-name-cell";
      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.className = "cdx-chart-block__dataset-name";
      nameInput.value = dataset.label;
      nameInput.placeholder = "Dataset name";
      nameInput.addEventListener("input", () => {
        this.data.datasets[rowIdx].label = nameInput.value;
        this.scheduleChartUpdate();
      });
      nameCell.appendChild(nameInput);
      tr.appendChild(nameCell);

      // Data value cells
      this.data.labels.forEach((_, colIdx) => {
        const td = document.createElement("td");
        const dataInput = document.createElement("input");
        dataInput.type = "number";
        dataInput.className = "cdx-chart-block__data-input";
        dataInput.value = String(dataset.data[colIdx] ?? 0);
        dataInput.addEventListener("input", () => {
          this.data.datasets[rowIdx].data[colIdx] =
            parseFloat(dataInput.value) || 0;
          this.scheduleChartUpdate();
        });
        td.appendChild(dataInput);
        tr.appendChild(td);
      });

      // Controls cell: color picker + remove button
      const controlsCell = document.createElement("td");
      controlsCell.className = "cdx-chart-block__dataset-controls";

      const colorPicker = document.createElement("input");
      colorPicker.type = "color";
      colorPicker.className = "cdx-chart-block__color-picker";
      colorPicker.value = this.rgbaToHex(dataset.backgroundColor);
      colorPicker.title = "Dataset color";
      colorPicker.addEventListener("input", () => {
        this.data.datasets[rowIdx].backgroundColor = this.hexToRgba(
          colorPicker.value,
          0.5,
        );
        this.data.datasets[rowIdx].borderColor = this.hexToRgba(
          colorPicker.value,
          1,
        );
        this.scheduleChartUpdate();
      });
      controlsCell.appendChild(colorPicker);

      if (this.data.datasets.length > 1) {
        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "cdx-chart-block__remove-btn";
        removeBtn.innerHTML = "&times;";
        removeBtn.title = "Remove dataset";
        removeBtn.addEventListener("click", () => this.removeDataset(rowIdx));
        controlsCell.appendChild(removeBtn);
      }

      tr.appendChild(controlsCell);
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    this.tableWrapper.appendChild(table);
  }

  // ─── Chart ──────────────────────────────────────────────────────────────────

  private createChart(): void {
    if (!this.canvas) return;

    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    const dark = this.isDarkMode();
    const textColor = dark ? "#e0e0e0" : "#333";
    const gridColor = dark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
    const legendColor = dark ? "#ccc" : "#666";

    const isPieType = ["pie", "doughnut", "polarArea"].includes(
      this.data.chartType,
    );

    // For pie/doughnut/polar, use per-segment colors from all datasets flattened
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const datasets: any[] = this.data.datasets.map((ds) => {
      if (isPieType) {
        return {
          label: ds.label,
          data: [...ds.data],
          borderWidth: 2,
          backgroundColor: ds.data.map(
            (_, i) => COLOR_PALETTE[i % COLOR_PALETTE.length].bg,
          ),
          borderColor: ds.data.map(
            (_, i) => COLOR_PALETTE[i % COLOR_PALETTE.length].border,
          ),
        };
      }
      return {
        label: ds.label,
        data: [...ds.data],
        borderWidth: 2,
        backgroundColor: ds.backgroundColor,
        borderColor: ds.borderColor,
      };
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options: any = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: !!this.data.title,
          text: this.data.title,
          color: textColor,
          font: { size: 16, weight: "600" as const },
        },
        legend: {
          labels: { color: legendColor },
        },
      },
    };

    // Add scales for axis-based chart types
    if (this.data.chartType === "radar") {
      options.scales = {
        r: {
          ticks: { color: textColor, backdropColor: "transparent" },
          grid: { color: gridColor },
          pointLabels: { color: textColor },
        },
      };
    } else if (!isPieType) {
      options.scales = {
        x: {
          ticks: { color: textColor },
          grid: { color: gridColor },
        },
        y: {
          ticks: { color: textColor },
          grid: { color: gridColor },
          beginAtZero: true,
        },
      };
    }

    this.chart = new Chart(this.canvas, {
      type: this.data.chartType,
      data: {
        labels: [...this.data.labels],
        datasets,
      },
      options,
    });
  }

  private scheduleChartUpdate(): void {
    if (this.updateTimeout !== null) {
      clearTimeout(this.updateTimeout);
    }
    this.updateTimeout = window.setTimeout(() => {
      this.updateTimeout = null;
      if (!this.chart) return;

      const isPieType = ["pie", "doughnut", "polarArea"].includes(
        this.data.chartType,
      );

      this.chart.data.labels = [...this.data.labels];
      this.chart.data.datasets = this.data.datasets.map((ds) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const base: any = {
          label: ds.label,
          data: [...ds.data],
          borderWidth: 2,
        };

        if (isPieType) {
          base.backgroundColor = ds.data.map(
            (_, i) => COLOR_PALETTE[i % COLOR_PALETTE.length].bg,
          );
          base.borderColor = ds.data.map(
            (_, i) => COLOR_PALETTE[i % COLOR_PALETTE.length].border,
          );
        } else {
          base.backgroundColor = ds.backgroundColor;
          base.borderColor = ds.borderColor;
        }

        return base;
      });

      // Update title
      if (this.chart.options.plugins?.title) {
        this.chart.options.plugins.title.display = !!this.data.title;
        this.chart.options.plugins.title.text = this.data.title;
      }

      this.chart.update();
    }, 150);
  }

  // ─── Data Management ────────────────────────────────────────────────────────

  private addLabel(): void {
    const idx = this.data.labels.length + 1;
    this.data.labels.push(`Label ${idx}`);
    this.data.datasets.forEach((ds) => ds.data.push(0));
    this.rebuildDataTable();
    this.scheduleChartUpdate();
  }

  private removeLabel(index: number): void {
    if (this.data.labels.length <= 1) return;
    this.data.labels.splice(index, 1);
    this.data.datasets.forEach((ds) => ds.data.splice(index, 1));
    this.rebuildDataTable();
    this.scheduleChartUpdate();
  }

  private addDataset(): void {
    const idx = this.data.datasets.length;
    const color = COLOR_PALETTE[idx % COLOR_PALETTE.length];
    this.data.datasets.push({
      label: `Dataset ${idx + 1}`,
      data: this.data.labels.map(() => 0),
      backgroundColor: color.bg,
      borderColor: color.border,
    });
    this.rebuildDataTable();
    this.scheduleChartUpdate();
  }

  private removeDataset(index: number): void {
    if (this.data.datasets.length <= 1) return;
    this.data.datasets.splice(index, 1);
    this.rebuildDataTable();
    this.scheduleChartUpdate();
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  private updateTypeSelector(): void {
    if (!this.wrapper) return;
    const buttons = this.wrapper.querySelectorAll<HTMLButtonElement>(
      ".cdx-chart-block__type-btn",
    );
    buttons.forEach((btn) => {
      btn.classList.toggle(
        "cdx-chart-block__type-btn--active",
        btn.dataset.chartType === this.data.chartType,
      );
    });
  }

  private normalizeData(data: Partial<ChartBlockData>): ChartBlockData {
    const chartType =
      data.chartType &&
      ["bar", "line", "pie", "doughnut", "radar", "polarArea"].includes(
        data.chartType,
      )
        ? data.chartType
        : DEFAULT_DATA.chartType;

    const title = data.title ?? DEFAULT_DATA.title;
    const labels =
      Array.isArray(data.labels) && data.labels.length > 0
        ? data.labels
        : [...DEFAULT_DATA.labels];

    const datasets =
      Array.isArray(data.datasets) && data.datasets.length > 0
        ? data.datasets.map((ds, idx) => {
            const color = COLOR_PALETTE[idx % COLOR_PALETTE.length];
            return {
              label: ds.label || `Dataset ${idx + 1}`,
              data: Array.isArray(ds.data)
                ? labels.map((_, i) => ds.data[i] ?? 0)
                : labels.map(() => 0),
              backgroundColor: ds.backgroundColor || color.bg,
              borderColor: ds.borderColor || color.border,
            };
          })
        : DEFAULT_DATA.datasets.map((ds) => ({
            ...ds,
            data: labels.map((_, i) => ds.data[i] ?? 0),
          }));

    return { chartType, title, labels, datasets };
  }

  private isDarkMode(): boolean {
    let el: HTMLElement | null = this.wrapper;
    while (el) {
      if (el.getAttribute("data-theme") === "dark") return true;
      el = el.parentElement;
    }
    return false;
  }

  private hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  private rgbaToHex(rgba: string): string {
    const match = rgba.match(/(\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return "#000000";
    const r = parseInt(match[1]).toString(16).padStart(2, "0");
    const g = parseInt(match[2]).toString(16).padStart(2, "0");
    const b = parseInt(match[3]).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
  }
}

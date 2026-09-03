import type { PropsWithChildren } from "react";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import MalaysiaPage from "./MalaysiaPage";

vi.mock("recharts", async () => {
  const React = await import("react");
  const Container = ({ children }: PropsWithChildren) => React.createElement("div", null, children);
  const Empty = () => null;

  return {
    Area: Empty,
    Bar: Container,
    BarChart: Container,
    CartesianGrid: Empty,
    Cell: Empty,
    ComposedChart: Container,
    Legend: Empty,
    Line: Empty,
    LineChart: Container,
    Pie: Container,
    PieChart: Container,
    PolarAngleAxis: Empty,
    PolarGrid: Empty,
    PolarRadiusAxis: Empty,
    Radar: Empty,
    RadarChart: Container,
    ReferenceArea: Empty,
    ReferenceLine: Empty,
    ResponsiveContainer: Container,
    Tooltip: Empty,
    XAxis: Empty,
    YAxis: Empty,
  };
});

const renderMalaysiaPage = () => render(
  <MemoryRouter initialEntries={["/malaysia"]}>
    <MalaysiaPage />
  </MemoryRouter>
);

afterEach(cleanup);

describe("Malaysia T5 Strategic Assessment", () => {
  it("selects T5 and shows every user-facing assessment section", () => {
    renderMalaysiaPage();

    fireEvent.click(screen.getByRole("button", { name: /Strategic Assessment/ }));

    expect(screen.getByRole("heading", { name: "マレーシア市場 総合評価" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "SWOT 分析" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "製品別 参入優先度" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "推奨 参入ロードマップ" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "リスクと対策" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "アクション" })).toBeInTheDocument();
  });
});

describe("Malaysia T6 Market Intelligence", () => {
  it("loads T6 on selection and shows all ten sections and finance disclosures", async () => {
    renderMalaysiaPage();

    fireEvent.click(screen.getByRole("button", { name: /Market Intelligence/ }));

    const sectionNames = [
      "ビジネス環境評価",
      "競合詳細分析",
      "顧客セグメント分析",
      "製品別市場規模",
      "流通チャネル詳細分析",
      "認証取得プロセス詳細",
      "投資収支分析（5年間）",
      "シナリオ分析",
      "KPI・モニタリング指標",
      "データソース・免責事項",
    ];

    expect(await screen.findByRole("heading", { name: sectionNames[0] }, { timeout: 15000 })).toBeInTheDocument();
    for (const name of sectionNames.slice(1)) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }

    expect(screen.getByText("初期投資（合計）")).toBeInTheDocument();
    expect(screen.getByText("損益分岐（基準）")).toBeInTheDocument();
    expect(screen.getByText("5年累積CF（基準）")).toBeInTheDocument();
    expect(screen.getByText(/5年NPV = -初期投資/)).toBeInTheDocument();
    expect(screen.getByText("免責事項:")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Gross Domestic Product 2025/ })).toHaveAttribute(
      "rel",
      "noopener noreferrer"
    );
  });

  it("switches scenario and KPI category using visible controls", async () => {
    renderMalaysiaPage();
    fireEvent.click(screen.getByRole("button", { name: /Market Intelligence/ }));
    await screen.findByRole("heading", { name: "シナリオ分析" }, { timeout: 15000 });

    fireEvent.click(screen.getByRole("button", { name: /楽観シナリオ/ }));
    expect(screen.getByText(/積極参入戦略/)).toBeInTheDocument();
    expect(screen.getByText(/CAGR: 11%/)).toBeInTheDocument();

    const kpiSection = screen.getByRole("heading", { name: "KPI・モニタリング指標" }).closest("section");
    expect(kpiSection).not.toBeNull();
    const kpi = within(kpiSection as HTMLElement);
    expect(kpi.getByText("年間売上高")).toBeInTheDocument();
    fireEvent.click(kpi.getByRole("button", { name: "認証" }));
    expect(kpi.getByText("ST-SIRIM CoA取得数")).toBeInTheDocument();
    expect(kpi.queryByText("年間売上高")).not.toBeInTheDocument();
  });
});

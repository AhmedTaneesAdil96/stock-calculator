import dynamic from "next/dynamic";
import "bootstrap/dist/css/bootstrap.min.css";
const StockCalculator = dynamic(() => import("./components/stock-calculator"), {
  ssr: false,
});

export default function Home() {
  return (
    <div>
      <StockCalculator />
    </div>
  );
}

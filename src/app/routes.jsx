import { createBrowserRouter } from "react-router-dom";
import Layout from "../layouts/Layout"; 
import Dashboard from "../pages/Dashboard";
import Trades from "../pages/Trades";
import TradeDetail from "../pages/TradeDetail/TradeDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,  // <--- le layout avec sidebar
    children: [
      { index: true, element: <Dashboard /> },
      { path: "trades", element: <Trades /> },
      { path: "trades/:id", element: <TradeDetail /> },
    ],
  },
]);

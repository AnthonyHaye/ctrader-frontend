// Type d’ordre, Entrée, SL/TP d’origine, R/R, Volume, Taille

import Field from "../ui/Field";
import Read from "../ui/Read";
import { plannedRR, riskPercent } from "../../../../utils/derive";
import { originalSLTP } from "../helpers";

export default function ReadonlyInfo({ trade, showSLTP = true }) {
  const { sl, tp } = originalSLTP(trade);
  const rrPlanned = plannedRR({
    entryPrice: trade.technical?.entryPrice, stopLoss: sl, takeProfit: tp,
    direction: trade.direction,
  });
  const volPct = riskPercent({
    capitalAtTrade: trade.capitalAtTrade, riskAmountEur: trade.riskAmountEur,
  });
  return (
    <>
      <Field label="Type d’ordre"><Read>{trade.technical?.orderType ?? "-"}</Read></Field>
      <Field label="Point d’entrée"><Read>{trade.technical?.entryPrice ?? "-"}</Read></Field>
      {showSLTP && (
        <>
          <Field label="SL d’origine (niveau)"><Read>{sl ?? "-"}</Read></Field>
          <Field label="TP d’origine"><Read>{tp ?? "-"}</Read></Field>
        </>
      )}
      <Field label="R/R prévu (auto)"><Read>{rrPlanned ?? "-"}</Read></Field>
      <Field label="Volume engagé (% capital) (auto)">
        <Read>{volPct != null ? `${volPct}%` : "-"}</Read>
      </Field>
      <Field label="Taille (unités)"><Read>{trade.technical?.positionSize ?? "-"}</Read></Field>
    </>
  );
}

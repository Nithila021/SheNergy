import json
import sys
from typing import Any, Dict, List

"""
Simple predictive maintenance model for SheNergy.

Reads JSON from stdin with keys:
  customer_id: str
  vin: str
  history: list[service records]
  vehicle_features: dict

Outputs JSON to stdout:
  { "recommendations": [ { "service_code": str, "priority": int, "reason": str } ] }

This is a lightweight refactor from the original notebook, simplified to
rule-based + placeholder ML-style scoring so it can run without external
CSV files. You can plug in a real trained model here later.
"""


def build_recommendations(payload: Dict[str, Any]) -> List[Dict[str, Any]]:
    history = payload.get("history", [])
    vehicle = payload.get("vehicle_features", {})

    mileage = vehicle.get("mileage_km") or vehicle.get("odometer", 0)
    issues = []  # flatten textual issues
    for rec in history:
        for issue in rec.get("issues_reported", []):
            issues.append(str(issue).lower())

    recs: List[Dict[str, Any]] = []

    # Basic mileage-based recommendations
    if mileage is not None:
        try:
            m = float(mileage)
        except Exception:
            m = 0.0
        if m >= 28000:
            recs.append({
                "service_code": "PERIODIC_30K",
                "priority": 1,
                "reason": "Odometer near or above 30,000 km based on Indian city usage."
            })
        elif m >= 18000:
            recs.append({
                "service_code": "PERIODIC_20K",
                "priority": 2,
                "reason": "Odometer near or above 20,000 km; recommend periodic service."
            })
        elif m >= 8000:
            recs.append({
                "service_code": "PERIODIC_10K",
                "priority": 3,
                "reason": "Odometer near or above 10,000 km; basic periodic service."
            })

    # Issue-based rules, inspired by correlations in the original notebook
    issues_text = " ".join(issues)
    if "brake" in issues_text or "spongy" in issues_text:
        recs.append({
            "service_code": "BRAKE_CHECK",
            "priority": 1,
            "reason": "User reported brake-related issues; brake inspection is critical."
        })

    if "pickup" in issues_text or "power" in issues_text:
        recs.append({
            "service_code": "PERIODIC_20K",
            "priority": 2,
            "reason": "Reported pickup drop; periodic service and inspection recommended."
        })

    if "clutch" in issues_text or "hard" in issues_text:
        recs.append({
            "service_code": "CLUTCH_ADJUST",
            "priority": 2,
            "reason": "Reported clutch hardness; clutch adjustment advised for BLR traffic conditions."
        })

    # Fallback if nothing inferred
    if not recs:
        recs.append({
            "service_code": "PERIODIC_10K",
            "priority": 3,
            "reason": "Default preventive periodic service recommendation for city driving."
        })

    # De-duplicate by service_code keeping highest priority
    best: Dict[str, Dict[str, Any]] = {}
    for r in recs:
        code = r["service_code"]
        if code not in best or r["priority"] < best[code]["priority"]:
            best[code] = r

    # Sort by priority ascending
    out = sorted(best.values(), key=lambda x: x["priority"])
    return out


def main() -> None:
    try:
        raw = sys.stdin.read()
        if not raw.strip():
            raise ValueError("Empty stdin for predictive model")
        payload = json.loads(raw)
        recs = build_recommendations(payload)
        out = {"recommendations": recs}
        sys.stdout.write(json.dumps(out))
        sys.stdout.flush()
    except Exception as exc:  # Fail-safe output
        fallback = {
            "recommendations": [
                {
                    "service_code": "PERIODIC_10K",
                    "priority": 3,
                    "reason": f"Fallback recommendation due to model error: {exc}"
                }
            ]
        }
        sys.stdout.write(json.dumps(fallback))
        sys.stdout.flush()


if __name__ == "__main__":
    main()

"""Generate versioned, offline teaching data for the stage 3 browser application."""

from __future__ import annotations

import json
import math
from datetime import datetime, timezone
from pathlib import Path

import CoolProp
from CoolProp.CoolProp import HAPropsSI, PhaseSI, PropsSI

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "public" / "data" / "stage3-thermodynamics.json"
ALGORITHM_VERSION = "1.0.0"
FLUID = "R134a"


def rounded(value: float, digits: int = 5) -> float:
    if not math.isfinite(value):
        raise ValueError(f"non-finite result: {value}")
    return round(float(value), digits)


def state_point(point_id: str, pressure_pa: float, temperature_k: float | None, enthalpy_jkg: float | None) -> dict:
    if enthalpy_jkg is None:
        assert temperature_k is not None
        enthalpy_jkg = PropsSI("H", "P", pressure_pa, "T", temperature_k, FLUID)
    if temperature_k is None:
        temperature_k = PropsSI("T", "P", pressure_pa, "H", enthalpy_jkg, FLUID)
    phase = PhaseSI("P", pressure_pa, "H", enthalpy_jkg, FLUID)
    quality = None
    if "twophase" in phase:
        quality = rounded(PropsSI("Q", "P", pressure_pa, "H", enthalpy_jkg, FLUID), 6)
    return {
        "id": point_id,
        "pressureMPa": rounded(pressure_pa / 1e6, 6),
        "temperatureC": rounded(temperature_k - 273.15, 4),
        "enthalpyKJkg": rounded(enthalpy_jkg / 1000, 4),
        "entropyKJkgK": rounded(PropsSI("S", "P", pressure_pa, "H", enthalpy_jkg, FLUID) / 1000, 6),
        "quality": quality,
        "phase": phase,
    }


def refrigerant_data() -> dict:
    evap_c = 5.0
    cond_c = 50.0
    superheat_k = 8.0
    subcool_k = 5.0
    efficiency = 0.70
    p_low = PropsSI("P", "T", evap_c + 273.15, "Q", 1, FLUID)
    p_high = PropsSI("P", "T", cond_c + 273.15, "Q", 0, FLUID)

    t1 = evap_c + superheat_k + 273.15
    h1 = PropsSI("H", "P", p_low, "T", t1, FLUID)
    s1 = PropsSI("S", "P", p_low, "T", t1, FLUID)
    h2s = PropsSI("H", "P", p_high, "S", s1, FLUID)
    h2 = h1 + (h2s - h1) / efficiency
    t2 = PropsSI("T", "P", p_high, "H", h2, FLUID)
    t3 = cond_c - subcool_k + 273.15
    h3 = PropsSI("H", "P", p_high, "T", t3, FLUID)
    h4 = h3

    points = [
        state_point("1", p_low, t1, h1),
        state_point("2", p_high, t2, h2),
        state_point("3", p_high, t3, h3),
        state_point("4", p_low, None, h4),
    ]
    w_comp = (h2 - h1) / 1000
    q_cond = (h2 - h3) / 1000
    q_evap = (h1 - h4) / 1000
    balance_error = q_cond - q_evap - w_comp

    dome_liquid: list[dict] = []
    dome_vapor: list[dict] = []
    for index in range(91):
        temp_c = -30 + index * (130 / 90)
        temp_k = temp_c + 273.15
        for quality, target in ((0, dome_liquid), (1, dome_vapor)):
            target.append({
                "temperatureC": rounded(temp_c, 3),
                "pressureMPa": rounded(PropsSI("P", "T", temp_k, "Q", quality, FLUID) / 1e6, 6),
                "enthalpyKJkg": rounded(PropsSI("H", "T", temp_k, "Q", quality, FLUID) / 1000, 4),
            })

    checks = {
        "pressureOrder": p_high > p_low,
        "compressionRaisesTemperatureAndEnthalpy": points[1]["temperatureC"] > points[0]["temperatureC"] and h2 > h1,
        "throttleIsenthalpicErrorKJkg": rounded(abs(h4 - h3) / 1000, 9),
        "state4IsTwoPhase": points[3]["quality"] is not None and 0 < points[3]["quality"] < 1,
        "energyBalanceErrorKJkg": rounded(balance_error, 9),
    }
    if not all(value is True or (isinstance(value, float) and value < 1e-6) for value in checks.values()):
        raise ValueError(f"refrigerant validation failed: {checks}")

    return {
        "fluid": FLUID,
        "calculationMethod": "CoolProp PropsSI; saturated pressures at specified evaporating/condensing temperatures; compressor outlet from isentropic reference and specified efficiency; state 3 from subcooling; state 4 from h4=h3.",
        "chartRange": {"saturationTemperatureC": [-30, 100], "pressureMPa": [0.12, 4.5], "enthalpyKJkg": [150, 500]},
        "assumptions": {
            "evaporatingSaturationTemperatureC": evap_c,
            "condensingSaturationTemperatureC": cond_c,
            "suctionSuperheatK": superheat_k,
            "liquidSubcoolingK": subcool_k,
            "compressorIsentropicEfficiency": efficiency,
            "steadyState": True,
            "pressureDropInHeatExchangersNeglected": True,
            "throttlingIsenthalpic": True,
        },
        "states": points,
        "processes": [
            {"id": "1-2", "label": "压缩", "component": "compressor", "from": "1", "to": "2"},
            {"id": "2-3", "label": "冷凝放热", "component": "condenser", "from": "2", "to": "3"},
            {"id": "3-4", "label": "等焓节流", "component": "capillary", "from": "3", "to": "4"},
            {"id": "4-1", "label": "蒸发吸热", "component": "evaporator", "from": "4", "to": "1"},
        ],
        "energyPerKg": {
            "compressorWorkKJkg": rounded(w_comp, 4),
            "evaporatorHeatKJkg": rounded(q_evap, 4),
            "condenserHeatKJkg": rounded(q_cond, 4),
            "heatingCOP": rounded(q_cond / w_comp, 4),
            "statement": "q_cond ≈ q_evap + w_comp; unit-mass refrigerant basis, not measured whole-machine COP",
        },
        "saturationDome": {"liquid": dome_liquid, "vapor": dome_vapor},
        "criticalPoint": {
            "temperatureC": rounded(PropsSI("Tcrit", FLUID) - 273.15, 4),
            "pressureMPa": rounded(PropsSI("pcrit", FLUID) / 1e6, 6),
        },
        "checks": checks,
    }


def humid_state(point_id: str, temp_c: float, pressure_pa: float, rh: float | None = None, humidity_ratio: float | None = None) -> dict:
    temp_k = temp_c + 273.15
    if humidity_ratio is None:
        assert rh is not None
        humidity_ratio = HAPropsSI("W", "T", temp_k, "P", pressure_pa, "R", rh)
    if rh is None:
        rh = HAPropsSI("R", "T", temp_k, "P", pressure_pa, "W", humidity_ratio)
    return {
        "id": point_id,
        "dryBulbC": rounded(temp_c, 4),
        "relativeHumidity": rounded(rh, 6),
        "humidityRatioKgKgDryAir": rounded(humidity_ratio, 7),
        "enthalpyKJkgDryAir": rounded(HAPropsSI("H", "T", temp_k, "P", pressure_pa, "W", humidity_ratio) / 1000, 4),
        "dewPointC": rounded(HAPropsSI("D", "T", temp_k, "P", pressure_pa, "W", humidity_ratio) - 273.15, 4),
    }


def humid_air_data() -> dict:
    pressure_pa = 101325.0
    point_a = humid_state("A", 20.0, pressure_pa, rh=0.85)
    point_b = humid_state("B", 50.0, pressure_pa, humidity_ratio=point_a["humidityRatioKgKgDryAir"])
    point_c = humid_state("C", 35.0, pressure_pa, rh=0.60)
    points = [point_a, point_b, point_c]
    condensed = point_c["humidityRatioKgKgDryAir"] - point_a["humidityRatioKgKgDryAir"]
    coil_surface_c = 10.0

    rh_curves = []
    for rh_percent in range(10, 101, 10):
        curve = []
        for temp_c in range(5, 61):
            w = HAPropsSI("W", "T", temp_c + 273.15, "P", pressure_pa, "R", rh_percent / 100)
            curve.append({"dryBulbC": temp_c, "humidityRatioGkg": rounded(w * 1000, 4)})
        rh_curves.append({"relativeHumidityPercent": rh_percent, "points": curve})

    enthalpy_lines = []
    for h_kjkg in range(20, 121, 20):
        line = []
        for temp_c in range(5, 61):
            try:
                w = HAPropsSI("W", "T", temp_c + 273.15, "P", pressure_pa, "H", h_kjkg * 1000)
                w_sat = HAPropsSI("W", "T", temp_c + 273.15, "P", pressure_pa, "R", 1.0)
                if 0 <= w <= w_sat:
                    line.append({"dryBulbC": temp_c, "humidityRatioGkg": rounded(w * 1000, 4)})
            except ValueError:
                continue
        enthalpy_lines.append({"enthalpyKJkgDryAir": h_kjkg, "points": line})

    checks = {
        "condenserHeatingConstantHumidityRatioError": rounded(abs(point_b["humidityRatioKgKgDryAir"] - point_a["humidityRatioKgKgDryAir"]), 9),
        "drumMoisturePickupPositive": point_c["humidityRatioKgKgDryAir"] > point_b["humidityRatioKgKgDryAir"],
        "evaporatorDehumidificationPositive": condensed > 0,
        "coilBelowDrumOutletDewPoint": coil_surface_c < point_c["dewPointC"],
    }
    if not all(value is True or (isinstance(value, float) and value < 1e-6) for value in checks.values()):
        raise ValueError(f"humid-air validation failed: {checks}")

    return {
        "calculationMethod": "CoolProp HAPropsSI at fixed total pressure; states defined by T/RH or T/humidity ratio; RH and enthalpy chart curves recomputed point-by-point.",
        "chartRange": {"dryBulbC": [5, 60], "humidityRatioGkgDryAir": [0, 40]},
        "assumptions": {
            "pressurePa": pressure_pa,
            "pressureKPa": pressure_pa / 1000,
            "evaporatorSurfaceTemperatureC": coil_surface_c,
            "stateDefinition": "A evaporator outlet / B condenser outlet / C drum outlet",
            "teachingScenario": True,
            "notDynamicDryingModel": True,
        },
        "states": points,
        "processes": [
            {"id": "heating", "label": "冷凝器加热", "from": "A", "to": "B", "component": "condenser"},
            {"id": "humidifying", "label": "滚筒吸湿", "from": "B", "to": "C", "component": "drum", "strictlyIsenthalpic": False},
            {"id": "dehumidifying", "label": "蒸发器冷却除湿", "from": "C", "to": "A", "component": "evaporator"},
        ],
        "condensedWaterKgPerKgDryAir": rounded(condensed, 7),
        "chart": {"rhCurves": rh_curves, "enthalpyLines": enthalpy_lines},
        "checks": checks,
    }


def main() -> None:
    generated = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    payload = {
        "schemaVersion": "1.0.0",
        "algorithmVersion": ALGORITHM_VERSION,
        "generatedAtUtc": generated,
        "library": {
            "name": "CoolProp",
            "version": CoolProp.__version__,
            "gitRevision": getattr(CoolProp, "__gitrevision__", "unavailable"),
            "license": "MIT",
        },
        "units": {
            "pressure": "MPa (chart/state); Pa (humid-air input)",
            "temperature": "°C",
            "specificEnthalpy": "kJ/kg refrigerant or kJ/kg dry air as named",
            "specificEntropy": "kJ/(kg·K)",
            "humidityRatio": "kg water/kg dry air",
        },
        "scope": "Static discrete teaching scenario; not calibrated dryer performance or drying-time simulation.",
        "applicability": "Only the stated R134a and humid-air inputs are validated. Chart clipping ranges are visualization bounds, not fluid-property validity limits.",
        "sources": [
            "https://coolprop.org/fluid_properties/fluids/R134a.html",
            "https://coolprop.org/fluid_properties/HumidAir.html",
            "https://coolprop.org/coolprop/HighLevelAPI.html",
        ],
        "refrigerant": refrigerant_data(),
        "humidAir": humid_air_data(),
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"generated {OUTPUT.relative_to(ROOT)} with CoolProp {CoolProp.__version__}")


if __name__ == "__main__":
    main()

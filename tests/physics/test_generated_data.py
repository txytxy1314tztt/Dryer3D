from __future__ import annotations

import json
import math
import unittest
from pathlib import Path

from CoolProp.CoolProp import PropsSI

ROOT = Path(__file__).resolve().parents[2]
DATA = json.loads((ROOT / "public" / "data" / "stage3-thermodynamics.json").read_text(encoding="utf-8"))


class RefrigerantTests(unittest.TestCase):
    def setUp(self) -> None:
        self.states = {item["id"]: item for item in DATA["refrigerant"]["states"]}

    def test_high_and_low_pressure_sides(self) -> None:
        self.assertGreater(self.states["2"]["pressureMPa"], self.states["1"]["pressureMPa"])
        self.assertAlmostEqual(self.states["2"]["pressureMPa"], self.states["3"]["pressureMPa"], places=5)
        self.assertAlmostEqual(self.states["1"]["pressureMPa"], self.states["4"]["pressureMPa"], places=5)

    def test_throttle_isenthalpic_and_two_phase(self) -> None:
        self.assertAlmostEqual(self.states["3"]["enthalpyKJkg"], self.states["4"]["enthalpyKJkg"], places=3)
        self.assertGreater(self.states["4"]["quality"], 0)
        self.assertLess(self.states["4"]["quality"], 1)

    def test_energy_balance_and_positive_cop(self) -> None:
        energy = DATA["refrigerant"]["energyPerKg"]
        self.assertAlmostEqual(energy["condenserHeatKJkg"], energy["evaporatorHeatKJkg"] + energy["compressorWorkKJkg"], places=3)
        self.assertGreater(energy["heatingCOP"], 1)

    def test_state_values_reproduce_with_coolprop(self) -> None:
        for state in self.states.values():
            h = PropsSI("H", "P", state["pressureMPa"] * 1e6, "T", state["temperatureC"] + 273.15, "R134a") / 1000
            if state["quality"] is None:
                self.assertTrue(math.isclose(h, state["enthalpyKJkg"], rel_tol=2e-5))


class HumidAirTests(unittest.TestCase):
    def setUp(self) -> None:
        self.states = {item["id"]: item for item in DATA["humidAir"]["states"]}

    def test_heating_keeps_humidity_ratio(self) -> None:
        self.assertAlmostEqual(self.states["A"]["humidityRatioKgKgDryAir"], self.states["B"]["humidityRatioKgKgDryAir"], places=6)

    def test_moisture_pickup_and_dehumidification(self) -> None:
        self.assertGreater(self.states["C"]["humidityRatioKgKgDryAir"], self.states["B"]["humidityRatioKgKgDryAir"])
        self.assertGreater(DATA["humidAir"]["condensedWaterKgPerKgDryAir"], 0)

    def test_condensation_condition(self) -> None:
        surface = DATA["humidAir"]["assumptions"]["evaporatorSurfaceTemperatureC"]
        self.assertLess(surface, self.states["C"]["dewPointC"])


if __name__ == "__main__":
    unittest.main()

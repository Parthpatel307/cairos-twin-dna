import json
import unittest
from dataclasses import fields
from pathlib import Path

from agent.agentdna.event import (
    ALLOWED_ACTORS,
    ALLOWED_EVENT_TYPES,
    ExecutionEvent,
)


class TestExecutionEventSchema(unittest.TestCase):

    def setUp(self):
        schema_path = (
            Path(__file__).resolve().parents[2]
            / "shared"
            / "schemas"
            / "execution_event.schema.json"
        )

        with schema_path.open("r", encoding="utf-8") as file:
            self.schema = json.load(file)

    def test_schema_fields_match_python_model(self):
        model_fields = {
            field.name
            for field in fields(ExecutionEvent)
        }

        schema_fields = set(
            self.schema["properties"].keys()
        )

        self.assertEqual(
            model_fields,
            schema_fields,
        )

    def test_required_fields_match_core_model_fields(self):
        self.assertEqual(
            set(self.schema["required"]),
            {
                "event_id",
                "run_id",
                "sequence",
                "timestamp",
                "event_type",
                "actor",
            },
        )

    def test_event_types_match(self):
        schema_event_types = set(
            self.schema["properties"]["event_type"]["enum"]
        )

        self.assertEqual(
            schema_event_types,
            ALLOWED_EVENT_TYPES,
        )

    def test_actors_match(self):
        schema_actors = set(
            self.schema["properties"]["actor"]["enum"]
        )

        self.assertEqual(
            schema_actors,
            ALLOWED_ACTORS,
        )

    def test_serialized_event_contains_schema_fields(self):
        event = ExecutionEvent(
            event_id="evt_105",
            run_id="run_105",
            sequence=1,
            event_type="tool_call",
            actor="agent",
        )

        serialized = event.to_dict()

        self.assertEqual(
            set(serialized.keys()),
            set(self.schema["properties"].keys()),
        )


if __name__ == "__main__":
    unittest.main()
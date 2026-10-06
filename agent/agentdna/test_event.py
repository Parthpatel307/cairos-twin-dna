import unittest

from agent.agentdna.event import ExecutionEvent


class TestExecutionEvent(unittest.TestCase):

    def test_event_creation_and_serialization(self):
        event = ExecutionEvent(
            event_id="evt_001",
            run_id="run_001",
            sequence=1,
            event_type="tool_call",
            actor="agent",
            action="inspect_repository",
            tool="list_repo",
            input={
                "repository": "demo-repository"
            },
        )

        data = event.to_dict()

        self.assertEqual(data["event_id"], "evt_001")
        self.assertEqual(data["run_id"], "run_001")
        self.assertEqual(data["sequence"], 1)
        self.assertEqual(data["event_type"], "tool_call")
        self.assertEqual(data["actor"], "agent")
        self.assertEqual(data["action"], "inspect_repository")
        self.assertEqual(data["tool"], "list_repo")
        self.assertEqual(
            data["input"],
            {"repository": "demo-repository"},
        )


if __name__ == "__main__":
    unittest.main()